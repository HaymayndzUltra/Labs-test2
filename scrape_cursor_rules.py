import argparse, json, os, re, time, urllib.request, urllib.parse, html as htmllib

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="replace")

def ensure_dir(p):
    os.makedirs(p, exist_ok=True)

def abs_url(base, href):
    try:
        return urllib.parse.urljoin(base, href)
    except:
        return None

def slug_from_url(u):
    try:
        p = urllib.parse.urlparse(u).path.strip("/").replace("/", "-")
        return re.sub(r"[^a-zA-Z0-9_-]+", "-", p).strip("-").lower() or "rule"
    except:
        return re.sub(r"[^a-zA-Z0-9_-]+", "-", u).strip("-").lower()

def extract_rule_links(popular_html, base_url):
    links = set()
    for m in re.finditer(r'<a[^>]+href=[\'"]([^\'"]+)[\'"]', popular_html, re.I):
        href = m.group(1)
        if re.search(r"^/rules/|/rules/", href):
            u = abs_url(base_url, href)
            if u: links.add(u)
    return sorted(links)

def extract_rule_text(html):
    # strip scripts/styles
    html = re.sub(r"<script[\s\S]*?</script>", "", html, flags=re.I)
    html = re.sub(r"<style[\s\S]*?</style>", "", html, flags=re.I)
    # prefer <pre> or <code> blocks (rules often rendered there)
    blocks = [m.group(2) for m in re.finditer(r"<(pre|code)[^>]*>([\s\S]*?)</\1>", html, re.I)]
    if blocks:
        text = "\n\n".join(blocks)
    else:
        # fallback: take <article> or <main>, else whole body
        m = re.search(r"<article[^>]*>([\s\S]*?)</article>", html, re.I) or \
            re.search(r"<main[^>]*>([\s\S]*?)</main>", html, re.I) or \
            re.search(r"<body[^>]*>([\s\S]*?)</body>", html, re.I)
        text = m.group(1) if m else html
        text = re.sub(r"<[^>]+>", " ", text)
    text = htmllib.unescape(text)
    # normalize whitespace
    text = re.sub(r"[ \t\r]+", " ", text)
    text = re.sub(r"\n\s*\n\s*", "\n\n", text)
    return text.strip()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="https://cursor.directory/rules")
    ap.add_argument("--out", default="/workspace/scrapes/cursor-directory")
    args = ap.parse_args()

    ensure_dir(args.out)
    html_dir = os.path.join(args.out, "rules", "html"); ensure_dir(html_dir)
    txt_dir  = os.path.join(args.out, "rules", "text"); ensure_dir(txt_dir)

    index_html = fetch(args.url)
    with open(os.path.join(args.out, "popular.html"), "w", encoding="utf-8") as f:
        f.write(index_html)

    rule_links = extract_rule_links(index_html, args.url)
    results = []
    for link in rule_links:
        slug = slug_from_url(link)
        try:
            page = fetch(link)
            with open(os.path.join(html_dir, f"{slug}.html"), "w", encoding="utf-8") as f:
                f.write(page)
            text = extract_rule_text(page)
            with open(os.path.join(txt_dir, f"{slug}.txt"), "w", encoding="utf-8") as f:
                f.write(text)
            results.append({"url": link, "slug": slug, "status": "ok", "bytesHtml": len(page), "bytesText": len(text)})
            time.sleep(0.2)
        except Exception as e:
            results.append({"url": link, "slug": slug, "status": "error", "error": str(e)})

    manifest = os.path.join(args.out, "rules", ".manifest.json")
    with open(manifest, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"Saved to: {os.path.dirname(manifest)}")

if __name__ == "__main__":
    main()
