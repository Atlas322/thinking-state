import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
function chatRuntime() {
  const w = window;
  const doc = document;
  const mq = (q) => window.matchMedia ? window.matchMedia(q) : null;
  const reduce = !!mq("(prefers-reduced-motion: reduce)")?.matches;
  const dark = mq("(prefers-color-scheme: dark)");
  const roots = () => Array.prototype.slice.call(doc.querySelectorAll("[data-cw-root]"));
  const theme = () => {
    roots().forEach((r) => {
      const pinned = r.getAttribute("data-cw-theme");
      const on = pinned ? pinned === "dark" : !!dark?.matches;
      (r.parentElement || r).classList.toggle("dark", on);
    });
  };
  roots().forEach((r) => {
    if (r.hasAttribute("data-cw-ready")) return;
    r.setAttribute("data-cw-ready", "");
    if (reduce || typeof requestAnimationFrame !== "function") return;
    Array.prototype.slice.call(r.querySelectorAll("[data-cw-count]")).forEach((el) => {
      const target = Number(el.getAttribute("data-cw-count")) || 0;
      const delay = Number(el.getAttribute("data-cw-delay")) || 0;
      let start = 0;
      el.textContent = "0";
      const tick = (t) => {
        if (!start) start = t + delay;
        const p = Math.min(1, Math.max(0, (t - start) / 900));
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  });
  theme();
  if (w.__cwRuntime) return;
  w.__cwRuntime = true;
  dark?.addEventListener?.("change", theme);
  const updateLeft = (root) => {
    if (!root) return;
    const items = root.querySelectorAll("[data-cw-item]");
    let left = 0;
    for (let i = 0; i < items.length; i++) if (!items[i].hasAttribute("data-chosen")) left++;
    const n = root.querySelector("[data-cw-left-n]");
    if (n) n.textContent = String(left);
    root.querySelector("[data-cw-left]")?.classList.toggle("is-zero", left === 0);
    const done = root.querySelector("[data-cw-all-done]");
    if (done) done.hidden = left > 0;
  };
  doc.addEventListener("keydown", (e) => {
    const t = e.target;
    const btn = t && t.closest ? t.closest("[data-cw-view-btn]") : null;
    if (!btn) return;
    const k = e.key;
    if (k !== "ArrowRight" && k !== "ArrowLeft" && k !== "ArrowDown" && k !== "ArrowUp") return;
    const group = btn.closest("[data-cw-views]");
    if (!group) return;
    const all = Array.prototype.slice.call(group.querySelectorAll("[data-cw-view-btn]"));
    const step = k === "ArrowRight" || k === "ArrowDown" ? 1 : -1;
    const next = all[(all.indexOf(btn) + step + all.length) % all.length];
    e.preventDefault();
    next.click();
    next.focus();
  });
  doc.addEventListener("click", (e) => {
    const t = e.target;
    if (!t || !t.closest) return;
    const scopeBtn = t.closest("[data-cw-scope-btn]");
    if (scopeBtn) {
      const root = scopeBtn.closest("[data-cw-root]");
      const v = scopeBtn.getAttribute("data-cw-scope-btn") || "all";
      if (root) {
        root.setAttribute("data-scope", v);
        root.querySelectorAll("[data-cw-scope-btn]").forEach((b) => {
          const on = b.getAttribute("data-cw-scope-btn") === v;
          b.setAttribute("aria-pressed", String(on));
          if (on) b.setAttribute("data-active", "");
          else b.removeAttribute("data-active");
        });
      }
    }
    const viewBtn = t.closest("[data-cw-view-btn]");
    if (viewBtn) {
      const group = viewBtn.closest("[data-cw-views]");
      const v = viewBtn.getAttribute("data-cw-view-btn");
      if (group) {
        group.querySelectorAll("[data-cw-view-btn]").forEach((b) => {
          const on = b === viewBtn;
          b.setAttribute("aria-checked", String(on));
          b.setAttribute("tabindex", on ? "0" : "-1");
          if (on) b.setAttribute("data-active", "");
          else b.removeAttribute("data-active");
        });
        group.querySelectorAll("[data-cw-view-panel]").forEach((p) => {
          p.hidden = p.getAttribute("data-cw-view-panel") !== v;
        });
      }
    }
    const toggle = t.closest("[data-cw-toggle]");
    if (toggle) {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      const id = toggle.getAttribute("aria-controls");
      const target = id ? doc.getElementById(id) : null;
      const cls = toggle.getAttribute("data-cw-toggle");
      if (cls) {
        toggle.closest("[data-cw-scope]")?.classList.toggle(cls, !open);
        if (target) {
          if (open) target.removeAttribute("inert");
          else target.setAttribute("inert", "");
        }
      } else if (target) target.hidden = !open;
      const label = toggle.querySelector("[data-cw-label]");
      const text = toggle.getAttribute(open ? "data-cw-open-label" : "data-cw-closed-label");
      if (label && text) label.textContent = text;
    }
    const choose = t.closest("[data-cw-choose]");
    if (choose) {
      const item = choose.closest("[data-cw-item]");
      if (item) {
        item.setAttribute("data-chosen", "");
        const text = item.querySelector("[data-cw-chosen-text]");
        if (text) text.textContent = choose.getAttribute("data-cw-choose");
        updateLeft(item.closest("[data-cw-root]"));
      }
    }
    const undo = t.closest("[data-cw-undo]");
    if (undo) {
      const item = undo.closest("[data-cw-item]");
      if (item) {
        item.removeAttribute("data-chosen");
        updateLeft(item.closest("[data-cw-root]"));
      }
    }
    const prompt = t.closest("[data-cw-prompt]");
    if (prompt && typeof w.sendPrompt === "function") {
      w.sendPrompt(prompt.getAttribute("data-cw-prompt") || "");
    }
  });
}
const chatRuntimeSource = `(${chatRuntime.toString()})();`;
const as = (c) => c;
const chatWidgets = [
  {
    slug: "project-report",
    load: () => import("./chunks/project-report-CB_GtFpd.js").then((m) => ({
      Component: as(m.ProjectReport),
      demo: m.projectReportDemo
    }))
  },
  {
    slug: "pr-deploy-status",
    load: () => import("./chunks/pr-deploy-status-Cu82Ij7x.js").then((m) => ({
      Component: as(m.PrDeployStatus),
      demo: m.prDeployStatusDemo
    }))
  },
  {
    slug: "decision-inbox-chat",
    load: () => import("./chunks/decision-inbox-chat-qo4ENRbQ.js").then((m) => ({
      Component: as(m.DecisionInboxChat),
      demo: m.decisionInboxChatDemo
    }))
  },
  {
    slug: "session-board",
    load: () => import("./chunks/session-board-XzMujImm.js").then((m) => ({
      Component: as(m.SessionBoard),
      demo: m.sessionBoardDemo
    })),
    // The static export shows one view; the view switch needs React.
    // Row folding re-renders the list, so the static file hides those chevrons.
    staticCss: ".sb-fold{visibility:hidden;pointer-events:none}.sb-card-kids .sb-kids-btn{pointer-events:none}.sb-card-kids .sb-chev{display:none}",
    staticProps: (p) => ({
      views: [p.view ?? p.defaultView ?? "groups"]
    })
  }
];
const chatWidgetFor = (slug) => chatWidgets.find((w) => w.slug === slug);
const escapeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
const escapeText = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const shell = `.cw-wrap{padding:12px;display:flex;justify-content:center}.cw-wrap>*{margin:0 auto}`;
async function renderChatHtml(slug, props, options = {}) {
  const widget = chatWidgetFor(slug);
  if (!widget) throw new Error(`Unknown chat widget: ${slug}`);
  const { Component, demo } = await widget.load();
  const data = props ?? demo;
  const markup = renderToStaticMarkup(
    createElement(Component, { ...data, ...widget.staticProps?.(data) })
  );
  const theme = options.theme ?? "auto";
  const pinned = theme === "auto" ? "" : ` data-cw-theme="${theme}"`;
  const body = `<style>${shell}${widget.staticCss ?? ""}</style><div class="cw-wrap">${markup.replace(/data-cw-root="([^"]+)"/, `data-cw-root="$1"${pinned}`)}</div><script type="application/json" data-cw-props="${slug}">${escapeJson(data)}<\/script><script>${chatRuntimeSource}<\/script>`;
  if (options.fragment) return body;
  const title = escapeText(options.title ?? slug.replace(/-/g, " "));
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="generator" content="Thinking State chat widget: ${slug}">
<title>${title}</title>
<style>html{color-scheme:${theme === "auto" ? "light dark" : theme}}body{margin:0;background:Canvas;font-family:Inter,system-ui,sans-serif}</style>
</head>
<body>
${body}
</body>
</html>
`;
}
const shared = {
  owner: { type: "string", vault: "owner", notion: "Owner" },
  sharedWith: { type: "string[]", notion: "Collabs", note: "Team / company sharing layer" }
};
const chatWidgetSchemas = [
  {
    slug: "project-report",
    name: "Project Report",
    feeds: "Project Portfolio · Weekly GTD",
    role: "Report",
    props: {
      project: { type: "{ name, icon?, status?: { label, tone? }, owner?, sharedWith?, updated?, summary? }", required: true, vault: "project note frontmatter" },
      me: { type: "string", note: "Enables All / Mine" },
      kpis: { type: "{ label, value: number, unit?, note?, tone? }[]", note: "Counts only; no prices" },
      progress: { type: "{ value: 0–100, label?, milestones?: { at, label }[] }", notion: "Progress (formula)" },
      phases: { type: "Phase[]", notion: "Sub-projects / Roadmap & Milestone" },
      waiting: { type: "Waiting[]", vault: "GTD tasks with waiting_on: me" },
      view: { type: '"status" | "cards"' },
      labels: { type: "Partial<labels>", note: "Mongolian labels go here" }
    },
    items: {
      Phase: {
        id: { type: "string", required: true },
        title: { type: "string", required: true },
        state: { type: '"done" | "active" | "blocked" | "next"' },
        status: { type: "string", vault: "status", notion: "Status", note: "Alias of state" },
        line: { type: "string" },
        date: { type: "string" },
        due: { type: "string", vault: "due", notion: "Date", note: "Alias of date" },
        progress: { type: "number 0–100" },
        ...shared
      },
      Waiting: {
        id: { type: "string", required: true },
        title: { type: "string", required: true },
        line: { type: "string" },
        action: { type: "string", note: "Button; sends «<action>: <title>» to the chat" },
        tone: { type: '"green" | "amber" | "blue" | "red" | "gray"' },
        ...shared
      }
    },
    statusMap: {
      done: ["completed", "done", "cancelled"],
      active: ["in-progress"],
      blocked: ["waiting", "waiting-on", "stuck", "failed"],
      next: ["inbox", "planning", "next-action", "someday"]
    }
  },
  {
    slug: "pr-deploy-status",
    name: "PR & Deploy Status",
    feeds: "Delivery / PM",
    role: "Log",
    props: {
      repo: { type: "string", vault: "repo" },
      me: { type: "string", note: "Enables All / Mine on pull requests" },
      prs: { type: "PullRequest[]", note: "From gh pr list" },
      deploys: { type: "Deploy[]" }
    },
    items: {
      PullRequest: {
        number: { type: "number", required: true },
        title: { type: "string", required: true },
        state: { type: '"open" | "draft" | "merged" | "closed"', required: true },
        branch: { type: "string" },
        checks: { type: "{ passed?, failed?, pending? }" },
        review: { type: '"approved" | "changes" | "pending"' },
        updated: { type: "string" },
        href: { type: "string" },
        ...shared
      },
      Deploy: {
        id: { type: "string", required: true },
        env: { type: "string", required: true },
        state: { type: '"live" | "building" | "queued" | "stuck" | "failed"', required: true },
        target: { type: "string" },
        steps: { type: '{ label, state: "done" | "active" | "stuck" | "failed" | "next", time? }[]' },
        blocker: { type: "{ title, detail?, since?, action?, log?: string[] }", note: "No vendor names" }
      }
    }
  },
  {
    slug: "decision-inbox-chat",
    name: "Decision Inbox · Chat",
    feeds: "GTD / My-Day",
    role: "Entity",
    props: {
      title: { type: "string" },
      me: { type: "string", note: "Enables All / Mine" },
      decisions: { type: "Decision[]", required: true, vault: "decision atoms (open questions)" },
      chosen: { type: "Record<id, optionId>" }
    },
    items: {
      Decision: {
        id: { type: "string", required: true },
        title: { type: "string", required: true },
        context: { type: "string" },
        project: { type: "string", vault: "project", notion: "Projects" },
        due: { type: "string", vault: "due", notion: "Date" },
        urgent: { type: "boolean", notion: "Priority = High" },
        options: { type: "{ id, label, recommended? }[]", required: true },
        ...shared
      }
    }
  },
  {
    slug: "session-board",
    name: "Session Board",
    feeds: "Project Portfolio · GTD",
    role: "Entity",
    props: {
      project: { type: "{ name, icon?, status?, owner?, stats?, links? }", required: true },
      me: { type: "string", note: "Enables All / Mine" },
      groups: { type: "{ id, label, defaultCollapsed? }[]", note: "PARA: projects, areas, resources, finance" },
      sessions: { type: "Session[]", required: true, note: "From list_sessions {linked: true}" },
      view: { type: '"groups" | "status" | "cards"' }
    },
    items: {
      Session: {
        id: { type: "string", required: true },
        title: { type: "string", required: true },
        state: { type: '"running" | "waiting" | "done" | "idle"' },
        status: { type: "string", vault: "status", notion: "Status", note: "Alias of state" },
        line: { type: "string" },
        group: { type: "string", vault: "PARA folder", notion: "PARA" },
        parent: { type: "string", notion: "Parent project" },
        pr: { type: "number | { number, state? }" },
        ...shared
      }
    },
    statusMap: {
      running: ["in-progress"],
      waiting: ["waiting", "waiting-on", "blocked"],
      done: ["completed", "done", "cancelled", "merged"],
      idle: ["inbox", "planning", "next-action", "someday"]
    }
  }
];
const schemaFor = (slug) => chatWidgetSchemas.find((s) => s.slug === slug);
export {
  chatRuntime,
  chatRuntimeSource,
  chatWidgetFor,
  chatWidgetSchemas,
  chatWidgets,
  renderChatHtml,
  schemaFor
};
//# sourceMappingURL=chat.js.map
