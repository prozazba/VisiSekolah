const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const mdPath = path.join(__dirname, '..', '..', '..', '..', 'Documents', '__KOMITE__', 'VisiSekolah', 'academic_flow_review.md');
const htmlPath = path.join(__dirname, '..', '..', '..', '..', 'Documents', '__KOMITE__', 'VisiSekolah', 'academic_flow_review.html');
const pdfPath = path.join(__dirname, '..', '..', '..', '..', 'Documents', '__KOMITE__', 'VisiSekolah', 'academic_flow_review.pdf');

// Simple Markdown to HTML parser
function parseMarkdown(md) {
  let html = '';
  const lines = md.split('\n');
  let inList = false;
  let inTable = false;
  let inCode = false;
  let codeContent = '';
  let codeLang = '';
  let inQuote = false;
  let quoteContent = '';
  let quoteType = ''; // NOTE, TIP, IMPORTANT, etc.
  let tableHeaders = [];
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (inCode) {
        inCode = false;
        if (codeLang === 'mermaid') {
          html += `<pre class="mermaid">${codeContent}</pre>\n`;
        } else {
          html += `<pre><code class="language-${codeLang}">${escapeHtml(codeContent)}</code></pre>\n`;
        }
        codeContent = '';
      } else {
        inCode = true;
        codeLang = line.trim().slice(3).toLowerCase();
      }
      continue;
    }

    if (inCode) {
      codeContent += line + '\n';
      continue;
    }

    // Handle blockquotes / alerts
    if (line.trim().startsWith('>')) {
      if (!inQuote) {
        inQuote = true;
        quoteContent = '';
        quoteType = 'NOTE'; // default
      }
      let content = line.trim().slice(1).trim();
      if (content.startsWith('[!')) {
        const match = content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
        if (match) {
          quoteType = match[1].toUpperCase();
          content = content.slice(match[0].length).trim();
        }
      }
      quoteContent += (quoteContent ? '<br>' : '') + content;
      continue;
    } else if (inQuote) {
      inQuote = false;
      html += `<div class="alert alert-${quoteType.toLowerCase()}">`;
      html += `<span class="alert-icon"></span>`;
      html += `<div class="alert-content">${parseInline(quoteContent)}</div>`;
      html += `</div>\n`;
    }

    // Handle headers
    if (line.startsWith('# ')) {
      html += `<h1>${parseInline(line.slice(2))}</h1>\n`;
      continue;
    }
    if (line.startsWith('## ')) {
      html += `<h2>${parseInline(line.slice(3))}</h2>\n`;
      continue;
    }
    if (line.startsWith('### ')) {
      html += `<h3>${parseInline(line.slice(4))}</h3>\n`;
      continue;
    }

    // Handle horizontal rules
    if (line.trim() === '---') {
      html += `<hr>\n`;
      continue;
    }

    // Handle tables
    if (line.trim().startsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHeaders = [];
        tableRows = [];
      }
      const parts = line.split('|').map(x => x.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      // Check if it's the separator line
      if (line.includes('---')) {
        continue;
      }

      if (tableHeaders.length === 0) {
        tableHeaders = parts;
      } else {
        tableRows.push(parts);
      }
      continue;
    } else if (inTable) {
      inTable = false;
      html += `<table>\n<thead>\n<tr>\n`;
      tableHeaders.forEach(h => {
        html += `<th>${parseInline(h)}</th>\n`;
      });
      html += `</tr>\n</thead>\n<tbody>\n`;
      tableRows.forEach(row => {
        html += `<tr>\n`;
        row.forEach(cell => {
          html += `<td>${parseInline(cell)}</td>\n`;
        });
        html += `</tr>\n`;
      });
      html += `</tbody>\n</table>\n`;
    }

    // Handle lists
    if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
      if (!inList) {
        inList = true;
        html += `<ul>\n`;
      }
      const content = line.trim().slice(1).trim();
      html += `<li>${parseInline(content)}</li>\n`;
      continue;
    } else if (inList && !line.trim().startsWith('*') && !line.trim().startsWith('-')) {
      inList = false;
      html += `</ul>\n`;
    }

    // Handle paragraphs
    if (line.trim() !== '') {
      html += `<p>${parseInline(line)}</p>\n`;
    }
  }

  // Close lingering tags
  if (inQuote) {
    html += `<div class="alert alert-${quoteType.toLowerCase()}">`;
    html += `<span class="alert-icon"></span>`;
    html += `<div class="alert-content">${parseInline(quoteContent)}</div>`;
    html += `</div>\n`;
  }
  if (inTable) {
    html += `<table>\n<thead>\n<tr>\n`;
    tableHeaders.forEach(h => {
      html += `<th>${parseInline(h)}</th>\n`;
    });
    html += `</tr>\n</thead>\n<tbody>\n`;
    tableRows.forEach(row => {
      html += `<tr>\n`;
      row.forEach(cell => {
        html += `<td>${parseInline(cell)}</td>\n`;
      });
      html += `</tr>\n`;
    });
    html += `</tbody>\n</table>\n`;
  }
  if (inList) {
    html += `</ul>\n`;
  }

  return html;
}

