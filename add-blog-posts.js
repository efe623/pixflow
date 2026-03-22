#!/usr/bin/env node
// Adds 3 new blog posts to blog.html daily
// Run via cron or heartbeat

const fs = require('fs');
const path = require('path');

const blogFile = path.join(__dirname, 'blog.html');

const today = new Date();
const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

// Pool of posts to rotate through
const postPool = [
  {
    tag: 'Design', emoji: '🎨', thumb: 'bt-1', readTime: '4 min read',
    title: 'The Psychology of Colour in Web Design',
    summary: 'Colours don\'t just look good — they make people feel things. Here\'s how to use colour psychology to guide visitors to take action.',
    content: `<h2>Colour Is Emotional</h2><p>Before a visitor reads a single word on your website, they feel something. That feeling comes largely from colour. Marketers and designers have known this for decades — and it's backed by solid research.</p><h2>What Each Colour Signals</h2><ul><li><strong>Blue</strong> — Trust, reliability, calm. Used by banks, tech companies, and healthcare</li><li><strong>Red</strong> — Urgency, excitement, passion. Great for sales, food, and CTAs</li><li><strong>Green</strong> — Growth, nature, success. Ideal for finance, health, and sustainability brands</li><li><strong>Purple</strong> — Creativity, luxury, mystery. Popular in beauty, tech, and premium brands</li><li><strong>Orange</strong> — Energy, friendliness, confidence. Strong for CTAs and youth brands</li><li><strong>Black</strong> — Sophistication, power, elegance. Luxury brands live here</li></ul><h2>The 60-30-10 Rule</h2><p>The most reliable way to build a colour palette: 60% dominant colour (usually a neutral), 30% secondary colour (your brand colour), and 10% accent colour (for CTAs and highlights). This ratio creates visual balance without looking chaotic.</p><div class="tip"><strong>💡 Tip:</strong> Before choosing your brand colours, look at your competitors. Then deliberately do something different. If everyone in your industry uses blue, going purple makes you instantly memorable.</div><h2>Colour and Conversion</h2><p>The colour of your CTA button matters more than you'd think. Studies show that red and orange buttons typically outperform blue and green ones for conversion — because they signal urgency. But context always matters more than colour rules.</p>`
  },
  {
    tag: 'Coding', emoji: '💻', thumb: 'bt-3', readTime: '6 min read',
    title: 'CSS Grid vs Flexbox: When to Use Which',
    summary: 'Two of the most powerful layout tools in CSS — but which one should you reach for? Here\'s the definitive answer.',
    content: `<h2>The Short Answer</h2><p>Use Flexbox for one-dimensional layouts (a row of items OR a column). Use Grid for two-dimensional layouts (rows AND columns simultaneously). That's the 80% rule. But the details matter.</p><h2>Flexbox: The Row/Column Master</h2><p>Flexbox is perfect for arranging items in a single line — whether horizontal or vertical. Navigation bars, button groups, centering a single element, aligning items in a card — this is Flexbox territory.</p><pre style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:1rem;margin:1rem 0;font-size:0.82rem;overflow-x:auto">.nav { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }</pre><h2>Grid: The Page Layout Champion</h2><p>CSS Grid is built for complex layouts where you need control over both rows and columns. Product grids, page layouts, magazine-style designs — Grid is unmatched here.</p><pre style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:1rem;margin:1rem 0;font-size:0.82rem;overflow-x:auto">.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }</pre><div class="tip"><strong>💡 Tip:</strong> You don't have to choose. The best layouts often use Grid for the page structure and Flexbox for the components within it. They're designed to work together.</div><h2>The Real World Answer</h2><p>At Pixflow, we use Grid for page-level layouts and Flexbox for component-level arrangements. Learn both — they're the two most important CSS features of the last decade.</p>`
  },
  {
    tag: 'App Building', emoji: '🗄️', thumb: 'bt-4', readTime: '5 min read',
    title: 'Choosing the Right Database for Your Web App',
    summary: 'SQL or NoSQL? Postgres or MongoDB? The choice matters more than you think — and it\'s easier to get right than you\'d expect.',
    content: `<h2>The Two Main Types</h2><p>At a high level, databases fall into two camps: relational (SQL) and non-relational (NoSQL). Understanding the difference will help you make the right call for your project.</p><h2>Relational Databases (SQL)</h2><p>SQL databases store data in structured tables with predefined schemas. Think spreadsheets that can talk to each other. Examples: PostgreSQL, MySQL, SQLite.</p><p>Best for: structured data with clear relationships, financial data, user accounts, anything where data integrity is critical.</p><h2>Non-Relational Databases (NoSQL)</h2><p>NoSQL databases are more flexible — they can store documents, key-value pairs, graphs, or anything else. Examples: MongoDB, Redis, Firebase Firestore.</p><p>Best for: rapidly changing data structures, large-scale reads, real-time apps, content management.</p><div class="tip"><strong>💡 Tip:</strong> For 90% of web apps, PostgreSQL is the right answer. It's powerful, reliable, free, and scales further than most apps will ever need.</div><h2>What We Use at Pixflow</h2><p>For most Pro projects, we use PostgreSQL or a simple JSON-based approach depending on scale. For real-time features, we add Redis or Firestore. The right choice is always the simplest one that fits the requirements — not the most impressive-sounding one.</p>`
  },
  {
    tag: 'Business', emoji: '📈', thumb: 'bt-6', readTime: '4 min read',
    title: 'How to Brief a Web Developer (So You Get What You Want)',
    summary: 'The quality of your brief directly determines the quality of your end result. Here\'s how to communicate your vision so clearly that there\'s no room for misunderstanding.',
    content: `<h2>Why Briefs Matter</h2><p>The number one cause of a bad website isn't a bad developer — it's a bad brief. Vague instructions lead to vague results. Clear, specific briefs lead to websites that feel like the developer read your mind.</p><h2>What to Include in Your Brief</h2><h3>1. What does your business do?</h3><p>Explain your business in plain English. What do you sell or offer? Who are your customers? What makes you different from competitors? The developer needs to understand your business to represent it well.</p><h3>2. What is the website for?</h3><p>Is it to generate leads? Sell products? Build credibility? Showcase a portfolio? The purpose of the site dictates every design and development decision.</p><h3>3. Who is your target audience?</h3><p>Young professionals? Parents? Business owners? The audience determines the tone, language, and design direction.</p><h3>4. What pages do you need?</h3><p>List every page: Home, About, Services, Portfolio, Contact, Blog, etc. Be specific.</p><h3>5. References</h3><p>Find 3-5 websites you love and explain what specifically you like about them. "I like the minimalist layout of Site A and the colour palette of Site B." This is worth a thousand words of description.</p><div class="tip"><strong>💡 Tip:</strong> Don't say "make it look professional." Everyone wants professional. Say "I want it to feel like a premium tech startup — clean, modern, with bold typography and a dark colour scheme." Now we're talking.</div>`
  },
  {
    tag: 'Design', emoji: '✍️', thumb: 'bt-2', readTime: '5 min read',
    title: 'Typography: The Invisible Superpower of Web Design',
    summary: 'Typography accounts for 95% of web design, according to web design legend Oliver Reichenstein. Here\'s why font choice matters more than most people realise.',
    content: `<h2>Typography Is Everywhere</h2><p>The vast majority of what's on any website is text. Headlines, body copy, navigation, buttons, captions — it's all type. So it stands to reason that how that type looks, feels, and behaves has an enormous impact on the overall quality of the design.</p><h2>The Three Things Typography Does</h2><h3>1. Communicates personality</h3><p>A bold sans-serif (like Inter or Geist) says "modern, confident, technical." A serif (like Georgia or Playfair) says "established, trustworthy, refined." A rounded sans-serif says "friendly, approachable, accessible." Your font choice is a personality statement before a single word is read.</p><h3>2. Creates hierarchy</h3><p>Typography establishes what's most important on a page. A large, bold headline draws the eye first. A smaller subheading comes second. Body text comes third. Without clear typographic hierarchy, visitors don't know where to look — so they look away.</p><h3>3. Affects readability</h3><p>Poor typography actively makes reading harder. Too-small font sizes, too-tight line spacing, too-long line lengths, insufficient contrast — all of these create friction that drives visitors away from your content.</p><div class="tip"><strong>💡 Tip:</strong> Line length should be 50-75 characters for body text. Too short feels choppy; too long makes lines hard to track. On most screens, this means a max-width of around 650-720px for your content column.</div><h2>Our Typography Rules at Pixflow</h2><ul><li>Body text: minimum 16px, ideally 17-18px for comfort</li><li>Line height: 1.6-1.8 for body, 1.1-1.2 for headings</li><li>Contrast ratio: 4.5:1 minimum between text and background</li><li>Font families: 2 max (one for headings, one for body)</li></ul>`
  },
  {
    tag: 'Coding', emoji: '🔐', thumb: 'bt-7', readTime: '6 min read',
    title: 'Web Security Basics Every Site Owner Should Know',
    summary: 'You don\'t need to be a security expert to protect your website. These fundamentals cover the most common vulnerabilities and how to avoid them.',
    content: `<h2>Why Security Matters (Even for Small Sites)</h2><p>Many small business owners think "why would anyone hack my website?" The answer: usually it's automated. Bots crawl the internet looking for vulnerable sites to hijack for sending spam, mining crypto, or serving malware — regardless of how small or big you are.</p><h2>HTTPS: Non-Negotiable in 2026</h2><p>Your site must use HTTPS (the padlock in the browser bar). Not just for security — Google penalises HTTP sites in search rankings, and modern browsers warn users before entering HTTP sites. With hosts like Vercel, HTTPS is automatic and free.</p><h2>Keep Everything Updated</h2><p>If you're using WordPress, plugins and themes are the biggest security risk. Outdated plugins are the cause of the vast majority of WordPress hacks. Update everything regularly, and remove plugins you don't use.</p><h2>Strong Passwords and 2FA</h2><p>Use a password manager (1Password, Bitwarden) and enable two-factor authentication on your hosting, domain registrar, and CMS accounts. If someone gets into your hosting account, your site is gone.</p><div class="tip"><strong>💡 Tip:</strong> The sites we build at Pixflow are either static (no database to attack) or built with security-first frameworks. Static sites have almost no attack surface — there's no database to inject, no plugin vulnerabilities to exploit.</div><h2>Form Validation and Spam Protection</h2><p>Any form on your site that accepts user input needs server-side validation. Never trust what users submit. For spam protection, use honeypot fields (invisible to humans, filled in by bots) or services like hCaptcha — not reCAPTCHA v2 which hurts UX.</p>`
  },
  {
    tag: 'App Building', emoji: '🔑', thumb: 'bt-5', readTime: '5 min read',
    title: 'User Authentication Explained: How Logins Actually Work',
    summary: 'Ever wondered what happens when you click "Log In"? Here\'s how authentication works under the hood — and why getting it right is critical.',
    content: `<h2>What Is Authentication?</h2><p>Authentication is the process of verifying who someone is. When you log into a website, you're proving your identity — usually with a username/email and password. The system checks your credentials and, if correct, grants you access.</p><h2>The Basics: Never Store Plain Passwords</h2><p>This is rule number one of authentication: never, ever store user passwords in plain text. If your database is ever compromised and passwords are stored in plain text, every user's account (and any other account where they reuse that password) is immediately at risk.</p><p>Instead, passwords are hashed — run through a one-way mathematical function (like bcrypt) that produces a fixed-length string. The original password cannot be recovered from the hash. When a user logs in, their entered password is hashed and compared to the stored hash.</p><h2>Sessions and Tokens</h2><p>Once authenticated, the server needs to remember who you are for the duration of your visit. Two main approaches: sessions (server stores your login state, gives you a session ID cookie) and tokens (server gives you a signed JWT token that you send with every request).</p><div class="tip"><strong>💡 Tip:</strong> Building authentication from scratch is surprisingly easy to get wrong. For most projects, we recommend using a dedicated auth service like Clerk or Auth.js — they handle all the edge cases, security updates, and compliance requirements so you can focus on your actual app.</div><h2>OAuth: "Log in with Google"</h2><p>OAuth lets users authenticate with a third-party service (Google, GitHub, Apple) instead of creating a new username/password. It's more secure (the third party handles password storage) and more convenient for users. It's almost always worth offering alongside email/password login.</p>`
  }
];

