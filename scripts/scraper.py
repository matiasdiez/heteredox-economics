#!/usr/bin/env python3
"""
Heterodox Economics Newsletter RSS & Data Scraper.
Extracts newsletter issues, articles, categories, individual journal papers, and editorial notes.
Generates:
- public/feed.xml: RSS 2.0 feed per issue (full newsletter edition)
- public/journals.xml: RSS 2.0 feed of INDIVIDUAL academic articles/papers published in journals
- public/articles.xml: RSS 2.0 feed per individual article/announcement (Papers, CFPs, Books, Jobs)
- public/cfp.xml, jobs.xml, books.xml: Filtered category RSS feeds
- public/data.json: JSON dataset powering the web frontend where EACH paper is an article entry
"""

import os
import re
import json
import time
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import format_datetime
from bs4 import BeautifulSoup

BASE_URL = "https://www.heterodoxnews.com/n/"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HeterodoxRSSBot/1.0"

def get_html(url: str, max_retries: int = 3) -> str | None:
    """Fetch HTML content with retries and realistic headers."""
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }
    )
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                if resp.status == 200:
                    return resp.read().decode("utf-8", errors="ignore")
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            time.sleep(1 + attempt)
        except Exception:
            time.sleep(1 + attempt)
    return None

def discover_available_issues() -> list[int]:
    """Find all issue numbers from directory listing and sequential probing."""
    issues = set()
    
    index_html = get_html(BASE_URL)
    if index_html:
        found = re.findall(r'htn(\d+)\.html', index_html)
        for num_str in found:
            issues.add(int(num_str))
    
    if not issues:
        issues.add(363)
    
    max_known = max(issues)
    print(f"Max issue found in index: {max_known}")
    
    consecutive_404s = 0
    test_num = max_known + 1
    while consecutive_404s < 2:
        test_url = f"{BASE_URL}htn{test_num}.html"
        html = get_html(test_url)
        if html and ("Heterodox" in html or "table-of-contents" in html):
            print(f"Discovered new unlisted issue: {test_num}")
            issues.add(test_num)
            consecutive_404s = 0
            test_num += 1
        else:
            consecutive_404s += 1
            test_num += 1
            
    sorted_issues = sorted(list(issues))
    return sorted_issues

def parse_date(date_str: str) -> datetime:
    """Parse date strings like 'August 24, 2026' into a timezone-aware datetime."""
    if not date_str:
        return datetime.now(timezone.utc)
    clean_date = date_str.strip()
    clean_date = re.sub(r'\s+', ' ', clean_date)
    formats = [
        "%B %d, %Y",
        "%B %d %Y",
        "%d %B %Y",
        "%b %d, %Y",
        "%Y-%m-%d"
    ]
    for fmt in formats:
        try:
            dt = datetime.strptime(clean_date, fmt)
            return dt.replace(tzinfo=timezone.utc)
        except ValueError:
            continue
    return datetime.now(timezone.utc)

