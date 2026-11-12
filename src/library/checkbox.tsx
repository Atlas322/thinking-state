/*
MIT License

Copyright (c) 2026 Florian Höller (adfects)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
"use client";

import {
  useEffect,
  useId,
  useRef,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";

/*
 * Checkbox – a single self-contained file, clean style.
 * A real checkbox with a label and a quiet second line, a third "some of them" state, an error, and a card variant
 * where the whole row is the target. The box fills and its check draws itself. Focus shows a ring only from the
 * keyboard. The styles are injected below, so no extra files are needed.
 */

export type CheckboxProps = Omit<
  ComponentPropsWithRef<"input">,
  "type" | "size"
> & {
  /** Shown next to the box; clicking it toggles */
  label?: ReactNode;
  /** A quiet second line under the label */
  description?: ReactNode;
  /** "Some of them" – a dash instead of the check, e.g. for Select all */
  indeterminate?: boolean;
  /** Marks it invalid and shows this under it */
  error?: ReactNode;
  /** plain: the box and its text · card: a bordered row that is clickable as a whole and lights up when checked */
  variant?: "plain" | "card";
};

export function Checkbox({
  label,
  description,
  indeterminate = false,
  error,
  variant = "plain",
  className,
  id,
  disabled,
  ref,
  "aria-describedby": describedBy,
  ...rest
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? `${autoId}-input`;
  const descId = `${autoId}-desc`;
  const errorId = `${autoId}-error`;
  const input = useRef<HTMLInputElement | null>(null);
  const showsError =
    error != null && typeof error !== "boolean" && error !== "";

  // Indeterminate is a property, not an attribute
  useEffect(() => {
    if (input.current) input.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div
      className={["ui-chkc", className].filter(Boolean).join(" ")}
      data-variant={variant === "card" ? "card" : "plain"}
      data-invalid={error ? true : undefined}
      data-disabled={disabled || undefined}
    >
      {/* React 19 hoists this into <head> once, no matter how many checkboxes render */}
      <style href="ui-checkbox-clean" precedence="default">
        {css}
      </style>
      <label className="ui-chkc__row" htmlFor={inputId}>
        <span className="ui-chkc__control">
          <input
            {...rest}
            ref={(el) => {
              input.current = el;
              if (el) el.indeterminate = indeterminate;
              if (typeof ref === "function") ref(el);
              else if (ref) ref.current = el;
            }}
            id={inputId}
            type="checkbox"
            className="ui-chkc__input"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={
              [
                describedBy,
                description ? descId : null,
                showsError ? errorId : null,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            data-indeterminate={indeterminate || undefined}
          />
          <span className="ui-chkc__box" aria-hidden="true">
            <svg
              className="ui-chkc__mark"
              viewBox="0 0 16 16"
              width="16"
              height="16"
            >
              <path
                className="ui-chkc__tick"
                d="M4 8.5 6.75 11.25 12 5"
                pathLength={1}
              />
              <path className="ui-chkc__dash" d="M4.5 8h7" pathLength={1} />
            </svg>
          </span>
        </span>
        {(label != null || description != null) && (
          <span className="ui-chkc__text">
            {label != null && <span className="ui-chkc__label">{label}</span>}
            {description != null && (
              <span className="ui-chkc__desc" id={descId}>
                {description}
              </span>
            )}
          </span>
        )}
      </label>
      {showsError && (
        <p className="ui-chkc__error" id={errorId} aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

const css = /* css */ `
/* Colors and motion as variables – override them on .ui-chkc (see Theming in the docs) */
.ui-chkc {
  --ui-chkc-ink: rgba(0, 0, 0, 0.88);
  --ui-chkc-subtle: rgba(0, 0, 0, 0.6);
  --ui-chkc-surface: #ffffff;
  --ui-chkc-edge: rgba(0, 0, 0, 0.18);
  --ui-chkc-edge-hover: rgba(0, 0, 0, 0.32);
  --ui-chkc-fill: rgba(0, 0, 0, 0.88);
  --ui-chkc-on-fill: #ffffff;
  --ui-chkc-card-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 1px 1px -1px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-chkc-card-shadow-hover: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 4px 12px -6px rgba(0, 0, 0, 0.09), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-chkc-card-shadow-on: 0 0 0 0.5px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ui-chkc-card-wash: rgba(0, 0, 0, 0.025);
  --ui-chkc-danger: #c62828;
  --ui-chkc-focus: rgba(0, 96, 226, 0.7);
  --ui-chkc-ease: cubic-bezier(0.22, 1, 0.36, 1);

  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  font-family: "Inter", "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  line-height: 20px;
  color: var(--ui-chkc-ink);
  -webkit-font-smoothing: antialiased;
}

.ui-chkc__row { display: flex; align-items: flex-start; gap: 10px; min-width: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.ui-chkc[data-disabled] .ui-chkc__row { cursor: not-allowed; opacity: 0.5; }

/* The box sits on the first line of the label, centered on it */
.ui-chkc__control { position: relative; display: grid; flex: none; place-items: center; width: 16px; height: 20px; }
/* The real input covers the box (and a bit more, for touch) – invisible, but it takes the clicks and the focus */
.ui-chkc__input { position: absolute; inset: -6px; width: calc(100% + 12px); height: calc(100% + 12px); margin: 0; opacity: 0; cursor: inherit; }
.ui-chkc__box {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  box-sizing: border-box;
  border-radius: 4.5px;
  background: var(--ui-chkc-surface);
  box-shadow: inset 0 0 0 1px var(--ui-chkc-edge), 0 1px 1px rgba(0, 0, 0, 0.04);
  color: var(--ui-chkc-on-fill);
  pointer-events: none;
  transition: background-color 160ms ease, box-shadow 160ms ease, transform 160ms var(--ui-chkc-ease);
}
.ui-chkc__row:hover .ui-chkc__input:not(:checked):not(:indeterminate):not(:disabled) + .ui-chkc__box { box-shadow: inset 0 0 0 1px var(--ui-chkc-edge-hover), 0 1px 1px rgba(0, 0, 0, 0.04); }
.ui-chkc__input:active:not(:disabled) + .ui-chkc__box { transform: scale(0.9); }
.ui-chkc__input:is(:checked, :indeterminate) + .ui-chkc__box { background: var(--ui-chkc-fill); box-shadow: none; }
.ui-chkc__input:focus-visible + .ui-chkc__box { outline: 2px solid var(--ui-chkc-focus); outline-offset: 2px; }
.ui-chkc[data-invalid] .ui-chkc__input:not(:checked) + .ui-chkc__box { box-shadow: inset 0 0 0 1px var(--ui-chkc-danger); }

/* The check draws itself; the dash grows from the middle */
.ui-chkc__mark { display: block; width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.ui-chkc__tick, .ui-chkc__dash { stroke-dasharray: 1; stroke-dashoffset: 1; }
.ui-chkc__input:checked:not(:indeterminate) + .ui-chkc__box .ui-chkc__tick { stroke-dashoffset: 0; transition: stroke-dashoffset 260ms 40ms var(--ui-chkc-ease); }
.ui-chkc__input:indeterminate + .ui-chkc__box .ui-chkc__dash { stroke-dashoffset: 0; transition: stroke-dashoffset 200ms var(--ui-chkc-ease); }

.ui-chkc__text { display: grid; min-width: 0; }
.ui-chkc__label { color: var(--ui-chkc-ink); overflow-wrap: anywhere; }
.ui-chkc__desc { font-size: 12px; line-height: 16px; color: var(--ui-chkc-subtle); overflow-wrap: anywhere; }
.ui-chkc__error { margin: 0 0 0 26px; font-size: 12px; line-height: 16px; color: var(--ui-chkc-danger); overflow-wrap: anywhere; animation: ui-chkc-message 260ms var(--ui-chkc-ease); }

/* Card: a bordered row, clickable as a whole – a soft shadow on hover; checked, it takes a faint gray fill (no dark edge) */
.ui-chkc[data-variant="card"] .ui-chkc__row {
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--ui-chkc-surface);
  box-shadow: var(--ui-chkc-card-shadow);
  transition: box-shadow 200ms ease, background-color 200ms ease;
}
.ui-chkc[data-variant="card"]:not([data-disabled]) .ui-chkc__row:hover { box-shadow: var(--ui-chkc-card-shadow-hover); }
.ui-chkc[data-variant="card"] .ui-chkc__row:has(.ui-chkc__input:checked) { background: var(--ui-chkc-card-wash); box-shadow: var(--ui-chkc-card-shadow-on); }
.ui-chkc[data-variant="card"]:not([data-disabled]) .ui-chkc__row:has(.ui-chkc__input:checked):hover { box-shadow: var(--ui-chkc-card-shadow-hover); }
.ui-chkc[data-variant="card"] .ui-chkc__label { font-weight: 500; }
.ui-chkc[data-variant="card"] .ui-chkc__error { margin-left: 2px; }

/* Touch screens: 16px text and a bigger box */
@media (pointer: coarse) {
  .ui-chkc { font-size: 15px; line-height: 22px; }
  .ui-chkc__control { width: 20px; height: 22px; }
  .ui-chkc__box { width: 20px; height: 20px; border-radius: 5.5px; }
  .ui-chkc__mark { width: 18px; height: 18px; }
}

@keyframes ui-chkc-message {
  from { opacity: 0; transform: translateY(-3px); filter: blur(2px); }
}

@media (prefers-reduced-motion: reduce) {
  .ui-chkc *, .ui-chkc__row { transition-duration: 1ms !important; animation-duration: 1ms !important; }
}

/* Dark mode: follows a .dark class or data-theme="dark" on any ancestor, e.g. <html> */
:where(.dark, [data-theme="dark"]) .ui-chkc {
  --ui-chkc-ink: rgba(255, 255, 255, 0.9);
  --ui-chkc-subtle: rgba(255, 255, 255, 0.46);
  --ui-chkc-surface: #1c1c1e;
  --ui-chkc-edge: rgba(255, 255, 255, 0.22);
  --ui-chkc-edge-hover: rgba(255, 255, 255, 0.36);
  --ui-chkc-fill: rgba(255, 255, 255, 0.9);
  --ui-chkc-on-fill: #161618;
  --ui-chkc-card-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.14), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --ui-chkc-card-shadow-hover: 0 0 0 0.5px rgba(255, 255, 255, 0.16), 0 6px 14px -6px rgba(0, 0, 0, 0.45);
  --ui-chkc-card-shadow-on: 0 0 0 0.5px rgba(255, 255, 255, 0.18), 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --ui-chkc-card-wash: rgba(255, 255, 255, 0.045);
  --ui-chkc-danger: #ff6369;
  --ui-chkc-focus: rgba(77, 141, 255, 0.8);
}
`;

import * as React from "react";

/** Working example; use the named Checkbox export in your application. */
export default function Demo() {
  const [picked, setPicked] = React.useState(["mentions"]);
  const [agreed, setAgreed] = React.useState(false);
  const all = ["mentions", "approvals", "summary"];
  return (
    <div className="checkbox-example">
      <style>{`.checkbox-example{width:362px;max-width:100%;padding:20px;border:1px solid #e9e9e9;background:white;border-radius:12px;color:#222;font:13px/1.5 Inter,system-ui,sans-serif}.checkbox-example fieldset{padding:0;margin:0 0 20px;border:0}.checkbox-example legend{padding:0;margin-bottom:12px}.checkbox-example .checkbox-nested{display:grid;gap:12px;margin:14px 0 0 26px}.checkbox-example>div:last-child{margin-top:18px}:where(.dark,[data-theme=dark]) .checkbox-example{background:#131315;border-color:#29292b;color:#eee}`}</style>
      <fieldset>
        <legend>Имэйлээр мэдэгдэх</legend>
        <Checkbox
          label="Бүгд"
          value="1"
          checked={picked.length === 3}
          indeterminate={picked.length > 0 && picked.length < 3}
          onChange={() => setPicked(picked.length === 3 ? [] : all)}
        />
        <div className="checkbox-nested">
          {[
            {
              id: "mentions",
              label: "Нэр дурдсан",
              description: "Хэн нэгэн таныг чат эсвэл файлд дурдвал",
            },
            {
              id: "approvals",
              label: "Батлах хүсэлт",
              description: "Агент ажиллахаас өмнө таны зөвшөөрлийг хүлээнэ",
            },
            { id: "summary", label: "Долоо хоногийн хураангуй" },
          ].map((item) => (
            <Checkbox
              key={item.id}
              value="1"
              label={item.label}
              description={item.description}
              checked={picked.includes(item.id)}
              onChange={(event) =>
                setPicked((current) =>
                  event.target.checked
                    ? [...current, item.id]
                    : current.filter((id) => id !== item.id),
                )
              }
            />
          ))}
        </div>
      </fieldset>
      <Checkbox
        label="Ажил бүрийн хуулбарыг хадгалах"
        value="1"
        description="Оролт, гаралт 30 хоног хадгалагдана, ажлыг дахин тоглуулж болно."
        variant="card"
        defaultChecked
      />
      <div>
        <Checkbox
          label="Үйлчилгээний нөхцөлийг зөвшөөрч байна"
          value="1"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          error={agreed ? undefined : "Үргэлжлүүлэхийн тулд нөхцөлийг зөвшөөрнө үү."}
        />
      </div>
    </div>
  );
}
