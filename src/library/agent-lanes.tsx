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

export function AgentLanes({
  title = "Agent room",
  items = [
    {
      id: "research",
      title: "Researcher",
      detail: "Compare competitors",
      status: "done",
      value: 34,
    },
    {
      id: "writer",
      title: "Writer",
      detail: "Draft launch copy",
      status: "running",
      value: 63,
    },
    {
      id: "coder",
      title: "Coder",
      detail: "Deploy preview",
      status: "waiting",
      value: 82,
    },
  ],
  onAction,
  className,
}: StudioProps) {
  const [approved, setApproved] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<StudioItem>();
  return (
    <UI.Panel
      title={title}
      subtitle="Every agent, on one timeline"
      className={className}
    >
      <div className="st-row">
        <small style={{ width: 100 }}>AGENT</small>
        <div
          className="st-grow"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {["0:00", "0:30", "1:00", "Now"].map((v) => (
            <small key={v}>{v}</small>
          ))}
        </div>
      </div>
      {items.map((x, i) => (
        <div key={x.id} className="st-row">
          <span style={{ width: 100 }}>
            <strong>{x.title}</strong>
            <small>{approved.includes(x.id) ? "running" : x.status}</small>
          </span>
          <div
            className="st-grow"
            style={{
              height: 42,
              position: "relative",
              borderRight: "1px dashed var(--st-accent)",
            }}
          >
            <button
              type="button"
              className="st-tile"
              style={{
                position: "absolute",
                left: `${i * 10}%`,
                width: `${Math.max(20, (x.value ?? 50) - i * 10)}%`,
                padding: "8px",
                fontSize: 10,
                background:
                  "color-mix(in srgb,var(--st-accent) 10%,var(--st-bg))",
              }}
              onClick={() => {
                setSelected(x);
                onAction?.("open", x);
              }}
            >
              {x.detail}
            </button>
          </div>
        </div>
      ))}
      {selected && (
        <div className="st-tile" style={{ marginTop: 12 }}>
          <strong>
            {selected.title} · {selected.detail}
          </strong>
          {selected.status === "waiting" && !approved.includes(selected.id) ? (
            <div className="st-actions">
              <UI.Button
                primary
                onClick={() => {
                  setApproved((s) => [...s, selected.id]);
                  onAction?.("approve", selected);
                }}
              >
                Approve step
              </UI.Button>
              <UI.Button
                onClick={() => {
                  onAction?.("reject", selected);
                  setSelected(undefined);
                }}
              >
                Reject
              </UI.Button>
            </div>
          ) : (
            <p className="st-status">
              {approved.includes(selected.id) ? "Approved" : selected.status}
            </p>
          )}
        </div>
      )}
    </UI.Panel>
  );
}

export default AgentLanes;