// Read current blog.html
let html = fs.readFileSync(blogFile, 'utf8');

// Figure out how many posts exist
const existingCount = (html.match(/class="blog-card"/g) || []).length;

// Pick 3 new posts from the pool (cycling)
const newPosts = [];
for (let i = 0; i < 3; i++) {
  const post = postPool[(existingCount + i) % postPool.length];
  newPosts.push(post);
}

// Build new card HTML
const newCards = newPosts.map(p => `
    <div class="blog-card" data-tag="${p.tag}" onclick="openArticle(${existingCount + newPosts.indexOf(p)})">
      <div class="blog-thumb ${p.thumb}">${p.emoji}</div>
      <div class="blog-body">
        <div class="blog-meta">
          <span class="blog-tag">${p.tag}</span>
          <span class="blog-date">${dateStr}</span>
          <span class="blog-read-time">${p.readTime}</span>
        </div>
        <h2>${p.title}</h2>
        <p>${p.summary}</p>
        <span class="read-btn">Read Article →</span>
      </div>
    </div>`).join('\n');

// Add new cards before closing blog-grid div
html = html.replace('  </div>\n\n</div>\n\n<!-- ARTICLE OVERLAY', newCards + '\n\n  </div>\n\n</div>\n\n<!-- ARTICLE OVERLAY');

