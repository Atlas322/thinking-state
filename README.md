# Thinking State

Thinking State is the engine that shows an agent's work as live widgets — the product layer of INAI, live at [thinkstate.site](https://thinkstate.site). This repository is its component library (formerly called Component Studio): a searchable, copyable React component library covering all **90 components** listed on [affectUI](https://www.affectui.com/components). The app includes a categorized menu, live previews, light/dark themes, favorites, source code, usage examples, and **Copy prompt**.

**23 components use the original MIT source**, with Clean and Classic styles. **67 are independent recreations** of public previews and documented behavior. They are not affectUI Pro source, and they do not all match the original appearance or API. See [VISUAL_REVIEW.md](./VISUAL_REVIEW.md) for the actual browser comparison and remaining differences.

The [architecture audit](./ARCHITECTURE_AUDIT.md) verifies how affectUI uses the shadcn registry and records the implementation gaps. The 67 independent recreations should not be treated as exact substitutes for affectUI Pro.

[COMPONENT_REVIEW.md](./COMPONENT_REVIEW.md) tracks each of the 90 components separately. Ten independent components were substantially rebuilt, with a later cached-reference review correcting Agent Inbox integration and Agent Graph edge cases. Agent Graph was revised from the user's reference screenshots; the new render still awaits a screenshot comparison. Browser permissions currently block both the reference site and local preview, so the full visual audit is unfinished.

## Start locally

Use Node.js 22.12+.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. The default page is Thinking State; use the left menu or `/` to search. On small screens, open the menu with the top-left button. Each component has a direct `#/component-name` URL.

## Copy into your project

- **Copy code** copies the complete standalone `.tsx` file, including styles.
- **Copy prompt** copies installation instructions, usage, and the full source. Paste it into ChatGPT, Codex, Claude, Cursor, or another coding assistant. The recipient does not need access to this private repository.
- **Download component** saves the selected file.
- **Take the library with you** downloads all 114 source variants and their usage examples as a ZIP.

Requires React 19 and TypeScript. No Tailwind, icon package, or animation library is required. Inter is optional. All copied components support a `.dark` or `data-theme="dark"` ancestor. Source files live in `src/library`; usage examples are shown in the app and included in the ZIP.

```tsx
import { AgentInbox } from "./components/agent-inbox";

export function Dashboard() {
  return (
    <AgentInbox
      defaultView="board"
      tasks={[{
        id: "review",
        title: "Review release notes",
        agent: "Writer",
        status: "done",
        elapsed: 80_000,
      }]}
    />
  );
}
```

Named exports accept application data and callbacks. Default exports render a working example. Review the exported TypeScript prop types before integrating: the independent implementations can have different APIs from affectUI. UI demos do not execute real searches, run agents, approve production changes, or send messages. Connect their callbacks to your application.

When copying an original MIT component, retain the license notice included at the top of its file. Attribution and details are in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

## Package: `@inai/thinking-state` (inai-sh-д хэрхэн хэрэглэх)

inai.sh and other apps use Thinking State as a git package, so there is one
source. The package holds code and tokens only: the company renderer, vault
collections, chat widgets, icons, the Company contract types and
`tokens.css`. No fixtures and no vault data — `npm run build:lib` fails if
any end up in `lib/`.

**Install** (pin a release tag; the tag carries the built `lib/`, so nothing
is built on install):

```bash
npm i github:Atlas322/thinking-state#v0.1.0
```

The repository is private: the machine (or CI) that installs needs GitHub
access to `Atlas322/thinking-state` (SSH key or a token in git credentials).
React 19 and react-dom 19 are peer dependencies.

**Use**

```tsx
import "@inai/thinking-state/tokens.css";
import { CompanyView, CollectionPanel, type Company } from "@inai/thinking-state";

export function CompanyPage({ company }: { company: Company }) {
  return (
    <div data-ts-theme="cream">
      <CompanyView company={company} />
    </div>
  );
}

// бараан (бүлээн саарал), сайт ба апп-д ижил
<div data-ts-theme="dark" data-theme="dark">
  <CompanyView company={company} defaultView="dashboard" />
</div>
```

Chat HTML export (uses `react-dom/server`): `import { renderChatHtml } from "@inai/thinking-state/chat"`.

