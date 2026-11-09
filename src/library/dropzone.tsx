"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */
export type StudioItem = {
  id: string;
  title: string;
  detail?: string;
  status?: string;
  value?: number;
  cost?: number;
  color?: string;
  children?: StudioItem[];
  tags?: string[];
};
export type StudioProps = {
  title?: string;
  items?: StudioItem[];
  className?: string;
  onAction?: (action: string, item?: StudioItem) => void;
};

const UI = {
  Panel({
    title,
    subtitle,
    aside,
    children,
    className = "",
  }: {
    title?: string;
    subtitle?: string;
    aside?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <section className={`st-ui ${className}`}>
        <style>{studioCSS}</style>
        {title && (
          <header className="st-head">
            <div>
              <strong>{title}</strong>
              {subtitle && <p>{subtitle}</p>}
            </div>
            {aside}
          </header>
        )}
        <div className="st-content">{children}</div>
      </section>
    );
  },
  Button({
    children,
    primary = false,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) {
    return (
      <button
        type="button"
        {...props}
        className={`st-btn ${primary ? "st-primary" : ""} ${props.className ?? ""}`}
      >
        {children}
      </button>
    );
  },
  Badge({ children, tone = "" }: { children: React.ReactNode; tone?: string }) {
    return <span className={`st-badge ${tone}`}>{children}</span>;
  },
  Avatar({ name, color }: { name: string; color?: string }) {
    return (
      <span className="st-avatar" style={{ color }}>
        {name.slice(0, 2)}
      </span>
    );
  },
  Row({
    title,
    detail,
    icon,
    children,
    onClick,
  }: {
    title: React.ReactNode;
    detail?: React.ReactNode;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    onClick?: () => void;
  }) {
    const content = (
      <>
        {icon}
        <span className="st-grow">
          <span className="st-row-title">{title}</span>
          {detail && <small>{detail}</small>}
        </span>
        {children}
      </>
    );
    return onClick ? (
      <button type="button" className="st-row st-row-button" onClick={onClick}>
        {content}
      </button>
    ) : (
      <div className="st-row">{content}</div>
    );
  },
  Meter({
    value,
    label,
    color,
  }: {
    value: number;
    label?: string;
    color?: string;
  }) {
    return (
      <div
        className="st-meter"
        role="progressbar"
        aria-label={label ?? "Progress"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(Math.max(0, Math.min(100, value)))}
      >
        <span
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
            background: color,
          }}
        />
      </div>
    );
  },
  Tabs({
    values,
    value,
    onChange,
  }: {
    values: string[];
    value: string;
    onChange: (value: string) => void;
  }) {
    return (
      <div className="st-tabs" role="group" aria-label="View">
        {values.map((v) => (
          <button
            type="button"
            key={v}
            aria-pressed={v === value}
            onClick={() => onChange(v)}
          >
            {v}
          </button>
        ))}
      </div>
    );
  },
  Field({
    label,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
    const id = React.useId();
    return (
      <label className="st-field" htmlFor={id}>
        <span>{label}</span>
        <input {...props} id={id} />
      </label>
    );
  },
  Detail({
    title,
    children,
    open,
  }: {
    title: React.ReactNode;
    children: React.ReactNode;
    open?: boolean;
  }) {
    return (
      <details className="st-detail" open={open}>
        <summary>
          {title}
          <span aria-hidden="true">⌄</span>
        </summary>
        <div>{children}</div>
      </details>
    );
  },
  Empty({ children = "All caught up" }: { children?: React.ReactNode }) {
    return (
      <p className="st-empty" role="status">
        ✓ {children}
      </p>
    );
  },
  Spark({
    values,
    color = "var(--st-accent)",
  }: {
    values: number[];
    color?: string;
  }) {
    const max = Math.max(1, ...values);
    return (
      <svg
        className="st-spark"
        viewBox="0 0 480 130"
        role="img"
        aria-label="Trend chart"
      >
        {[25, 65, 105].map((y) => (
          <path
            key={y}
            d={`M0 ${y}H480`}
            stroke="var(--st-line)"
            strokeDasharray="3 4"
          />
        ))}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={values
            .map(
              (v, i) =>
                `${(i / Math.max(1, values.length - 1)) * 480},${120 - (v / max) * 100}`,
            )
            .join(" ")}
        />
      </svg>
    );
  },
  useClock(active = true) {
    const [seconds, setSeconds] = React.useState(0);
    React.useEffect(() => {
      if (!active) return;
      const id = window.setInterval(() => setSeconds((n) => n + 1), 1000);
      return () => window.clearInterval(id);
    }, [active]);
    return seconds;
  },
  useCopy() {
    const [status, setStatus] = React.useState("");
    const copy = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setStatus("Copied");
      } catch {
        setStatus("Copy unavailable. Select and copy the text.");
      }
    };
    return { status, copy };
  },
};

