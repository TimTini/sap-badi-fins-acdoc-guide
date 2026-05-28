/**
 * Build docs/Huong_dan_BADI_FINS_ACDOC.html from Markdown.
 * Run: node docs/scripts/build-guide-html.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, "..");
const mdPath = path.join(docsDir, "Huong_dan_BADI_FINS_ACDOC.md");
const htmlPath = path.join(docsDir, "Huong_dan_BADI_FINS_ACDOC.html");
const stylePath = path.join(docsDir, "Huong_dan_BADI_FINS_ACDOC.html.bak-20260529-000615");

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineFormat(text) {
  const codes = [];
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, (_, code) => {
    const i = codes.length;
    codes.push(`<code class="inline">${code}</code>`);
    return `\x00CODE${i}\x00`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    let h = href;
    if (h.startsWith("#")) {
      h = `#${slugify(decodeURIComponent(h.slice(1)))}`;
    } else if (!h.startsWith("http")) {
      h = h.replace(/\.md(?=#|$)/, ".md");
    }
    return `<a href="${escapeHtml(h)}">${escapeHtml(label)}</a>`;
  });
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/\x00CODE(\d+)\x00/g, (_, i) => codes[Number(i)]);
  return s;
}

function parseTable(lines, startIndex) {
  const rows = [];
  let i = startIndex;
  while (i < lines.length && lines[i].includes("|")) {
    const row = lines[i]
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());
    if (!row.every((c) => /^[-:]+$/.test(c))) {
      rows.push(row);
    }
    i += 1;
  }
  if (rows.length === 0) {
    return { html: "", next: startIndex };
  }
  const [head, ...body] = rows;
  let html = "<table><thead><tr>";
  for (const cell of head) {
    html += `<th>${inlineFormat(cell)}</th>`;
  }
  html += "</tr></thead><tbody>";
  for (const row of body) {
    html += "<tr>";
    for (const cell of row) {
      html += `<td>${inlineFormat(cell)}</td>`;
    }
    html += "</tr>";
  }
  html += "</tbody></table>";
  return { html, next: i };
}

function blockToHtml(lines, startIndex) {
  const line = lines[startIndex];
  if (!line.trim()) {
    return { html: "", next: startIndex + 1 };
  }
  if (line.startsWith("```")) {
    const lang = line.slice(3).trim();
    const body = [];
    let i = startIndex + 1;
    while (i < lines.length && !lines[i].startsWith("```")) {
      body.push(lines[i]);
      i += 1;
    }
    const cls = lang === "abap" ? ' class="abap"' : "";
    const tag = lang === "text" ? "div" : "pre";
    const inner = escapeHtml(body.join("\n"));
    const html =
      tag === "div"
        ? `<div class="tree">${inner}</div>`
        : `<pre${cls}>${inner}</pre>`;
    return { html, next: i + 1 };
  }
  if (line.startsWith("|")) {
    return parseTable(lines, startIndex);
  }
  if (line.startsWith("> ")) {
    const parts = [line.slice(2)];
    let i = startIndex + 1;
    while (i < lines.length && lines[i].startsWith("> ")) {
      parts.push(lines[i].slice(2));
      i += 1;
    }
    return {
      html: `<div class="alert">${inlineFormat(parts.join(" "))}</div>`,
      next: i,
    };
  }
  if (line.startsWith("- [ ] ")) {
    const items = [];
    let i = startIndex;
    while (i < lines.length && lines[i].startsWith("- [ ] ")) {
      items.push(lines[i].slice(6));
      i += 1;
    }
    let html = '<ul class="checklist">';
    for (const item of items) {
      html += `<li>${inlineFormat(item)}</li>`;
    }
    html += "</ul>";
    return { html, next: i };
  }
  if (line.startsWith("- ")) {
    const items = [];
    let i = startIndex;
    while (i < lines.length && lines[i].startsWith("- ")) {
      items.push(lines[i].slice(2));
      i += 1;
    }
    let html = "<ul>";
    for (const item of items) {
      html += `<li>${inlineFormat(item)}</li>`;
    }
    html += "</ul>";
    return { html, next: i };
  }
  if (/^\d+\.\s/.test(line)) {
    const items = [];
    let i = startIndex;
    while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
      items.push(lines[i].replace(/^\d+\.\s/, ""));
      i += 1;
    }
    let html = '<ol class="steps">';
    for (const item of items) {
      html += `<li>${inlineFormat(item)}</li>`;
    }
    html += "</ol>";
    return { html, next: i };
  }
  if (line.startsWith("**") && line.endsWith("**")) {
    return {
      html: `<p><strong>${inlineFormat(line.slice(2, -2))}</strong></p>`,
      next: startIndex + 1,
    };
  }
  return {
    html: `<p>${inlineFormat(line)}</p>`,
    next: startIndex + 1,
  };
}

function sectionBodyHtml(lines, usedIds) {
  let html = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "" || line.trim() === "---") {
      i += 1;
      continue;
    }
    if (line.startsWith("### ")) {
      const title = line.slice(4).trim();
      let id = slugify(title);
      if (usedIds.has(id)) {
        id = `${id}-phu-luc`;
      }
      usedIds.add(id);
      html += `<h3 id="${id}">${escapeHtml(title)}</h3>`;
      i += 1;
      continue;
    }
    const block = blockToHtml(lines, i);
    html += block.html;
    i = block.next;
  }
  return html;
}

function parseMd(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let title = "";
  const sections = [];
  let current = null;
  let i = 0;
  if (lines[0]?.startsWith("# ")) {
    title = lines[0].slice(2).trim();
    i = 1;
  }
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      if (current) {
        sections.push(current);
      }
      const heading = line.slice(3).trim();
      current = {
        heading,
        id: slugify(heading),
        lines: [],
      };
      i += 1;
      continue;
    }
    if (current) {
      current.lines.push(line);
    }
    i += 1;
  }
  if (current) {
    sections.push(current);
  }
  return { title, sections };
}

function buildToc(sections) {
  const appendixId = slugify("Phụ lục kỹ thuật");
  const mainId = slugify("Nội dung chính");
  let html = '<nav class="toc" aria-label="Mục lục"><h2>Mục lục</h2>';
  for (const sec of sections) {
    html += `<a href="#${sec.id}">${escapeHtml(sec.heading)}</a>`;
    if (sec.id === mainId || sec.id === appendixId) {
      for (const line of sec.lines) {
        if (line.startsWith("### ")) {
          const sub = line.slice(4).trim();
          html += `<a href="#${slugify(sub)}" class="sub">${escapeHtml(sub)}</a>`;
        }
      }
    }
  }
  html += '<a href="sources/README.md">Mirror nguồn SAP</a>';
  html += '<a href="Huong_dan_BADI_FINS_ACDOC.md">Bản Markdown</a>';
  html += "</nav>";
  return html;
}

function extractStyles(oldHtml) {
  const m = oldHtml.match(/<style>([\s\S]*?)<\/style>/);
  return m ? m[1] : "";
}

function buildHero(title) {
  return `<header class="hero">
        <h1>${escapeHtml(title)}</h1>
        <p>Hiện tượng custom field <code class="inline" style="background:rgba(255,255,255,.2);color:#fff">ACDOCA</code> trống sau Balance Carryforward sau upgrade S/4HANA — nguyên nhân, hướng xử lý BAdI <code class="inline" style="background:rgba(255,255,255,.2);color:#fff">BADI_FINS_ACDOC_FIELDCAT</code>, cách kiểm tra.</p>
        <div class="tags">
          <span class="tag">S/4HANA Finance</span>
          <span class="tag">Balance Carryforward</span>
          <span class="tag">ACDOCA</span>
        </div>
      </header>`;
}

function buildMain(sections) {
  const usedIds = new Set(sections.map((s) => s.id));
  let html = "";
  for (const sec of sections) {
    const body = sectionBodyHtml(sec.lines, usedIds);
    const extraClass = sec.heading === "Link nguồn" ? ' class="refs"' : "";
    html += `<section id="${sec.id}"${extraClass}>\n`;
    html += `<h2>${escapeHtml(sec.heading)}</h2>\n`;
    html += body;
    html += "</section>\n";
  }
  return html;
}

function buildPage(md, oldHtml) {
  const { title, sections } = parseMd(md);
  const styles = extractStyles(oldHtml);
  const toc = buildToc(sections);
  const hero = buildHero(title);
  const main = buildMain(sections);

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="theme.css" />
  <style>${styles}</style>
</head>
<body>
  <div class="layout">
    ${toc}
    <main>
      ${hero}
      ${main}
      <footer class="note" style="padding:16px 0;font-size:14px;color:var(--muted)">
        <p>Object/method phụ thuộc release Finance — xác nhận trong <code class="inline">SE19</code>/<code class="inline">SE24</code> trước transport QA/PRD. Tạo HTML: <code class="inline">node docs/scripts/build-guide-html.mjs</code></p>
      </footer>
    </main>
  </div>
</body>
</html>
`;
}

const md = fs.readFileSync(mdPath, "utf8");
let oldHtml = "";
if (fs.existsSync(htmlPath)) {
  oldHtml = fs.readFileSync(htmlPath, "utf8");
} else if (fs.existsSync(stylePath)) {
  oldHtml = fs.readFileSync(stylePath, "utf8");
}

const out = buildPage(md, oldHtml);
fs.writeFileSync(htmlPath, out, "utf8");
console.log("Wrote", htmlPath);
