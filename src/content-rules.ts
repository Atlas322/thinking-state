/**
 * Content rules for anything the library shows (itge.e 2026-11-12):
 * no vendor names, no AI model names, no prices. Demo data is Mongolian and
 * generic — «Судлаач агент», «кодын агент», «төлбөрийн систем», «хувилбарын
 * хяналт». Numbers may stay when they mean something; money amounts do not.
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

/** Everything a person can read or hear in a rendered subtree: text, aria-label, title, alt, placeholder, value. */
export function readableText(root: Element): string[] {
  const out: string[] = [];
  const walk = (el: Element) => {
    if (el.tagName === "STYLE" || el.tagName === "SCRIPT") return;
    for (const a of ["aria-label", "title", "alt", "placeholder"]) {
      const v = el.getAttribute(a);
      if (v) out.push(v);
    }
    if ((el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) && el.value) out.push(el.value);
    for (const c of el.childNodes) {
      if (c.nodeType === 3 && c.textContent?.trim()) out.push(c.textContent);
      else if (c.nodeType === 1) walk(c as Element);
    }
  };
  walk(root);
  return out;
}