def extract_deadline(text: str) -> str | None:
    """Extract deadlines like 'Submission Deadline: 10 December 2026'."""
    match = re.search(r'(?:Submission|Application|Registration|Extended Submission)?\s*Deadline[:\s]+([0-9]{1,2}\s+[A-Za-z]+\s+[0-9]{4}|[A-Za-z]+\s+[0-9]{1,2},?\s+[0-9]{4})', text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return None

def parse_issue(issue_num: int) -> dict | None:
    """Parse a single Heterodox News issue HTML."""
    url = f"{BASE_URL}htn{issue_num}.html"
    html = get_html(url)
    if not html:
        return None
        
    soup = BeautifulSoup(html, "html.parser")
    
    # 1. Title & Issue Header
    h1 = soup.find("h1")
    title = h1.get_text(strip=True) if h1 else f"Heterodox Economics Newsletter #{issue_num}"
    
    issue_info_el = soup.find(class_="issue-info")
    raw_date_str = ""
    pdf_url = f"{BASE_URL}htn{issue_num}.pdf"
    
    if issue_info_el:
        date_el = issue_info_el.find(class_="date")
        if date_el:
            raw_date_str = date_el.get_text(strip=True)
        pdf_el = issue_info_el.find(class_="pdf-version")
        if pdf_el and pdf_el.find("a"):
            pdf_url = pdf_el.find("a").get("href", pdf_url)
            
    parsed_dt = parse_date(raw_date_str)
    
    # 2. Editorial
    editorial_el = soup.find(class_="editorial")
    editorial_html = ""
    editorial_text = ""
    if editorial_el:
        for a in editorial_el.find_all("a"):
            a["target"] = "_blank"
            a["rel"] = "noopener noreferrer"
        editorial_html = str(editorial_el)
        editorial_text = editorial_el.get_text(separator="\n", strip=True)

    # 3. Categories and Articles
    categories = []
    category_map = {}
    all_journal_papers = []
    
    for h2 in soup.find_all("h2", class_="category"):
        cat_name = h2.get_text(strip=True)
        if not cat_name or cat_name.lower() == "table of contents":
            continue
            
        articles = []
        curr = h2.next_sibling
        while curr:
            if getattr(curr, "name", None) == "h2":
                break
            if getattr(curr, "name", None) == "h3" and "article" in curr.get("class", []):
                art_id = curr.get("id", "")
                art_title = curr.get_text(strip=True)
                art_link = f"{url}#{art_id}" if art_id else url
                
                # Gather content nodes
                art_body_nodes = []
                sibling = curr.next_sibling
                while sibling and getattr(sibling, "name", None) not in ["h2", "h3"]:
                    if hasattr(sibling, "name") and sibling.name in ["p", "ul", "ol", "div", "blockquote", "h4"]:
                        for a in sibling.find_all("a"):
                            a["target"] = "_blank"
                            a["rel"] = "noopener noreferrer"
                        art_body_nodes.append(str(sibling))
                    elif isinstance(sibling, str) and sibling.strip():
                        art_body_nodes.append(f"<p>{sibling.strip()}</p>")
                    sibling = sibling.next_sibling
                    
                body_html = "".join(art_body_nodes).strip()
                body_soup = BeautifulSoup(body_html, "html.parser")
                body_text = body_soup.get_text(separator=" ", strip=True)
                deadline = extract_deadline(body_text)
                
                # Extract external links from the body
                external_links = []
                for a in body_soup.find_all("a", href=True):
                    href = a["href"]
                    anchor_text = a.get_text(strip=True) or href
                    if href.startswith("http") and not href.startswith(BASE_URL):
                        external_links.append({"text": anchor_text, "url": href})
                
                # Extract individual papers if this is a Journal entry
                papers = []
                if "journal" in cat_name.lower():
                    for p_node in body_soup.find_all(["p", "li"]):
                        for a_tag in p_node.find_all("a", href=True):
                            p_title = a_tag.get_text(strip=True)
                            p_url = a_tag["href"].strip()
                            if p_title and p_url.startswith("http") and not p_url.startswith(BASE_URL):
                                full_p_text = p_node.get_text(separator=" ", strip=True)
                                author = ""
                                if ":" in full_p_text:
                                    author = full_p_text.split(":", 1)[0].strip()
                                elif p_title in full_p_text:
                                    author = full_p_text.split(p_title)[0].strip().rstrip(":").rstrip("-").strip()
                                
                                if len(author) > 160 or author.lower().startswith("please find") or author.lower().startswith("http"):
                                    author = ""
                                    
                                paper_obj = {
                                    "title": p_title,
                                    "author": author,
                                    "link": p_url,
                                    "journal": art_title,
                                    "issue_num": issue_num,
                                    "issue_date": raw_date_str,
                                    "iso_date": parsed_dt.isoformat(),
                                    "newsletter_link": art_link
                                }
                                papers.append(paper_obj)
                                all_journal_papers.append(paper_obj)

                articles.append({
                    "id": art_id,
                    "title": art_title,
                    "category": cat_name,
                    "link": art_link,
                    "body_html": body_html,
                    "body_text": body_text[:600] + ("..." if len(body_text) > 600 else ""),
                    "full_text": body_text,
                    "deadline": deadline,
                    "external_links": external_links[:8],
                    "papers": papers,
                    "issue_num": issue_num,
                    "issue_date": raw_date_str,
                    "iso_date": parsed_dt.isoformat()
                })
            curr = curr.next_sibling
            
        if articles:
            categories.append({
                "name": cat_name,
                "count": len(articles),
                "articles": articles
            })
            category_map[cat_name] = len(articles)

    return {
        "issue_num": issue_num,
        "title": f"Heterodox Economics Newsletter #{issue_num}",
        "url": url,
        "pdf_url": pdf_url,
        "date_str": raw_date_str,
        "iso_date": parsed_dt.isoformat(),
        "rfc822_date": format_datetime(parsed_dt),
        "editorial_html": editorial_html,
        "editorial_text": editorial_text,
        "total_articles": sum(len(c["articles"]) for c in categories),
        "total_papers": len(all_journal_papers),
        "journal_papers": all_journal_papers,
        "categories": categories
    }

def generate_issues_rss(issues: list[dict], output_path: str):
    """Generate RSS 2.0 feed where each item is a full newsletter issue."""
    rss = ET.Element("rss", version="2.0", attrib={"xmlns:atom": "http://www.w3.org/2005/Atom"})
    channel = ET.SubElement(rss, "channel")
    
    ET.SubElement(channel, "title").text = "Heterodox Economics Newsletter (Issues Feed)"
    ET.SubElement(channel, "link").text = "https://www.heterodoxnews.com/n/"
    ET.SubElement(channel, "description").text = (
        "Complete newsletter editions of Heterodox Economics Newsletter. "
        "Includes editorial notes and full table of contents with calls for papers, journals, books, and jobs."
    )
    ET.SubElement(channel, "language").text = "en"
    ET.SubElement(channel, "lastBuildDate").text = format_datetime(datetime.now(timezone.utc))
    
    for issue in issues:
        item = ET.SubElement(channel, "item")
        ET.SubElement(item, "title").text = f"Heterodox Economics Newsletter #{issue['issue_num']} ({issue['date_str']})"
        ET.SubElement(item, "link").text = issue["url"]
        
        guid = ET.SubElement(item, "guid", isPermaLink="true")
        guid.text = issue["url"]
        
        ET.SubElement(item, "pubDate").text = issue["rfc822_date"]
        
        desc_parts = []
        if issue["editorial_html"]:
            desc_parts.append("<h3>Editorial</h3>")
            desc_parts.append(issue["editorial_html"])
            
        desc_parts.append("<h3>Table of Contents</h3><ul>")
        for cat in issue["categories"]:
            desc_parts.append(f"<li><strong>{cat['name']}</strong> ({cat['count']})<ul>")
            for art in cat["articles"]:
                desc_parts.append(f'<li><a href="{art["link"]}">{art["title"]}</a></li>')
            desc_parts.append("</ul></li>")
        desc_parts.append("</ul>")
        
        desc_parts.append(f'<p><a href="{issue["pdf_url"]}">Download PDF Edition</a> | <a href="{issue["url"]}">View Web Edition</a></p>')
        
        ET.SubElement(item, "description").text = "".join(desc_parts)

    tree = ET.ElementTree(rss)
    ET.indent(tree, space="  ")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    tree.write(output_path, encoding="utf-8", xml_declaration=True)
    print(f"Generated Issues RSS Feed: {output_path} ({len(issues)} issues)")

def generate_journals_rss(issues: list[dict], output_path: str, max_items: int = 300):
    """
    Generate RSS 2.0 feed where EACH ITEM is an individual published journal article/paper.
    Lists authors, article title, journal volume/issue, and direct link to the paper.
    """
    rss = ET.Element("rss", version="2.0", attrib={"xmlns:atom": "http://www.w3.org/2005/Atom"})
    channel = ET.SubElement(rss, "channel")
    
    ET.SubElement(channel, "title").text = "Heterodox Economics - Journal Articles & Papers"
    ET.SubElement(channel, "link").text = "https://www.heterodoxnews.com/n/"
    ET.SubElement(channel, "description").text = (
        "Individual academic articles, research papers, and special issues published in heterodox economics journals, "
        "extracted from the Heterodox Economics Newsletter."
    )
    ET.SubElement(channel, "language").text = "en"
    ET.SubElement(channel, "lastBuildDate").text = format_datetime(datetime.now(timezone.utc))
    
    all_papers = []
    for issue in issues:
        for cat in issue["categories"]:
            if "journal" in cat["name"].lower():
                for art in cat["articles"]:
                    if art.get("papers"):
                        all_papers.extend(art["papers"])
                    else:
                        all_papers.append({
                            "title": art["title"],
                            "author": "",
                            "link": art["link"],
                            "journal": art["title"],
                            "issue_num": art["issue_num"],
                            "issue_date": art["issue_date"],
                            "iso_date": art["iso_date"],
                            "newsletter_link": art["link"],
                            "fallback_body": art["body_html"]
                        })
                        
    all_papers = all_papers[:max_items]
    
    for paper in all_papers:
        item = ET.SubElement(channel, "item")
        
        # Clear title: Author: "Paper Title" [Journal Name]
        if paper.get("author"):
            item_title = f"{paper['author']}: \"{paper['title']}\" [{paper['journal']}]"
        else:
            item_title = f"{paper['title']} [{paper['journal']}]"
            
        ET.SubElement(item, "title").text = item_title
        ET.SubElement(item, "link").text = paper["link"]
        
        guid = ET.SubElement(item, "guid", isPermaLink="false")
        guid.text = f"{paper['link']}#{paper['issue_num']}"
        
        ET.SubElement(item, "category").text = "Journals"
        ET.SubElement(item, "category").text = paper["journal"]
        
        paper_dt = parse_date(paper.get("issue_date", ""))
        ET.SubElement(item, "pubDate").text = format_datetime(paper_dt)
        
        if paper.get("fallback_body"):
            desc = paper["fallback_body"]
        else:
            author_p = f"<p><strong>Author(s):</strong> {paper['author']}</p>" if paper.get("author") else ""
            desc = f"""<p><strong>Article:</strong> <a href="{paper['link']}" target="_blank">{paper['title']}</a></p>{author_p}<p><strong>Journal:</strong> {paper['journal']}</p><p><br/><small>Listed in Heterodox Economics Newsletter #{paper['issue_num']} ({paper['issue_date']}) | <a href="{paper['newsletter_link']}">View in Newsletter</a></small></p>"""
            
        ET.SubElement(item, "description").text = desc

    tree = ET.ElementTree(rss)
    ET.indent(tree, space="  ")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    tree.write(output_path, encoding="utf-8", xml_declaration=True)
    print(f"Generated Journals Papers RSS Feed: {output_path} ({len(all_papers)} individual papers)")

def generate_articles_rss(issues: list[dict], output_path: str, max_items: int = 150):
    """Generate RSS 2.0 feed where each item is an individual article / paper / call / announcement."""
    rss = ET.Element("rss", version="2.0", attrib={"xmlns:atom": "http://www.w3.org/2005/Atom"})
    channel = ET.SubElement(rss, "channel")
    
    ET.SubElement(channel, "title").text = "Heterodox Economics - Calls, Journals & News"
    ET.SubElement(channel, "link").text = "https://www.heterodoxnews.com/n/"
    ET.SubElement(channel, "description").text = (
        "Granular feed of academic articles, Call for Papers, Book releases, and Academic Jobs "
        "from the Heterodox Economics Newsletter."
    )
    ET.SubElement(channel, "language").text = "en"
    ET.SubElement(channel, "lastBuildDate").text = format_datetime(datetime.now(timezone.utc))
    
    flat_items = []
    for issue in issues:
        for cat in issue["categories"]:
            cat_name = cat["name"]
            if "journal" in cat_name.lower():
                for art in cat["articles"]:
                    if art.get("papers"):
                        for p in art["papers"]:
                            flat_items.append({
                                "title": f"[Journals] {p['author'] + ': ' if p.get('author') else ''}{p['title']}",
                                "link": p["link"],
                                "category": "Journals",
                                "issue_date": p["issue_date"],
                                "issue_num": p["issue_num"],
                                "body_html": f"<p><strong>Article:</strong> <a href='{p['link']}'>{p['title']}</a></p><p><strong>Author(s):</strong> {p['author']}</p><p><strong>Journal:</strong> {p['journal']}</p>",
                                "deadline": None
                            })
                    else:
                        flat_items.append(art)
            else:
                for art in cat["articles"]:
                    flat_items.append(art)
                
    flat_items = flat_items[:max_items]
    
    for art in flat_items:
        item = ET.SubElement(channel, "item")
        title_text = art["title"] if art["title"].startswith("[") else f"[{art['category']}] {art['title']}"
        ET.SubElement(item, "title").text = title_text
        ET.SubElement(item, "link").text = art["link"]
        
        guid = ET.SubElement(item, "guid", isPermaLink="false")
        guid.text = f"{art['link']}#{art['issue_num']}"
        
        ET.SubElement(item, "category").text = art["category"]
        
        art_dt = parse_date(art.get("issue_date", ""))
        ET.SubElement(item, "pubDate").text = format_datetime(art_dt)
        
        desc = art.get("body_html") or f"<p>{art.get('body_text', '')}</p>"
        if art.get("deadline"):
            desc = f"<p><strong>Deadline:</strong> {art['deadline']}</p>" + desc
        desc += f'<p><br/><small>From Issue #{art["issue_num"]} ({art["issue_date"]}) | <a href="{art["link"]}">Read in Newsletter</a></small></p>'
        
        ET.SubElement(item, "description").text = desc

    tree = ET.ElementTree(rss)
    ET.indent(tree, space="  ")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    tree.write(output_path, encoding="utf-8", xml_declaration=True)
    print(f"Generated Articles RSS Feed: {output_path} ({len(flat_items)} items)")

def generate_category_rss(issues: list[dict], category_match: str, title: str, description: str, output_path: str, max_items: int = 80):
    """Generate RSS 2.0 feed filtered by a specific category (e.g. Call for Papers, Jobs, Books)."""
    rss = ET.Element("rss", version="2.0", attrib={"xmlns:atom": "http://www.w3.org/2005/Atom"})
    channel = ET.SubElement(rss, "channel")
    
    ET.SubElement(channel, "title").text = title
    ET.SubElement(channel, "link").text = "https://www.heterodoxnews.com/n/"
    ET.SubElement(channel, "description").text = description
    ET.SubElement(channel, "language").text = "en"
    ET.SubElement(channel, "lastBuildDate").text = format_datetime(datetime.now(timezone.utc))
    
    matching_articles = []
    for issue in issues:
        for cat in issue["categories"]:
            if category_match.lower() in cat["name"].lower():
                for art in cat["articles"]:
                    matching_articles.append(art)
                    
    matching_articles = matching_articles[:max_items]
    
    for art in matching_articles:
        item = ET.SubElement(channel, "item")
        ET.SubElement(item, "title").text = art["title"]
        ET.SubElement(item, "link").text = art["link"]
        
        guid = ET.SubElement(item, "guid", isPermaLink="true")
        guid.text = art["link"]
        
        ET.SubElement(item, "category").text = art["category"]
        
        art_dt = parse_date(art.get("issue_date", ""))
        ET.SubElement(item, "pubDate").text = format_datetime(art_dt)
        
        desc = art["body_html"] or f"<p>{art['body_text']}</p>"
        if art.get("deadline"):
            desc = f"<p><strong>Deadline:</strong> {art['deadline']}</p>" + desc
        desc += f'<p><br/><small>From Issue #{art["issue_num"]} ({art["issue_date"]}) | <a href="{art["link"]}">Read in Newsletter</a></small></p>'
        
        ET.SubElement(item, "description").text = desc

    tree = ET.ElementTree(rss)
    ET.indent(tree, space="  ")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    tree.write(output_path, encoding="utf-8", xml_declaration=True)
    print(f"Generated Category RSS Feed ({category_match}): {output_path} ({len(matching_articles)} items)")

def generate_json_dataset(issues: list[dict], output_path: str):
    """
    Generate structured JSON dataset powering the interactive web frontend.
    CRITICAL: For Journals, EACH INDIVIDUAL PAPER IS AN ARTICLE!
    """
    all_categories = {}
    recent_articles = []
    all_journal_papers = []
    
    for issue in issues:
        for cat in issue["categories"]:
            cat_name = cat["name"]
            
            if "journal" in cat_name.lower():
                # Every paper is an individual article in recent_articles!
                for art in cat["articles"]:
                    if art.get("papers"):
                        for p in art["papers"]:
                            paper_entry = {
                                "id": f"{art['id']}-{len(recent_articles)}",
                                "title": p["title"],
                                "author": p.get("author", ""),
                                "journal": p.get("journal", art["title"]),
                                "category": "Journals",
                                "link": p["link"],
                                "body_text": f"Publicado en {p.get('journal', art['title'])}. Autor(es): {p.get('author', 'No especificado')}.",
                                "deadline": None,
                                "issue_num": p["issue_num"],
                                "issue_date": p["issue_date"],
                                "iso_date": p["iso_date"],
                                "newsletter_link": p.get("newsletter_link", art["link"]),
                                "external_links": [{"text": "Abrir Artículo", "url": p["link"]}]
                            }
                            recent_articles.append(paper_entry)
                            all_journal_papers.append(p)
                            all_categories["Journals"] = all_categories.get("Journals", 0) + 1
                    else:
                        recent_articles.append({
                            "id": art["id"],
                            "title": art["title"],
                            "author": "",
                            "journal": art["title"],
                            "category": "Journals",
                            "link": art["link"],
                            "body_text": art["body_text"],
                            "deadline": art["deadline"],
                            "issue_num": art["issue_num"],
                            "issue_date": art["issue_date"],
                            "iso_date": art["iso_date"],
                            "newsletter_link": art["link"],
                            "external_links": art.get("external_links", [])
                        })
                        all_categories["Journals"] = all_categories.get("Journals", 0) + 1
            else:
                all_categories[cat_name] = all_categories.get(cat_name, 0) + cat["count"]
                for art in cat["articles"]:
                    recent_articles.append({
                        "id": art["id"],
                        "title": art["title"],
                        "author": "",
                        "journal": "",
                        "category": art["category"],
                        "link": art["link"],
                        "body_text": art["body_text"],
                        "deadline": art["deadline"],
                        "issue_num": art["issue_num"],
                        "issue_date": art["issue_date"],
                        "iso_date": art["iso_date"],
                        "newsletter_link": art["link"],
                        "external_links": art.get("external_links", [])
                    })

    dataset = {
        "metadata": {
            "title": "Heterodox Economics Newsletter Feed Portal",
            "source_url": "https://www.heterodoxnews.com/",
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "latest_issue": issues[0]["issue_num"] if issues else None,
            "total_issues_indexed": len(issues),
            "total_articles_indexed": len(recent_articles),
            "total_journal_papers_indexed": len(all_journal_papers),
            "categories_summary": [
                {"name": name, "count": count}
                for name, count in sorted(all_categories.items(), key=lambda x: x[1], reverse=True)
            ]
        },
        "issues": issues,
        "recent_articles": recent_articles,
        "journal_papers": all_journal_papers
    }
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)
    print(f"Generated JSON dataset: {output_path} ({len(recent_articles)} total articles)")

