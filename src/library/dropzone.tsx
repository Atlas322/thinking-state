"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

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

type DemoFile = { file: File; size: number; failAt?: number; failWith?: string };

const MB = 1024 * 1024;
const fmtSize = (n: number) =>
  n >= MB ? `${(n / MB).toFixed(1)} MB` : n >= 1024 ? `${Math.round(n / 1024)} KB` : `${n} B`;

const typeColor = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "#e5484d";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "#6e56cf";
  if (["xlsx", "xls", "csv"].includes(ext)) return "#30a46c";
  if (["mp4", "mov", "webm", "mp3", "wav"].includes(ext)) return "#e5a000";
  if (["doc", "docx", "txt", "md"].includes(ext)) return "#3e63dd";
  return "#8b8d98";
};

function FileIcon({ name }: { name: string }) {
  const c = typeColor(name);
  return (
    <svg className="dz-ficon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 1.75h5.2L12.5 5v8.25a1 1 0 0 1-1 1h-7.5a1 1 0 0 1-1-1V2.75a1 1 0 0 1 1-1Z" fill="var(--dz-bg)" stroke="var(--dz-faint)" strokeWidth="1" />
      <path d="M9 1.9V5h3.3" fill="none" stroke="var(--dz-faint)" strokeWidth="1" />
      <rect x="3" y="9" width="7.5" height="3.6" rx="1" fill={c} />
    </svg>
  );
}

