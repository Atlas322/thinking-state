import * as React from "react";
import { createPortal } from "react-dom";
import { actorOf, raciOf, type Company, type CompanyPerson } from "./types";
import { Avatar, initials } from "./ui";
import { Empty } from "./collection";

/**
 * RACI — one matrix per company: rows are people and agents, columns are
 * projects, cells show R / A / C / I. A person's row opens their profile.
 * Person profile — about, career timeline, public links, the projects they
 * are Responsible or Accountable for, and the agents they work with.
 * Read-only.
 */

const LETTER: Record<"R" | "A" | "C" | "I", string> = { R: "Гүйцэтгэгч", A: "Хариуцагч", C: "Зөвлөх", I: "Мэдээлэгдэх" };

export function RaciView({ c, scoped, onPerson, empty }: { c: Company; scoped: Company; onPerson: (id: string) => void; empty: string }) {
  const projects = scoped.projects;
  const ids = new Set<string>();
  for (const p of projects) {
    const r = p.raci;
    if (!r) continue;
    [...(r.responsible ?? []), r.accountable, ...(r.consulted ?? []), ...(r.informed ?? [])].forEach((id) => id && ids.add(id));
  }
  if (!ids.size) return <Empty text={empty} icon="grid-3x3" />;
  const actors = [...ids]
    .map((id) => actorOf(c, id))
    .sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "person" ? -1 : 1));
  return (
    <div className="cv-raci">
      <div className="cv-raci-scroll" tabIndex={0} role="region" aria-label="RACI">
        <table className="cv-raci-table">
          <thead>
            <tr>
              <th scope="col" className="cv-raci-corner">
                Хүн / агент
              </th>
              {projects.map((p) => (
                <th key={p.id} scope="col" className={p.raci ? "" : "is-none"}>
                  <span>{p.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {actors.map((a, i) => (
              <tr key={a.id} style={{ "--i": i } as React.CSSProperties}>
                <th scope="row">
                  {a.kind === "person" ? (
                    <button type="button" className="cv-raci-who" onClick={() => onPerson(a.id)}>
                      <Avatar actor={a} size={24} />
                      <span>
                        <strong>{a.name}</strong>
                        <small>{a.role}</small>
                      </span>
                    </button>
                  ) : (
                    <span className="cv-raci-who is-agent">
                      <Avatar actor={a} size={24} />
                      <span>
                        <strong>{a.name}</strong>
                        <small>{a.role || "агент"}</small>
                      </span>
                    </span>
                  )}
                </th>
                {projects.map((p) => {
                  const roles = raciOf(p, a.id);
                  return (
                    <td key={p.id} title={roles.map((r) => LETTER[r]).join(", ") || undefined}>
                      {roles.length ? (
                        <span className="cv-raci-cell">
                          {roles.map((r) => (
                            <span key={r} className={`cv-raci-l is-${r}`}>
                              {r}
                            </span>
                          ))}
                          <span className="cv-sr">{roles.map((r) => LETTER[r]).join(", ")}</span>
                        </span>
                      ) : (
                        <span className="cv-raci-dot" aria-hidden="true" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="cv-legend">
        {(["R", "A", "C", "I"] as const).map((r) => (
          <span key={r}>
            <span className={`cv-raci-l is-${r}`}>{r}</span> {LETTER[r]}
          </span>
        ))}
        {projects.some((p) => !p.raci) && <span className="cv-raci-note">Саарал багана = RACI бүртгэгдээгүй төсөл</span>}
      </p>
    </div>
  );
}

export function PersonProfile({ c, person, onClose, themeClass = "" }: { c: Company; person: CompanyPerson; onClose: () => void; themeClass?: string }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      back?.focus?.();
    };
  }, [onClose]);
  const unit = c.units.find((u) => u.id === person.unitId);
  const responsible = c.projects
    .map((p) => ({ p, roles: raciOf(p, person.id) }))
    .filter((x) => x.roles.includes("R") || x.roles.includes("A"));
  const owned = c.agents.filter((a) => a.ownerId === person.id);
  const coworkers = c.agents.filter(
    (a) => a.ownerId !== person.id && c.workflows.some((w) => w.steps.some((s) => s.actorId === person.id) && w.steps.some((s) => s.actorId === a.id)),
  );
  const agents = [...owned.map((a) => ({ a, how: "эзэмшдэг" })), ...coworkers.map((a) => ({ a, how: "workflow-д хамт" }))];
  const sheet = (
    <div className="cv-sheet-wrap" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="cv-sheet" role="dialog" aria-modal="true" aria-labelledby="cv-profile-name">
        <header className="cv-sheet-head">
          <span className="cv-sheet-ava" aria-hidden="true">
            {initials(person.name)}
          </span>
          <div className="cv-sheet-id">
            <h3 id="cv-profile-name">{person.name}</h3>
            <p>
              {person.role}
              {unit ? ` · ${unit.name}` : ""}
            </p>
          </div>
          <button ref={closeRef} type="button" className="cv-sheet-close" onClick={onClose} aria-label="Профайл хаах">
            ×
          </button>
        </header>
        <div className="cv-sheet-body">
          <section>
            <h4>Тухай</h4>
            {person.about ? <p className="cv-about">{person.about}</p> : <p className="cv-none">Тухай мэдээлэл бүртгэгдээгүй.</p>}
          </section>
          <section>
            <h4>Карьер</h4>
            {person.cv?.length ? (
              <ol className="cv-cv">
                {person.cv.map((e, i) => (
                  <li key={e.period + e.title + i} style={{ "--i": i } as React.CSSProperties}>
                    <span className="cv-cv-period">{e.period}</span>
                    <span className="cv-cv-title">{e.title}</span>
                    {e.org && <span className="cv-cv-org">{e.org}</span>}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="cv-none">CV бүртгэгдээгүй.</p>
            )}
          </section>
          <section>
            <h4>Холбоос</h4>
            {person.links?.length ? (
              <ul className="cv-links">
                {person.links.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noreferrer noopener">
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cv-none">Нийтийн холбоос алга.</p>
            )}
          </section>
          <section>
            <h4>Хариуцсан төсөл</h4>
            {responsible.length ? (
              <ul className="cv-resp">
                {responsible.map(({ p, roles }) => (
                  <li key={p.id}>
                    <span>{p.name}</span>
                    <span className="cv-raci-cell">
                      {roles.map((r) => (
                        <span key={r} className={`cv-raci-l is-${r}`} title={LETTER[r]}>
                          {r}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cv-none">R эсвэл A үүрэгтэй төсөл алга.</p>
            )}
          </section>
          <section>
            <h4>Хамтран ажилладаг агент</h4>
            {agents.length ? (
              <ul className="cv-resp">
                {agents.map(({ a, how }) => (
                  <li key={a.id}>
                    <span className="cv-resp-agent">
                      <Avatar actor={{ name: a.name, kind: "agent" }} size={22} />
                      {a.name}
                    </span>
                    <small>{how}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cv-none">Холбоотой агент алга.</p>
            )}
          </section>
        </div>
      </section>
    </div>
  );
  // A portal escapes the size container (which would trap position:fixed);
  // the .cv wrapper keeps the tokens, and dark mode still comes from <html>.
  if (typeof document === "undefined") return sheet;
  return createPortal(<div className={`cv cv-layer ${themeClass}`}>{sheet}</div>, document.body);
}

export const raciCss = `
.cv-raci{display:flex;flex-direction:column;gap:10px}
.cv-raci-scroll{max-width:100%;overflow-x:auto;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg)}
.cv-raci-table{width:100%;border-collapse:separate;border-spacing:0;font-size:13px}
.cv-raci-table th,.cv-raci-table td{padding:8px 10px;border-bottom:1px solid var(--cv-line);text-align:center;vertical-align:middle}
.cv-raci-table tbody tr:last-child>*{border-bottom:0}
.cv-raci-table thead th{position:sticky;top:0;background:var(--cv-bg);font-size:12px;font-weight:600;color:var(--cv-muted);white-space:nowrap}
.cv-raci-table thead th span{display:inline-block;max-width:150px;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom}
.cv-raci-table thead th.is-none{color:var(--cv-faint);font-weight:400}
.cv-raci-table th[scope=row],.cv-raci-corner{position:sticky;left:0;z-index:1;background:var(--cv-bg);text-align:left;border-right:1px solid var(--cv-line)}
.cv-raci-corner{z-index:2}
.cv-raci-table tbody tr{animation:cv-in .3s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 35ms)}
.cv-raci-who{display:flex;align-items:center;gap:8px;min-width:150px;max-width:220px;padding:2px 4px;border:0;border-radius:7px;background:none;text-align:left}
button.cv-raci-who:hover{background:var(--cv-soft)}
.cv-raci-who>span:last-child{display:flex;flex-direction:column;min-width:0}
.cv-raci-who strong{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-raci-who small{font-size:11.5px;color:var(--cv-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-raci-cell{display:inline-flex;gap:3px}
.cv-raci-l{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:6px;font-size:12px;font-weight:700}
.cv-raci-l.is-R{background:var(--cv-accent-soft);color:color-mix(in srgb,var(--cv-accent) 75%,var(--cv-fg))}
.cv-raci-l.is-A{background:var(--cv-fg);color:var(--cv-bg)}
.cv-raci-l.is-C{background:var(--cv-teal-soft);color:color-mix(in srgb,var(--cv-teal) 75%,var(--cv-fg))}
.cv-raci-l.is-I{background:var(--cv-soft);color:var(--cv-muted)}
.cv-raci-dot{display:inline-block;width:4px;height:4px;border-radius:50%;background:var(--cv-line)}
.cv-raci-note{color:var(--cv-faint)}
.cv-none{margin:0;color:var(--cv-faint);font-size:13px}
.cv-layer{position:static;width:0;height:0}
.cv-sheet-wrap{position:fixed;inset:0;z-index:50;display:flex;justify-content:flex-end;background:#0000002e;animation:cv-fade .18s ease both}
.cv-sheet{display:flex;flex-direction:column;width:min(440px,100%);height:100%;background:var(--cv-bg);color:var(--cv-fg);border-left:1px solid var(--cv-line);box-shadow:-12px 0 40px #00000024;animation:cv-slide .28s cubic-bezier(.2,.8,.3,1) both;overflow:hidden}
.cv-sheet-head{display:flex;align-items:center;gap:12px;padding:18px 18px 14px;border-bottom:1px solid var(--cv-line)}
.cv-sheet-ava{display:grid;place-items:center;flex:none;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--cv-accent),var(--cv-violet));color:#fff;font-size:17px;font-weight:700}
.cv-sheet-id{flex:1;min-width:0}
.cv-sheet-id h3{margin:0;font-size:18px;font-weight:650;letter-spacing:-.01em}
.cv-sheet-id p{margin:2px 0 0;font-size:13px;color:var(--cv-muted)}
.cv-sheet-close{flex:none;width:32px;height:32px;border:0;border-radius:8px;background:var(--cv-soft);font-size:18px;line-height:1}
.cv-sheet-body{flex:1;overflow-y:auto;padding:16px 18px 24px;display:flex;flex-direction:column;gap:18px}
.cv-sheet-body h4{margin:0 0 8px;font-size:11.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--cv-muted)}
.cv-about{margin:0;font-size:14px;line-height:1.55}
.cv-cv{position:relative;margin:0;padding:0 0 0 18px;list-style:none;border-left:2px solid var(--cv-line)}
.cv-cv li{position:relative;display:flex;flex-direction:column;padding:0 0 12px;animation:cv-in .3s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 50ms + 80ms)}
.cv-cv li::before{content:"";position:absolute;left:-24px;top:4px;width:10px;height:10px;border-radius:50%;background:var(--cv-bg);border:2px solid var(--cv-accent)}
.cv-cv li:first-child::before{background:var(--cv-accent)}
.cv-cv-period{font-size:12px;color:var(--cv-muted);font-variant-numeric:tabular-nums}
.cv-cv-title{font-weight:600}
.cv-cv-org{font-size:13px;color:var(--cv-muted)}
.cv-links{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}
.cv-links a{display:inline-flex;align-items:center;height:28px;padding:0 10px;border:1px solid var(--cv-line);border-radius:14px;color:var(--cv-fg);font-size:13px;text-decoration:none}
.cv-links a:hover{background:var(--cv-soft)}
.cv-resp{display:flex;flex-direction:column;gap:4px;margin:0;padding:0;list-style:none}
.cv-resp li{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:7px 10px;border-radius:8px;background:var(--cv-soft);font-size:13.5px}
.cv-resp small{color:var(--cv-muted);font-size:12px}
.cv-resp-agent{display:inline-flex;align-items:center;gap:8px}
@keyframes cv-slide{from{transform:translateX(30px);opacity:0}}
@container cv (max-width:560px){.cv-raci-who{min-width:120px}.cv-raci-table th,.cv-raci-table td{padding:7px 8px}}
`;