def main():
    print("=== Starting Heterodox Economics Newsletter Scraper ===")
    all_issue_numbers = discover_available_issues()
    print(f"Discovered {len(all_issue_numbers)} total issues in archive.")
    
    latest_n = 10
    target_issues = sorted(all_issue_numbers, reverse=True)[:latest_n]
    print(f"Processing latest {len(target_issues)} issues: {target_issues}")
    
    parsed_issues = []
    for num in target_issues:
        print(f"Fetching & parsing Issue #{num}...")
        data = parse_issue(num)
        if data:
            parsed_issues.append(data)
            print(f"  -> Issue #{num} parsed ({data['total_articles']} entries, {data.get('total_papers', 0)} journal papers)")
        time.sleep(0.3)
        
    print(f"\nSuccessfully parsed {len(parsed_issues)} issues.")
    
    # Define outputs
    public_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public")
    feed_xml_path = os.path.join(public_dir, "feed.xml")
    articles_xml_path = os.path.join(public_dir, "articles.xml")
    journals_xml_path = os.path.join(public_dir, "journals.xml")
    cfp_xml_path = os.path.join(public_dir, "cfp.xml")
    jobs_xml_path = os.path.join(public_dir, "jobs.xml")
    books_xml_path = os.path.join(public_dir, "books.xml")
    data_json_path = os.path.join(public_dir, "data.json")
    
    # General Feeds
    generate_issues_rss(parsed_issues, feed_xml_path)
    generate_articles_rss(parsed_issues, articles_xml_path)
    
    # Dedicated Journals Papers RSS Feed (Every paper is an RSS item)
    generate_journals_rss(parsed_issues, journals_xml_path, max_items=350)
    
    # Additional Category Feeds
    generate_category_rss(
        parsed_issues,
        "Call for Papers",
        "Heterodox Economics - Call for Papers",
        "Conferences, workshops, and journal calls for papers from Heterodox Economics Newsletter.",
        cfp_xml_path
    )
    generate_category_rss(
        parsed_issues,
        "Job Postings",
        "Heterodox Economics - Academic Jobs",
        "Academic job vacancies, postdocs, and professorships in heterodox economics.",
        jobs_xml_path
    )
    generate_category_rss(
        parsed_issues,
        "Books",
        "Heterodox Economics - Books & Book Series",
        "New book releases, monographs, and companion series in heterodox economics.",
        books_xml_path
    )

    generate_json_dataset(parsed_issues, data_json_path)
    print("=== Scraper Finished Successfully! ===")

if __name__ == "__main__":
    main()
