/**
 * Content rules for anything the library shows (2026-11-12):
 * no vendor names, no AI model names, no prices. Demo data is Mongolian and
 * generic — «Судлаач агент», «кодын агент», «төлбөрийн систем», «хувилбарын
 * хяналт». Numbers may stay when they mean something; money amounts do not.
 * English UI labels: `englishWords` (same test).
 * Checked on the rendered text and accessible names of every catalog preview
 * (src/content.test.tsx, `npm run check:content`).
 */
export const BANNED_NAMES = [
  // AI vendors and models
  "Anthropic", "Claude", "Opus", "Sonnet", "Haiku", "OpenAI", "ChatGPT", "GPT", "Gemini", "Llama", "Mistral", "Grok", "DeepSeek", "Copilot",
  // product and service vendors
  "Stripe", "GitHub", "GitLab", "Slack", "Notion", "Figma", "Jira", "Vercel", "Google", "Gmail", "Salesforce", "HubSpot", "Zendesk",
  "Shopify", "AWS", "Azure", "Dropbox", "Intercom", "Discord", "PayPal", "Twilio", "Datadog", "Sentry", "Snowflake", "Postgres",
  "PostgreSQL", "Supabase", "Airtable", "Asana", "Trello", "Zoom", "Microsoft", "Outlook", "Teams", "Linear", "Confluence", "Okta",
  "QuickBooks", "Xero", "Mailchimp", "Twitter", "LinkedIn", "Facebook", "Instagram", "YouTube", "Apple", "Amazon", "Netflix", "Uber",
];

const NAME_RE = new RegExp(`(^|[^\\p{L}\\p{N}])(${BANNED_NAMES.join("|")})(?=$|[^\\p{L}\\p{N}])`, "iu");
/** $240, $1.2k, 240 USD, ₮ amounts are fine only without a currency sign meant as a price tag — the rule is: no `$`. */
const PRICE_RE = /\$\s?\d|\d\s?(USD|EUR)\b|€\s?\d/i;

export type ContentHit = { rule: "name" | "price"; match: string; text: string };

/** Hits in one piece of visible text. */
export function contentHits(text: string): ContentHit[] {
  const hits: ContentHit[] = [];
  const n = text.match(NAME_RE);
  if (n) hits.push({ rule: "name", match: n[2], text: text.slice(Math.max(0, (n.index ?? 0) - 20), (n.index ?? 0) + 30) });
  const p = text.match(PRICE_RE);
  if (p) hits.push({ rule: "price", match: p[0], text: text.slice(Math.max(0, (p.index ?? 0) - 20), (p.index ?? 0) + 30) });
  return hits;
}

/**
 * UI labels are Mongolian (2026-11-12). Latin words that may stay:
 * acronyms (API, CRM, PR, all caps), units, product names, and anything that
 * is code: tokens with digits, dots, slashes, @, #, _ or : (paths, emails,
 * ids, versions, keys).
 */
export const LATIN_OK = [
  "Thinking", "State", "Second", "Brain", "Lean", "Canvas", "inai", "Atlas", "React", "TypeScript", "Inter",
  "ms", "px", "kb", "mb", "gb", "min", "sec", "ok", "vs", "deploy", "commit", "branch", "merge", "token", "tokens", "prompt",
  "sync", "bridge", "instance", "docs", "design", "payments", "chat", "code", "crm", "vcs", "vault", "inbox", "fixture",
];
const LATIN_OK_SET = new Set(LATIN_OK.map((w) => w.toLowerCase()));
const TOKEN_RE = /\S+/g;
const WORD_RE = /[A-Za-z]{2,}/g;

/** English words in one piece of visible text (empty when the text is Mongolian or code). */
export function englishWords(text: string): string[] {
  const out: string[] = [];
  for (const [token] of text.matchAll(TOKEN_RE)) {
    if (/[0-9./@#_:\\=<>{}[\]()$]/.test(token.replace(/[.,!?:;…»«"'”“)]+$/, "").replace(/^[«"'“(]+/, ""))) continue;
    for (const [w] of token.matchAll(WORD_RE)) {
      if (w === w.toUpperCase()) continue; // acronym
      if (LATIN_OK_SET.has(w.toLowerCase())) continue;
      out.push(w);
    }
  }
  return out;
}

/** Everything a person can read or hear in a rendered subtree: text, aria-label, title, alt, placeholder, value. */
export function readableText(root: Element): string[] {
  const out: string[] = [];
  const walk = (el: Element) => {
    if (el.tagName === "STYLE" || el.tagName === "SCRIPT") return;
    for (const a of ["aria-label", "title", "alt", "placeholder"]) {
      const v = el.getAttribute(a);
      if (v) out.push(v);
    }
    // a checkbox's or radio's value and a hidden input are never shown
    const shown = !(el instanceof HTMLInputElement) || !["checkbox", "radio", "hidden"].includes(el.type);
    if ((el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) && el.value && shown) out.push(el.value);
    for (const c of el.childNodes) {
      if (c.nodeType === 3 && c.textContent?.trim()) out.push(c.textContent);
      else if (c.nodeType === 1) walk(c as Element);
    }
  };
  walk(root);
  return out;
}