export function Dropzone({
  accept,
  maxSize = 25 * MB,
  onUpload,
  onChange,
  hint,
  autoplay = false,
  className = "",
}: DropzoneProps) {
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const itemsRef = React.useRef<UploadItem[]>([]);
  const [drag, setDrag] = React.useState(0);
  const [announcement, setAnnouncement] = React.useState("");
  const [shaking, setShaking] = React.useState<string | null>(null);
  const input = React.useRef<HTMLInputElement>(null);
  const attempts = React.useRef(new Map<string, symbol>());
  const simulations = React.useRef(new Map<string, number>());
  const demoFail = React.useRef(new Map<string, { at: number; msg: string }>());
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
    commit(itemsRef.current.map((item) => (item.id === itemId ? { ...item, ...changes } : item)));
  };
  const validate = (file: File, size = file.size) => {
    if (size > Math.max(0, maxSize)) return "Хэт том";
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
      return "Файлын төрөл зөвшөөрөгдөхгүй";
    return undefined;
  };
  const fail = (item: UploadItem, error: string) => {
    attempts.current.delete(item.id);
    patch(item.id, { status: "error", error });
    setShaking(item.id);
    window.setTimeout(() => mounted.current && setShaking(null), 450);
    setAnnouncement(`${item.name}: ${error}.`);
  };
  const upload = (item: UploadItem, simulate = false) => {
    if (!item.file) return;
    const token = Symbol(item.id);
    attempts.current.set(item.id, token);
    const valid = () => mounted.current && attempts.current.get(item.id) === token;
    patch(item.id, { status: "uploading", progress: 0, error: undefined });
    const progress = (value: number) => {
      if (valid() && Number.isFinite(value)) patch(item.id, { progress: Math.min(1, Math.max(0, value)) });
    };
    const done = () => {
      if (!valid()) return;
      attempts.current.delete(item.id);
      patch(item.id, { status: "done", progress: 1 });
      setAnnouncement(`${item.name} байршуулсан`);
    };
    if (onUpload && !simulate) {
      Promise.resolve()
        .then(() => onUpload(item.file!, progress))
        .then(done, (failure) => {
          if (!valid()) return;
          fail(item, failure instanceof Error ? failure.message : "Байршуулж чадсангүй");
        });
    } else {
      let value = 0;
      const planned = demoFail.current.get(item.id);
      const step = 0.06 + ((sequence.current * 7 + item.name.length) % 5) * 0.012;
      const timer = window.setInterval(() => {
        if (!valid()) {
          window.clearInterval(timer);
          simulations.current.delete(item.id);
          return;
        }
        value = Math.min(1, value + step);
        if (planned && value >= planned.at) {
          window.clearInterval(timer);
          simulations.current.delete(item.id);
          demoFail.current.delete(item.id);
          progress(planned.at);
          fail(item, planned.msg);
          return;
        }
        progress(value);
        if (value === 1) {
          window.clearInterval(timer);
          simulations.current.delete(item.id);
          done();
        }
      }, 120);
      simulations.current.set(item.id, timer);
    }
  };
  const add = (files: (File | DemoFile)[], simulate = false) => {
    const incoming: UploadItem[] = files.map((entry) => {
      const d = entry instanceof File ? { file: entry, size: entry.size } : entry;
      const error = validate(d.file, d.size);
      const itemId = `${id}-${++sequence.current}`;
      if (!(entry instanceof File) && entry.failAt !== undefined)
        demoFail.current.set(itemId, { at: entry.failAt, msg: entry.failWith ?? "Байршуулж чадсангүй" });
      return {
        id: itemId,
        name: d.file.name,
        size: d.size,
        file: d.file,
        progress: 0,
        status: error ? "error" : "uploading",
        error,
      };
    });
    commit([...itemsRef.current, ...incoming]);
    const rejected = incoming.filter((item) => item.error);
    if (rejected.length) setAnnouncement(rejected.map((item) => `${item.name}: ${item.error}`).join(". "));
    incoming.filter((item) => !item.error).forEach((item) => upload(item, simulate));
  };
  const addRef = React.useRef(add);
  addRef.current = add;
  React.useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(
      () =>
        addRef.current(
          [
            { file: new File(["Demo document"], "3-р-улирлын-тайлан.pdf", { type: "application/pdf" }), size: 4.2 * MB },
            { file: new File(["Demo image"], "Нүүр-зураг.png", { type: "image/png" }), size: 2.6 * MB },
            {
              file: new File(["Demo sheet"], "Төсөв-2027.xlsx", {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              }),
              size: 1.8 * MB,
              failAt: 0.62,
              failWith: "Холболт тасарсан",
            },
            { file: new File(["Demo video"], "Бүтээгдэхүүний-танилцуулга.mp4", { type: "video/mp4" }), size: 48 * MB },
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
    setAnnouncement(`${item.name} жагсаалтаас хасагдлаа.`);
  };
  const clear = () => {
    itemsRef.current.forEach((item) => {
      attempts.current.delete(item.id);
      const t = simulations.current.get(item.id);
      if (t !== undefined) window.clearInterval(t);
    });
    simulations.current.clear();
    commit([]);
    setAnnouncement("Жагсаалтыг цэвэрлэлээ.");
  };

  const limit = `${(maxSize / MB).toLocaleString(undefined, { maximumFractionDigits: 1 })} MB`;
  const types = accept?.length
    ? accept.map((a) => a.replace(/^\./, "").toUpperCase()).join(", ")
    : "PDF, PNG, JPG болон бусад";
  const help = hint ?? `${types} · тус бүр ${limit} хүртэл`;
  const done = items.filter((i) => i.status === "done").length;
  const busy = items.some((i) => i.status === "uploading");
  const failed = items.some((i) => i.status === "error");
  const errorText = (item: UploadItem) => (item.error === "Хэт том" ? `Хэт том – дээд тал нь ${limit}` : item.error);

  return (
    <div className={`dz ${className}`}>
      <style>{css}</style>
      <input
        ref={input}
        type="file"
        multiple
        accept={accept?.join(",")}
        aria-label="Файл сонгох"
        style={{ display: "none" }}
        onChange={(event) => {
          if (event.target.files) add(Array.from(event.target.files));
          event.target.value = "";
        }}
      />
      <button
        type="button"
        className="dz-drop"
        data-drag={drag > 0}
        aria-describedby={`${id}-hint`}
        onClick={() => input.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          dragDepth.current++;
          setDrag(event.dataTransfer?.items?.length || 1);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (!dragDepth.current) setDrag(0);
        }}
        onDrop={(event) => {
          event.preventDefault();
          dragDepth.current = 0;
          setDrag(0);
          add(Array.from(event.dataTransfer.files));
        }}
      >
        <span className="dz-docs" aria-hidden="true">
          <span className="dz-doc dz-doc-l">
            <i style={{ background: "#e5484d" }}>PDF</i>
          </span>
          <span className="dz-doc dz-doc-r">
            <i style={{ background: "#6e56cf" }}>PNG</i>
          </span>
          <span className="dz-doc dz-doc-c">
            <svg viewBox="0 0 16 16">
              <path d="M8 10.5V3.5M5 6.2 8 3.2l3 3M3.5 10v2a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
        <span className="dz-title">
          {drag > 0 ? (
            `Байршуулах ${drag} файлаа энд тавина уу`
          ) : (
            <>
              Файлаа энд чирж оруулах эсвэл <span className="dz-link">сонгох</span>
            </>
          )}
        </span>
        <span className="dz-hint" id={`${id}-hint`}>
          {help}
        </span>
      </button>

      {items.length > 0 && (
        <>
          <ul className="dz-list" aria-label="Файлууд">
            {items.map((item, i) => {
              const rejected = item.status === "error" && !!item.file && !!validate(item.file, item.size);
              const showBar = !rejected && item.status !== "done";
              return (
                <li
                  key={item.id}
                  className={`dz-row ${item.status === "error" ? "is-error" : ""} ${shaking === item.id ? "is-shake" : ""}`}
                  style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
                >
                  <FileIcon name={item.name} />
                  <div className="dz-main">
                    <div className="dz-name">
                      <span title={item.name}>{item.name}</span>
                      {item.status === "done" && (
                        <svg className="dz-ok" viewBox="0 0 16 16" aria-label="Байршуулсан">
                          <circle cx="8" cy="8" r="7" fill="currentColor" />
                          <path d="m5 8.2 2 2 4-4.4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className="dz-sub">
                      {item.status === "error"
                        ? errorText(item)
                        : item.status === "uploading"
                          ? `${fmtSize(item.size * item.progress)}/${fmtSize(item.size)} · ${Math.max(1, Math.round((1 - item.progress) * 6))} с үлдсэн`
                          : fmtSize(item.size)}
                    </div>
                    {!rejected && (
                      <div
                        className={`dz-bar ${showBar ? "" : "is-hidden"}`}
                        role="progressbar"
                        aria-label={`Байршуулалт: ${item.name}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(item.progress * 100)}
                      >
                        <span style={{ width: `${item.progress * 100}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="dz-acts">
                    {item.status === "error" && item.file && !rejected && (
                      <button type="button" aria-label={`Дахин оролдох: ${item.name}`} onClick={() => upload(item, !onUpload)}>
                        <svg viewBox="0 0 16 16">
                          <path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                    <button type="button" aria-label={`Хасах: ${item.name}`} onClick={() => remove(item)}>
                      <svg viewBox="0 0 16 16">
                        <path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="dz-foot">
            <span className={`dz-sum ${busy ? "is-busy" : ""}`}>
              {busy ? (
                <span className="dz-spin" aria-hidden="true" />
              ) : failed ? (
                <svg className="dz-warn" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.5" fill="currentColor" />
                  <path d="M8 4.8v3.7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="11" r=".9" fill="#fff" />
                </svg>
              ) : (
                <svg className="dz-ok" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" fill="currentColor" />
                  <path d="m5 8.2 2 2 4-4.4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              )}
              {busy ? `Байршуулж байна: ${done}/${items.length}` : `${done}/${items.length} байршуулсан`}
            </span>
            <button type="button" className="dz-clear" onClick={clear}>
              Цэвэрлэх
            </button>
          </div>
        </>
      )}
      <span role="status" className="dz-sr">
        {announcement}
      </span>
    </div>
  );
}

const css = `
.dz{--dz-bg:#fff;--dz-fg:#18181b;--dz-muted:#65656d;--dz-faint:#65656d;--dz-line:#ececef;--dz-dash:#d4d4d8;--dz-soft:#f7f7f8;--dz-blue:#2563eb;--dz-blue-wash:#eff6ff;--dz-red:#c62828;--dz-green:#30a46c;--dz-amber:#b45309;width:100%;max-width:522px;padding:8px;background:var(--dz-bg);color:var(--dz-fg);border:1px solid var(--dz-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.4 Inter,system-ui,sans-serif;box-sizing:border-box}
:where(.dark,[data-theme=dark]) .dz{--dz-bg:#1b1b1e;--dz-fg:#ececef;--dz-muted:#a1a1aa;--dz-faint:#9a9aa2;--dz-line:#2c2c31;--dz-dash:#3f3f46;--dz-soft:#232328;--dz-blue:#7aa2ff;--dz-blue-wash:#1b2540;--dz-red:#f87171;--dz-amber:#e5a000;color-scheme:dark}
.dz *{box-sizing:border-box}.dz button{font:inherit;color:inherit;cursor:pointer}
.dz-drop{display:flex;flex-direction:column;align-items:center;width:100%;padding:28px 16px 21px;border:1px dashed var(--dz-dash);border-radius:8px;background:none;transition:background .2s,border-color .2s}
.dz-drop:hover{background:var(--dz-soft)}
.dz-drop[data-drag=true]{border-color:var(--dz-blue);background:var(--dz-blue-wash)}
.dz-docs{position:relative;width:64px;height:40px;margin-bottom:10px}
.dz-doc{position:absolute;left:50%;top:2px;width:26px;height:34px;margin-left:-13px;border:1px solid var(--dz-line);border-radius:4px;background:var(--dz-bg);box-shadow:0 1px 3px #0000000f;transition:transform .3s cubic-bezier(.3,1.4,.5,1)}
.dz-doc i{position:absolute;left:3px;bottom:5px;padding:0 2px;border-radius:2px;font:600 5px/7px Inter,system-ui,sans-serif;font-style:normal;color:#fff;opacity:.85}
.dz-doc-l{transform:translateX(-14px) rotate(-12deg) scale(.92)}.dz-doc-r{transform:translateX(14px) rotate(12deg) scale(.92)}
.dz-doc-r i{left:auto;right:3px}
.dz-doc-c{display:grid;place-items:center;color:var(--dz-muted);z-index:1}.dz-doc-c svg{width:13px;height:13px}
.dz-drop[data-drag=true] .dz-doc-l{transform:translateX(-22px) rotate(-22deg)}
.dz-drop[data-drag=true] .dz-doc-r{transform:translateX(22px) rotate(22deg)}
.dz-drop[data-drag=true] .dz-doc-c{transform:translateY(-4px);color:var(--dz-blue)}
.dz-title{font-size:14px;color:var(--dz-fg)}.dz-link{color:var(--dz-blue)}
.dz-hint{margin-top:2px;font-size:12.5px;color:var(--dz-muted)}
.dz-list{list-style:none;margin:6px 0 0;padding:0}
.dz-row{display:flex;align-items:flex-start;gap:10px;padding:12px 8px 10px 8px;border-bottom:1px solid var(--dz-line);animation:dz-in .35s cubic-bezier(.2,.7,.2,1) both}
.dz-ficon{width:14px;height:14px;flex:none;margin-top:2px}
.dz-main{flex:1;min-width:0}
.dz-name{display:flex;align-items:center;gap:6px;min-width:0}.dz-name span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dz-ok{width:12px;height:12px;flex:none;color:var(--dz-green);animation:dz-pop .35s cubic-bezier(.3,1.6,.5,1) both}
.dz-sub{margin-top:1px;font-size:12.5px;color:var(--dz-muted);font-variant-numeric:tabular-nums}
.dz-row.is-error .dz-sub{color:var(--dz-red)}
.dz-bar{height:2px;margin-top:7px;border-radius:2px;background:var(--dz-line);overflow:hidden;transition:height .25s,margin .25s,opacity .25s}
.dz-bar span{display:block;height:100%;background:var(--dz-blue);transition:width .15s linear}
.dz-row.is-error .dz-bar span{background:var(--dz-red)}
.dz-bar.is-hidden{height:0;margin-top:0;opacity:0}
.dz-acts{display:flex;gap:2px;align-self:center}
.dz-acts button{display:grid;place-items:center;width:28px;height:28px;border:0;border-radius:6px;background:none;color:var(--dz-muted)}
.dz-acts button:hover{background:var(--dz-soft);color:var(--dz-fg)}.dz-acts svg{width:14px;height:14px}
.dz-row.is-shake{animation:dz-shake .4s both}
.dz-foot{display:flex;align-items:center;justify-content:space-between;padding:8px 0 0 8px}
.dz-sum{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;color:var(--dz-fg)}
.dz-sum.is-busy{background:linear-gradient(90deg,var(--dz-fg) 40%,var(--dz-faint) 50%,var(--dz-fg) 60%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:dz-shim 1.6s linear infinite}
.dz-warn{width:13px;height:13px;color:var(--dz-amber)}.dz-sum .dz-ok{width:13px;height:13px}
.dz-spin{width:12px;height:12px;border:1.5px solid var(--dz-line);border-top-color:var(--dz-blue);border-radius:50%;animation:dz-rot .8s linear infinite}
.dz-clear{height:30px;padding:0 10px;border:1px solid var(--dz-line);border-radius:7px;background:var(--dz-bg);box-shadow:0 1px 2px #00000008}
.dz-clear:hover{background:var(--dz-soft)}
.dz-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.dz :focus-visible{outline:2px solid var(--dz-blue);outline-offset:2px}
@keyframes dz-in{from{opacity:0;transform:translateY(-4px)}}
@keyframes dz-pop{from{transform:scale(0)}}
@keyframes dz-shake{20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}
@keyframes dz-shim{from{background-position:100% 0}to{background-position:-150% 0}}
@keyframes dz-rot{to{transform:rotate(360deg)}}
@media(max-width:480px){.dz-drop{padding:22px 12px 18px}.dz-hint{text-align:center}}
@media(prefers-reduced-motion:reduce){.dz *{animation:none!important;transition:none!important}}
`;

export default Demo;
export function Demo() {
  return <Dropzone autoplay />;
}