const studioCSS = `
.st-ui{--st-bg:#fff;--st-fg:#262629;--st-muted:#828287;--st-soft:#f7f7f8;--st-line:#ebebed;--st-accent:#547ded;--st-green:#32956a;--st-red:#d76060;--st-amber:#bd8b35;width:100%;max-width:680px;color:var(--st-fg);font:400 13px/1.55 Inter,system-ui,sans-serif;background:var(--st-bg);border:1px solid var(--st-line);border-radius:14px;box-shadow:0 2px 8px #00000003;overflow:visible;isolation:isolate}
:where(.dark,[data-theme=dark]) .st-ui{--st-bg:#1c1c1f;--st-fg:#e4e4e7;--st-muted:#929298;--st-soft:#242427;--st-line:#303035;--st-accent:#7899ff;--st-green:#69bf97;--st-red:#ed8585;--st-amber:#dbad61;color-scheme:dark}
.st-ui *{box-sizing:border-box}.st-ui button,.st-ui input,.st-ui textarea,.st-ui select{font:inherit}.st-ui button{cursor:pointer}.st-ui button:disabled{cursor:not-allowed;opacity:.4}.st-ui :focus-visible{outline:2px solid var(--st-accent);outline-offset:3px}.st-ui strong{font-weight:550}.st-ui p{margin:0 0 12px}.st-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:20px 22px;border-bottom:1px solid var(--st-line)}.st-head strong{font-size:14px}.st-head p{color:var(--st-muted);font-size:12px;margin:4px 0 0}.st-content{padding:10px 20px 18px}.st-row{display:flex;align-items:center;gap:12px;min-height:58px;padding:12px 0;border-bottom:1px solid var(--st-line);width:100%;text-align:left}.st-row:last-child{border-bottom:0}.st-row-button{background:none;border-top:0;border-left:0;border-right:0;color:inherit}.st-row-button:hover{background:var(--st-soft)}.st-row-title{display:block;font-weight:500}.st-grow{flex:1;min-width:0}.st-ui small,.st-muted{display:block;color:var(--st-muted);font-size:11px}.st-btn{border:1px solid var(--st-line);border-radius:7px;background:var(--st-bg);color:var(--st-fg);padding:6px 11px;display:inline-flex;align-items:center;justify-content:center;gap:6px;font-weight:500;white-space:nowrap;transition:background .18s,transform .18s;min-height:30px}.st-btn:hover{background:var(--st-soft)}.st-btn:active{transform:scale(.97)}.st-btn.st-primary{background:var(--st-fg);color:var(--st-bg);border-color:var(--st-fg)}.st-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:16px}.st-badge{display:inline-flex;align-items:center;gap:5px;font-size:10px;line-height:18px;padding:0 6px;border-radius:4px;background:var(--st-soft);color:var(--st-muted);white-space:nowrap}.st-badge.running,.st-badge.blue{color:var(--st-accent);background:color-mix(in srgb,var(--st-accent) 9%,transparent)}.st-badge.done,.st-badge.green,.st-badge.success{color:var(--st-green);background:color-mix(in srgb,var(--st-green) 9%,transparent)}.st-badge.failed,.st-badge.red{color:var(--st-red);background:color-mix(in srgb,var(--st-red) 9%,transparent)}.st-badge.waiting,.st-badge.amber{color:var(--st-amber);background:color-mix(in srgb,var(--st-amber) 9%,transparent)}.st-avatar{display:grid;place-items:center;flex:none;width:30px;height:30px;border:1px solid var(--st-line);border-radius:8px;font-size:11px;background:var(--st-soft);font-weight:600}.st-meter{height:5px;background:var(--st-line);border-radius:10px;overflow:hidden}.st-meter>span{display:block;height:100%;background:var(--st-accent);border-radius:inherit;transition:width .6s cubic-bezier(.2,.8,.2,1)}.st-tabs{display:flex;gap:4px;padding:8px 0;flex-wrap:wrap}.st-tabs button{border:0;border-radius:6px;background:transparent;color:var(--st-muted);padding:5px 9px;font-size:11px}.st-tabs button[aria-pressed=true]{background:var(--st-soft);color:var(--st-fg)}.st-field{display:grid;gap:6px;margin:12px 0}.st-field>span{font-size:12px;font-weight:500}.st-field input,.st-ui textarea,.st-ui select,.st-input{border:1px solid var(--st-line);border-radius:7px;background:var(--st-bg);color:var(--st-fg);padding:8px 10px;min-width:0;max-width:100%;width:100%}.st-ui textarea{resize:vertical;min-height:85px}.st-detail{border-bottom:1px solid var(--st-line)}.st-detail summary{display:flex;justify-content:space-between;gap:12px;cursor:pointer;padding:13px 0;list-style:none}.st-detail summary::-webkit-details-marker{display:none}.st-detail[open] summary>span:last-child{transform:rotate(180deg)}.st-detail>div{padding:0 0 14px}.st-empty{padding:26px 8px;color:var(--st-muted);text-align:center}.st-spark{width:100%;height:130px;overflow:visible;margin:16px 0}.st-big{font-size:34px;letter-spacing:-1.5px;font-weight:550;font-variant-numeric:tabular-nums;margin:12px 0 0}.st-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:12px 0}.st-tile{padding:16px;border:1px solid var(--st-line);border-radius:10px;background:var(--st-bg);min-width:0;text-align:left;color:inherit;transition:border-color .2s,background .2s}.st-tile.active{border-color:var(--st-accent);background:color-mix(in srgb,var(--st-accent) 4%,var(--st-bg))}.st-tile h4{font-size:13px;margin:7px 0}.st-tile p{font-size:12px;color:var(--st-muted)}.st-dot{width:7px;height:7px;display:inline-block;flex:none;border-radius:50%;background:var(--st-accent)}.st-dot.running{animation:st-pulse 1.5s infinite}.st-timeline{list-style:none;padding:4px 0;margin:0}.st-timeline>li{position:relative;margin-left:8px;border-left:1px solid var(--st-line);padding:0 0 20px 24px;animation:st-appear .35s both}.st-timeline>li:before{content:'';position:absolute;left:-4px;top:7px;width:7px;height:7px;border-radius:50%;background:var(--st-muted);box-shadow:0 0 0 4px var(--st-bg)}.st-timeline>li.active:before{background:var(--st-accent);animation:st-pulse 1.5s infinite}.st-timeline>li:last-child{border-color:transparent;padding-bottom:4px}.st-code{font:11px/1.7 ui-monospace,monospace;background:var(--st-soft);border:1px solid var(--st-line);border-radius:8px;padding:14px;white-space:pre-wrap;overflow:auto;word-break:break-word;color:var(--st-muted)}.st-split{display:grid;grid-template-columns:160px 1fr;gap:16px}.st-bars{display:flex;align-items:flex-end;gap:4px;height:85px;margin:16px 0}.st-bars>button{padding:0;flex:1;min-width:2px;border:0;border-radius:3px 3px 0 0;background:var(--st-accent);opacity:.65;transition:height .4s,opacity .2s}.st-bars>button:hover{opacity:1}.st-key{font:10px ui-monospace,monospace;padding:2px 5px;border:1px solid var(--st-line);border-radius:4px;color:var(--st-muted)}.st-table-wrap{overflow:auto}.st-table{border-collapse:collapse;width:100%;font-size:12px}.st-table th{text-align:left;font-weight:500;color:var(--st-muted);padding:10px 8px;border-bottom:1px solid var(--st-line)}.st-table td{padding:11px 8px;border-bottom:1px solid var(--st-line)}.st-table input{width:100%;min-width:90px;border:1px solid transparent;background:none;color:inherit;padding:4px;border-radius:4px}.st-table input:focus{border-color:var(--st-accent)}.st-table tr:hover{background:var(--st-soft)}.st-branch{margin-left:18px;padding-left:18px;border-left:1px solid var(--st-line)}.st-link{border:0;background:none;color:var(--st-accent);padding:0;cursor:pointer;text-decoration:none}.st-check{accent-color:var(--st-accent);width:15px;height:15px}.st-status{color:var(--st-green);font-size:12px;margin-top:12px;min-height:18px}.st-flow{display:flex;gap:14px;align-items:center;justify-content:center;margin:24px 0}.st-flow>div{flex:1}.st-grid-cells{display:grid;grid-template-columns:repeat(12,1fr);gap:5px;margin:18px 0}.st-grid-cells button{border:0;aspect-ratio:1;border-radius:3px;background:var(--st-line);padding:0;min-width:0}.st-grid-cells button:hover{outline:2px solid var(--st-accent);outline-offset:2px}.st-chip{padding:3px 7px;border-radius:5px;border:1px solid var(--st-line);font-size:11px;display:inline-flex;gap:7px;align-items:center;background:var(--st-soft)}.st-chip button{border:0;background:none;color:inherit;padding:0}.st-bubble{padding:12px 15px;background:var(--st-soft);border-radius:0 10px 10px;margin:8px 0;max-width:90%;white-space:pre-wrap}.st-bubble.user{margin-left:auto;border-radius:10px 0 10px 10px;background:color-mix(in srgb,var(--st-accent) 9%,transparent)}.st-prose{font-size:13px;line-height:1.9;margin:18px 0;white-space:pre-wrap}.st-checkline{display:flex;align-items:center;gap:10px;padding:10px 0}.st-checkline input{accent-color:var(--st-accent)}.st-toast{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:10px;background:var(--st-bg);box-shadow:0 3px 20px #0001;border:1px solid var(--st-line);animation:st-appear .3s both;margin-top:10px}.st-calendar{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}.st-calendar button{border:0;background:none;color:inherit;aspect-ratio:1;border-radius:6px;padding:4px;font-size:12px}.st-calendar button.selected{background:var(--st-accent);color:white}.st-calendar button.inrange{background:color-mix(in srgb,var(--st-accent) 12%,transparent)}.st-calendar small{text-align:center;padding:8px 0}.st-range{width:100%;accent-color:var(--st-accent)}@keyframes st-appear{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}@keyframes st-pulse{50%{opacity:.4;box-shadow:0 0 0 4px color-mix(in srgb,var(--st-accent) 10%,transparent)}}@media(max-width:540px){.st-head{padding:16px}.st-content{padding:8px 14px 16px}.st-columns{grid-template-columns:1fr}.st-split{grid-template-columns:1fr}.st-flow{flex-wrap:wrap}.st-head strong{font-size:13px}.st-row{gap:8px}.st-btn{padding:6px 8px}.st-grid-cells{grid-template-columns:repeat(8,1fr)}}@media(prefers-reduced-motion:reduce){.st-ui *,.st-ui *::before{animation:none!important;transition:none!important}}
`;