function parseInline(text) {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Inline code
  text = text.replace(/`(.*?)`/g, '<code>$1</code>');
  // Links
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  // Line breaks
  text = text.replace(/<br>/g, '<br/>');
  return text;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Generate styled HTML document
const markdownContent = fs.readFileSync(mdPath, 'utf8');
const bodyHtml = parseMarkdown(markdownContent);

const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Academic Lifecycle Workflow Review - VisiSekolah</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      font-size: 14px;
      margin: 0;
      padding: 0;
      background-color: #ffffff;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 8px;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 12px;
      letter-spacing: -0.02em;
    }
    strong {
      color: #0f172a;
      font-weight: 700;
    }
    h2 {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 24px;
      margin-bottom: 12px;
      letter-spacing: -0.01em;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
    }
    h3 {
      font-size: 14px;
      font-weight: 700;
      color: #334155;
      margin-top: 18px;
      margin-bottom: 8px;
    }
    p {
      margin-top: 0;
      margin-bottom: 12px;
      color: #475569;
    }
    hr {
      border: 0;
      border-top: 1px solid #e2e8f0;
      margin: 20px 0;
    }
    code {
      font-family: 'JetBrains Mono', monospace;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    pre {
      background-color: #0f172a;
      color: #f8fafc;
      padding: 16px;
      border-radius: 12px;
      overflow-x: auto;
      margin-bottom: 16px;
    }
    pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
      border-radius: 0;
      font-size: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 13px;
    }
    th, td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background-color: #f8fafc;
      color: #0f172a;
      font-weight: 700;
    }
    tr:hover {
      background-color: #f8fafc;
    }
    ul {
      margin-top: 0;
      margin-bottom: 16px;
      padding-left: 20px;
      color: #475569;
    }
    li {
      margin-bottom: 6px;
    }
    
    /* Alert / Blockquote styling */
    .alert {
      display: flex;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 10px;
      margin-bottom: 18px;
      border-left: 4px solid;
    }
    .alert-note {
      background-color: #eff6ff;
      border-color: #3b82f6;
      color: #1e3a8a;
    }
    .alert-tip {
      background-color: #ecfdf5;
      border-color: #10b981;
      color: #064e3b;
    }
    .alert-important {
      background-color: #fef2f2;
      border-color: #ef4444;
      color: #7f1d1d;
    }
    .alert-icon {
      font-weight: bold;
      display: inline-block;
    }
    .alert-note .alert-icon::before { content: "ℹ️"; }
    .alert-tip .alert-icon::before { content: "💡"; }
    .alert-important .alert-icon::before { content: "🚨"; }
    .alert-content {
      font-size: 13px;
      font-weight: 500;
    }

    /* Mermaid diagrams custom render in PDF print */
    .mermaid {
      background-color: #f8fafc !important;
      color: #0f172a !important;
      border: 1px solid #e2e8f0;
      padding: 16px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 18px;
    }
  </style>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ 
      startOnLoad: true, 
      theme: 'default',
      flowchart: { useMaxWidth: true, htmlLabels: true }
    });
  </script>
</head>
<body>
  <div style="margin-bottom: 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 700;">
    Laporan Tinjauan Teknis & Realisasi Sistem
  </div>
  ${bodyHtml}
</body>
</html>
`;

fs.writeFileSync(htmlPath, fullHtml);
console.log('HTML file successfully generated at:', htmlPath);

// Launch local headless Chrome to generate PDF
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const command = `"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=3000 --print-to-pdf="${pdfPath}" "${htmlPath}"`;

console.log('Compiling PDF using local headless Chrome...');
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('Failed to generate PDF:', error);
    process.exit(1);
  }
  console.log('PDF successfully compiled!');
  console.log('Output Path:', pdfPath);
});