// Add new articles to the articles array in JS
const newArticleObjs = newPosts.map(p => `    {
      tag: '${p.tag}', date: '${dateStr}', readTime: '${p.readTime}', thumb: '${p.thumb}', emoji: '${p.emoji}',
      title: "${p.title.replace(/"/g, '\\"')}",
      intro: "${p.summary.replace(/"/g, '\\"')}",
      content: \`${p.content}\`
    }`).join(',\n');

html = html.replace('  ];\n\n  function openArticle', `  ,\n${newArticleObjs}\n  ];\n\n  function openArticle`);

// Update count badge
html = html.replace(/📝 \d+ articles/, `📝 ${existingCount + 3} articles`);

fs.writeFileSync(blogFile, html);
console.log(`✓ Added 3 posts to blog.html (now ${existingCount + 3} total)`);

// Git commit and push
const { execSync } = require('child_process');
try {
  execSync('cd /Users/onurbaylan/.openclaw/workspace-noodle/theappbusiness && git add blog.html && git commit -m "Add 3 new blog posts for ' + dateStr + '" && git push', { stdio: 'inherit' });
  execSync('cd /Users/onurbaylan/.openclaw/workspace-noodle/theappbusiness && npx vercel --prod --force 2>&1 | tail -3', { stdio: 'inherit' });
} catch(e) {
  console.log('Git/deploy error:', e.message);
}