export type UploadItem = {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "done" | "error";
  progress: number;
  error?: string;
  file?: File;
};
export type DropzoneProps = {
  accept?: string[];
  maxSize?: number;
  onUpload?: (
    file: File,
    onProgress: (progress: number) => void,
  ) => Promise<void>;
  onChange?: (items: UploadItem[]) => void;
  hint?: string;
  autoplay?: boolean;
  className?: string;
};
export function Dropzone({
  accept,
  maxSize = 25 * 1024 * 1024,
  onUpload,
  onChange,
  hint,
  autoplay = false,
  className = "",
}: DropzoneProps) {
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const itemsRef = React.useRef<UploadItem[]>([]);
  const [drag, setDrag] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  const input = React.useRef<HTMLInputElement>(null);
  const attempts = React.useRef(new Map<string, symbol>());
  const simulations = React.useRef(new Map<string, number>());
  const mounted = React.useRef(true);
  const sequence = React.useRef(0);
  const dragDepth = React.useRef(0);
  const id = React.useId();
  const changeRef = React.useRef(onChange);
  changeRef.current = onChange;
  React.useEffect(() => {
    mounted.current = true;
    const timers = simulations.current;
    const tokens = attempts.current;
    return () => {
      mounted.current = false;
      timers.forEach((timer) => window.clearInterval(timer));
      timers.clear();
      tokens.clear();
    };
  }, []);
  const commit = (next: UploadItem[]) => {
    if (!mounted.current) return;
    itemsRef.current = next;
    setItems(next);
    changeRef.current?.(next);
  };
  const patch = (itemId: string, changes: Partial<UploadItem>) => {
    if (!itemsRef.current.some((item) => item.id === itemId)) return;
    commit(
      itemsRef.current.map((item) =>
        item.id === itemId ? { ...item, ...changes } : item,
      ),
    );
  };
  const validate = (file: File) => {
    if (file.size > Math.max(0, maxSize)) return "Too large";
    if (
      accept?.length &&
      !accept.some((rule) => {
        const value = rule.toLowerCase().trim();
        return value.startsWith(".")
          ? file.name.toLowerCase().endsWith(value)
          : value.endsWith("/*")
            ? file.type.toLowerCase().startsWith(value.slice(0, -1))
            : file.type.toLowerCase() === value;
      })
    )
      return "File type not accepted";
    return undefined;
  };
  const upload = (item: UploadItem, simulate = false) => {
    if (!item.file) return;
    const token = Symbol(item.id);
    attempts.current.set(item.id, token);
    const valid = () =>
      mounted.current && attempts.current.get(item.id) === token;
    patch(item.id, { status: "uploading", progress: 0, error: undefined });
    const progress = (value: number) => {
      if (valid() && Number.isFinite(value))
        patch(item.id, { progress: Math.min(1, Math.max(0, value)) });
    };
    const done = () => {
      if (!valid()) return;
      attempts.current.delete(item.id);
      patch(item.id, { status: "done", progress: 1 });
      setAnnouncement(
        `${item.name}: ${onUpload && !simulate ? "upload complete" : "demo complete"}.`,
      );
    };
    if (onUpload && !simulate) {
      Promise.resolve()
        .then(() => onUpload(item.file!, progress))
        .then(done, (failure) => {
          if (!valid()) return;
          attempts.current.delete(item.id);
          const error =
            failure instanceof Error ? failure.message : "Upload failed";
          patch(item.id, { status: "error", error });
          setAnnouncement(`${item.name}: ${error}.`);
        });
    } else {
      let value = 0;
      const timer = window.setInterval(() => {
        if (!valid()) {
          window.clearInterval(timer);
          simulations.current.delete(item.id);
          return;
        }
        value = Math.min(1, value + 0.125);
        progress(value);
        if (value === 1) {
          window.clearInterval(timer);
          simulations.current.delete(item.id);
          done();
        }
      }, 180);
      simulations.current.set(item.id, timer);
    }
  };
  const add = (files: File[], simulate = false) => {
    const incoming: UploadItem[] = files.map((file) => {
      const error = validate(file);
      return {
        id: `${id}-${++sequence.current}`,
        name: file.name,
        size: file.size,
        file,
        progress: 0,
        status: error ? "error" : "uploading",
        error,
      };
    });
    commit([...itemsRef.current, ...incoming]);
    const rejected = incoming.filter((item) => item.error);
    if (rejected.length)
      setAnnouncement(
        rejected.map((item) => `${item.name}: ${item.error}`).join(". "),
      );
    incoming
      .filter((item) => !item.error)
      .forEach((item) => upload(item, simulate));
  };
  const addRef = React.useRef(add);
  addRef.current = add;
  React.useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(
      () =>
        addRef.current(
          [
            new File(["Demo document"], "Project brief.pdf", {
              type: "application/pdf",
            }),
            new File(["Demo image"], "Cover.png", { type: "image/png" }),
            new File(["Demo image"], "Team.jpg", { type: "image/jpeg" }),
            new File(["Demo sheet"], "Budget.xlsx", {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
          ],
          true,
        ),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [autoplay]);
  const remove = (item: UploadItem) => {
    attempts.current.delete(item.id);
    const timer = simulations.current.get(item.id);
    if (timer !== undefined) window.clearInterval(timer);
    simulations.current.delete(item.id);
    commit(itemsRef.current.filter((value) => value.id !== item.id));
    setAnnouncement(`${item.name} removed from the list.`);
  };
  const help =
    hint ??
    `${accept?.join(", ") || "Any file type"} · Up to ${(maxSize / 1024 / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} MB per file`;
  return (
    <div
      className={`dz-root ${className}`}
      style={{ width: "100%", maxWidth: 520 }}
    >
      <style>{`.dz-drop{display:grid;place-items:center;width:100%;padding:35px 18px;margin:12px 0;background:transparent;color:var(--st-fg);border:1px dashed var(--st-line);border-radius:10px;gap:9px;transition:background .2s,border .2s}.dz-drop[data-drag=true]{border-color:var(--st-accent);background:var(--st-soft)}.dz-documents{position:relative;display:block;width:70px;height:46px}.dz-documents i{position:absolute;left:23px;top:2px;width:25px;height:35px;border:1px solid var(--st-line);border-radius:4px;background:var(--st-bg);box-shadow:0 2px 4px #0001;transition:transform .2s}.dz-documents i:first-child{transform:rotate(-15deg) translate(-13px,5px)}.dz-documents i:last-child{transform:rotate(15deg) translate(13px,5px)}.dz-drop[data-drag=true] i:first-child{transform:rotate(-25deg) translate(-20px,3px)}.dz-drop[data-drag=true] i:last-child{transform:rotate(25deg) translate(20px,3px)}.dz-name{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.dz-row{padding:10px 0}.dz-row .st-row{padding:0;border:0}.dz-row .st-meter{margin-top:9px}.dz-row .st-btn{padding:5px 8px}.dz-row .st-row-title{min-width:0}.dz-row .st-grow{overflow:hidden}@media(prefers-reduced-motion:reduce){.dz-documents i,.dz-drop{transition:none}}`}</style>
      <UI.Panel title="Upload files">
        <input
          ref={input}
          type="file"
          multiple
          accept={accept?.join(",")}
          aria-label="Choose files"
          style={{ display: "none" }}
          onChange={(event) => {
            if (event.target.files) add(Array.from(event.target.files));
            event.target.value = "";
          }}
        />
        <button
          type="button"
          className="dz-drop"
          data-drag={drag}
          aria-describedby={`${id}-hint`}
          onClick={() => input.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault();
            dragDepth.current++;
            setDrag(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            dragDepth.current = Math.max(0, dragDepth.current - 1);
            if (!dragDepth.current) setDrag(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            dragDepth.current = 0;
            setDrag(false);
            add(Array.from(event.dataTransfer.files));
          }}
        >
          <span className="dz-documents" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <strong>{drag ? "Drop to add files" : "Drop your files here"}</strong>
          <small>or click to browse</small>
        </button>
        <small id={`${id}-hint`}>{help}</small>
        {!onUpload && <small>Demo upload · Files stay in your browser</small>}
        <div aria-label="Files">
          {items.map((item) => (
            <div className="dz-row" key={item.id}>
              <UI.Row
                title={
                  <span className="dz-name" title={item.name}>
                    {item.name}
                  </span>
                }
                detail={`${(item.size / 1024).toFixed(1)} KB · ${item.status === "error" ? item.error : item.status === "done" ? "Done" : `${Math.round(item.progress * 100)}%`}`}
                icon={
                  <UI.Badge
                    tone={
                      item.status === "error"
                        ? "red"
                        : item.status === "done"
                          ? "green"
                          : "blue"
                    }
                  >
                    {item.name.includes(".")
                      ? item.name.split(".").at(-1)?.toUpperCase().slice(0, 5)
                      : "FILE"}
                  </UI.Badge>
                }
              >
                {item.status === "error" &&
                  item.file &&
                  !validate(item.file) && (
                    <UI.Button
                      aria-label={`Retry ${item.name}`}
                      onClick={() => upload(item)}
                    >
                      Retry
                    </UI.Button>
                  )}
                <UI.Button
                  aria-label={`Remove ${item.name}`}
                  onClick={() => remove(item)}
                >
                  ×
                </UI.Button>
              </UI.Row>
              <UI.Meter
                label={`Upload ${item.name}`}
                value={item.progress * 100}
                color={
                  item.status === "error"
                    ? "var(--st-red)"
                    : item.status === "done"
                      ? "var(--st-green)"
                      : undefined
                }
              />
            </div>
          ))}
        </div>
        <span role="status" className="st-status">
          {announcement}
        </span>
      </UI.Panel>
    </div>
  );
}
export default Demo;
export function Demo() {
  return <Dropzone accept={[".pdf", ".png", ".jpg", ".xlsx"]} autoplay />;
}