**Theme.** Every component reads its colours and fonts from `--ts-*`
variables (`--ts-page`, `--ts-surface`, `--ts-soft`, `--ts-line`, `--ts-fg`,
`--ts-muted`, `--ts-faint`, `--ts-accent`, status colours with `-soft`
pairs, `--ts-font`, `--ts-font-display`, `--ts-font-mono`) and falls back to
its own defaults. `tokens.css` нь хоёр theme-тэй (owner 11-12): `cream`
(Чиглэл 1, цөцгий) ба `dark` (бүлээн саарал бараан, сайт ба апп-д ижил: side
#1F1E1D, page #262624, карт #30302E, текст #ECEBE7). Accent ганцхан: Electric
(дүүргэлттэй товч `--ts-accent-strong` #1B5CFF, бараан дээрх icon/том текст
#4D7FFF, жижиг accent текст `--ts-accent-fg`). Индиго хасагдсан, `data-ts-mode` өнгө
солихгүй, `data-ts-theme="manage"` = dark (v0.1-ийн нэр). Палитр нь каталогийн Agent
Lanes-ээс: саармаг гадаргуу, нимгэн шугам, төлөв бүрт гурвал
`--ts-status-{running,needs-you,error,done,idle}-{bg,border,fg}`. Ангиллын
`--ts-cat-1..4` тод (#F5A524, #0C8CE9, #22C55E, #A855F7) зөвхөн жижиг тэмдэгт; tint
дээрх текст `--ts-cat-N-fg`, тод дүүргэлт дээрх текст `--ts-on-cat-N`. Хавтас
`--ts-folder` #E8B931. Гарчиг хоёр theme-д Inter Semi Bold (`--ts-font-head`, −2%),
шатлал `--ts-type-display/h1/h2/h3` = 59/36/33/20. Сонгосон төлөв `--ts-selected`
#0C8CE9, цагаан текст. Фонт багцад орохгүй: Inter, IBM Plex Mono-г Google Fonts
css2-оор `&text=`-гүй ачаал (ү, ө = cyrillic-ext).

**Сайт (`@inai/thinking-state/site.css`).** Маркетингийн сайтад зориулсан, ижил
token-оос үүсгэсэн файл. Wrapper шаардахгүй: `:root` нь cream,
`:root[data-theme="dark"]` нь бараан.
Тогтвортой alias-ууд: `--ts-color-bg/side/rail/surface/raised/tile/line/text/
text-muted/text-faint/accent/accent-text/accent-soft/accent-strong/electric/folder/link/amber/
amber-soft/green/red`, `--ts-shadow`, `--ts-font-heading/text/label`. tokens.css-ийг
өөрчилсний дараа `npm run tokens:site` ажиллуул (тест зөрөхийг барина).

**Primitive (`src/ui`) ба `ts.css`.** Апп ба сайтын цорын ганц дизайн систем
(owner 11-12). Үүнд: `Text` (display, h1–h3, body-lg, body, small, label, mono,
caption), `Button` (primary, secondary, ghost; sm/md/lg; `href` бол линк),
`SplitCTA` (тусдаа ↗ нүдтэй блок CTA), `Pill` (`selected`, `count`; `onClick` бол
aria-pressed toggle), `Tabs` (`variant="tabs"` = tablist, `"segmented"` = radiogroup;
сум, Home, End товчоор удирдана), `Badge` (`tone`, ангиллын `cat-1..4`), `Card`
(`interactive`, `selected`, `block`), `Stack`. Сонгосон төлөв `--ts-selected`
#0C8CE9, цагаан текст. Control гадна margin-гүй. Сайт зөвхөн
`import "@inai/thinking-state/ts.css"` хийнэ: token (`:root` cream,
`[data-theme=dark]`), alias, primitive, motion бүгд нэг файлд. `npm run tokens:site`
нь site.css ба ts.css-ийг үүсгэнэ, тест хоёуланг нь шинэ эсэхийг шалгана.

**Хувилбар (scenario) ба чанарын босго.** Thinking State-ийн компонент бүр өөрийн утга
зүйн хувилбарыг тоглоно (owner 11-12). Хувилбар нь 3–5 төлөв, тэдгээрийн хооронд spring
шилжилт, амрах завсар, loop-оос бүрдэнэ. `useScenario(steps, { rest, loops })` эсвэл
`<ScenarioRegion steps>{(state) => …}</ScenarioRegion>` ашигла. Алхмууд өгөгдлөөс
(`{ state, hold }`) ирнэ. Хувилбар зөвхөн viewport-д харагдаж байх үед тоглоно,
хамгийн ихдээ 3 давталт хийнэ, ↺ ба ⏸ товчтой, reduced-motion үед эцсийн төлөвийг
харуулна. Input-ууд (checkbox, switch, select…) runtime дээр зөвхөн хэрэглэгчийн
үйлдлээр хөдөлнө, demo хувилбар нь зөвхөн preview давхаргад байна.
`npm run check:quality` (`check:motion`, `check:icons`) нь каталогийн preview бүрийг
headless Chrome-оор нээж хоёр зүйлийг шалгана: 6.5 с-д DOM өөрөө өөрчлөгдөж байна уу
(хувилбар), ангилал илэрхийлдэг tab/radio/toggle/chip/pill/tag/badge бүр icon-той юу.
Мэдэгдэж буй дутагдал `scripts/quality-baseline.json`-д бүртгэлтэй. Шинэ дутагдал гарвал
exit 1 буцаана, засварласны дараа `--update-baseline` ажиллуул.

**Spacing.** 4px суурьтай `--ts-space-1…10` (4 8 12 16 24 32 48 64 72 96), хэмнэл
`--ts-gap-stack-sm/md/lg` (8/16/24), `--ts-gap-control` (control-ийн доор доод тал нь
16), `--ts-gap-section` (72, Figma «Нүүр v02»). Control (segmented, tab мөр,
radiogroup) гадна margin-гүй. Зайг эцгийн `gap`-аар өгнө: `<Stack gap="control">`.
`npm run check:spacing` нь каталогийн preview бүрийг 1440 ба 390-д headless Chrome-оор
нээж, доороо 16px-ээс бага зайтай control-уудыг жагсаана (`--strict` бол exit 1).

**Exports**

| Path | What |
|---|---|
| `@inai/thinking-state` | `CompanyView`, `CollectionView` / `CollectionPanel`, `Dashboard`, `RaciView`, `PersonProfile`, `MethodologyView`, row parts (`StatusPill`, `PriorityBadge`, `RelationChip`, `ProgressNM`, `RelDate`, `TypeBadge`), `Icon` and the icon maps, the Company contract types and helpers, chat widgets (`ProjectReport`, `PrDeployStatus`, `DecisionInboxChat`, `SessionBoard`) |
| `@inai/thinking-state/chat` | `renderChatHtml`, `chatRuntime`, `chatWidgets`, `chatWidgetSchemas` |
| `@inai/thinking-state/tokens.css` | the `--ts-*` themes |

**Motion (v2 суурь, `src/motion/`)**

- `--ts-motion-*` token (`tokens.css`, 🎨 «компонентын бүртгэл ба хөдөлгөөн» §1-ээс): хугацаа `dur-xs/sm/md/lg/xl` (120/200/320/560/900 мс), easing `standard/enter/exit/loop`, spring `soft/settle/heavy` (ζ ≥ 0.7, үсрэлтгүй). Spring бүр `--ts-motion-spring-NAME` ба `…-duration` хос. Loop-ийн хэмнэл icon бүрээр: `loopAnimation(name, { move, rest, spring })` эсвэл `useLoop()` (default нь move 1.2 с + rest 4 с). `--ts-motion-loop-count` 3 давталт. Үүний дараа амарна, hover хийх эсвэл viewport-д дахин орох үед дахин эхэлнэ. `--ts-motion-stagger` 100 мс. Spring нь хамааралгүй, аналитик тооцоолсон damped oscillator (`spring.ts`). Түүнийг CSS `linear()` болгодог тул JS кадр бүрт ажиллахгүй. Нэг хэсэгт нэг л амьд icon байх дүрмийг компонент сахина.
- Loop: `ts-loop ts-loop-{bob|swing|breathe|float|spin|pulse|nudge|pop|shake}`, нэг удаагийн `ts-enter`. Зөвхөн transform/opacity ашиглана (compositor). Keyframe дотор `var()` байхгүй, учир нь `var()` нь animation-ийг main thread руу шилжүүлдэг. Тохиргоо: `--ts-loop-period`, `--ts-loop-delay`, `--ts-loop-origin`.
- `useInViewLoop()` / `<LoopRegion>`: бүх хуудсанд нэг IntersectionObserver ажиллана. Бүс `data-ts-loop`-тэй: `running` (тоглоно), `offscreen` ба `hidden` (тухайн байрлалдаа хөлдөнө), `paused` ба `reduced` (animation-гүй, эцсийн төлөв). `<MotionControls>` нь ↺ ба ⏸/▶ товч (WCAG 2.2.2); зөвхөн ↺ хэрэгтэй бол `<Replay>` (`src/replay`). `<MotionProvider>` бүх хуудсыг нэг дор зогсооно. `animateSpring(el, keyframes, "snappy")` нь нэг удаагийн WAAPI animation.
- Хэмжээ: `src/motion` minify хийсэн 14.1 KB, gzip 5.3 KB, React-аас өөр хамааралгүй.
- Хэмжилт: `npm run dev`, дараа нь `node scripts/measure-motion.mjs --url http://127.0.0.1:5173 --cpu 4 --gpu`. Headless Chrome 390×844@3x дээр 96 loop-ийн trace-ээс compositor-ийн зурсан кадрыг тоолно.

**Release** (maintainers): bump `version`, then `npm run release:lib -- vX.Y.Z`
builds `lib/`, runs the tests, commits `lib/` on `release/vX.Y.Z`, tags it,
and returns to your branch. Push with `git push origin release/vX.Y.Z vX.Y.Z`.
`lib/` is git-ignored everywhere else, so it never lands in a PR.

## Validate and build

```sh
npm test
npm run check:copy
npm run build
npm run preview
```

`check:copy` creates a temporary standalone copy of all 114 variants and compiles each with its usage example. The test suite renders every variant and exercises key state changes and callbacks. GitHub Actions runs these checks on pushes and pull requests.

`npm run package:library` regenerates `public/component-library.zip`. This also runs before development and production builds, so downloaded files stay aligned with the preview source. ZIP packaging uses Node's built-in libraries; no extra tooling is required.

## Structure

- `src/library/` — 114 standalone component files, including 24 Classic variants.
- `src/catalog.json` — 90 entries with category, provenance, export name, and usage.
- `src/registry.ts` — lazy preview/source loading and complete prompt generation.
- `src/App.tsx` and `src/demo.css` — browsing and copy interface.
- `src/components/` — the initial two-file Thinking State implementation, kept for compatibility.
- `scripts/` — reproducible ZIP packaging and isolated copy validation.

The app loads the selected component on demand. The surrounding Thinking State interface is a custom catalog; it is not a clone of affectUI's entire website.

## Deploy notifications (Railway → Resend)

`server.mjs` serves `dist/` and exposes `POST /api/railway-webhook`. Railway calls it on
deployment status changes and the server emails a summary through Resend.

Service variables (Railway → service → Variables):

| Variable | Purpose |
|----------|---------|
| `WEBHOOK_TOKEN` | Shared secret; Railway sends it as `Authorization: Bearer <token>` |
| `RESEND_API_KEY` | Resend API key (`re_...`) |
| `NOTIFY_EMAIL_TO` | Recipient(s), comma-separated |
| `NOTIFY_EMAIL_FROM` | Sender, e.g. `Deploys <deploys@thinkstate.site>` (domain must be verified in Resend) |
| `NOTIFY_STATUSES` | Statuses to email, default `SUCCESS,FAILED,CRASHED` |
| `NOTIFY_TEST_COOLDOWN_MS` | Min interval between website test-button emails, default 30000 |
| `NOTIFY_ON_START` | Set to `false` to disable the startup self-report (default on) |

The topbar "Test notification" button calls `POST /api/notify-test`, which emails the
configured recipient (rate limited). On every successful deploy the new container also emails on its own (using Railway's
`RAILWAY_GIT_*` / `RAILWAY_DEPLOYMENT_ID` variables, deduplicated via Resend's Idempotency-Key),
so `SUCCESS` mails need no webhook. For `FAILED`/`CRASHED` mails add the webhook:
Railway → Project Settings → Webhooks → URL `https://www.thinkstate.site/api/railway-webhook`,
header `Authorization: Bearer <WEBHOOK_TOKEN>`, events: deployment status changes.
