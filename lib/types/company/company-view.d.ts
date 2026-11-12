import * as React from "react";
import { type Company, type CompanyLevel, type Methodology, type UnitKind } from "./types";
import { CollectionView } from "./collection";
/**
 * Company View — draws any company in the Company contract: business model,
 * process (unit tree), people ↔ agents, workflows, projects and decisions.
 * Zoom by level (institution / company / team): the view then shows only the
 * chosen unit's subtree. Read-only: it views a vault, it never writes.
 * The template is the organisation's own method (BMC, PMBOK, OKR, Lean
 * Canvas); the layout is one of two shells over the same data:
 *  - "workspace": the Second Brain OS app shell (unit tree on the side,
 *    breadcrumb header, tabs), after the 2026 Figma draft
 *  - "brief": one scrolling page with numbered sections, for reading
 * Projects reuse Session Board and Project Report; decisions reuse
 * Decision Inbox · Chat. Light and dark; motion off under reduced motion.
 */
export type CompanyLayout = "workspace" | "brief";
export type CompanyViewKey = "method" | "dashboard" | "structure" | "agents" | "workflows" | "raci" | "decisions";
export declare const COMPANY_VIEWS: CompanyViewKey[];
export type CompanyViewLabels = Record<CompanyViewKey | CompanyLevel | UnitKind | "model", string> & {
    customers: string;
    value: string;
    channels: string;
    revenue: string;
    units: string;
    people: string;
    agents_n: string;
    workflows_n: string;
    projects_n: string;
    level: string;
    views: string;
    layout: string;
    methodology: string;
    workspace: string;
    brief: string;
    noOwner: string;
    ownedBy: string;
    memory: string;
    trigger: string;
    approval: string;
    sequence: string;
    allProjects: string;
    empty: string;
    person: string;
    agent: string;
    types: string;
    source: Record<string, string>;
    segment: Record<string, string>;
};
export declare const companyLabelsMn: CompanyViewLabels;
export type CompanyViewProps = {
    company: Company;
    /** Shell: app workspace or one scrolling brief. */
    layout?: CompanyLayout;
    defaultLayout?: CompanyLayout;
    onLayoutChange?: (l: CompanyLayout) => void;
    showLayoutSwitch?: boolean;
    /** Template = the organisation's method; defaults to company.methodology, then BMC. */
    methodology?: Methodology;
    onMethodologyChange?: (m: Methodology) => void;
    showMethodologySwitch?: boolean;
    /** "Today" for due-date filters and the Gantt marker. */
    today?: Date;
    /** Workspace layout: hide the unit tree and «Төрлүүд» when the host app has its own menu (level switch and unit chips move into the header). */
    showTree?: boolean;
    /** Controlled vault type to show (a collection's `type`); null shows the tabs. */
    collection?: string | null;
    onCollectionChange?: (type: string | null) => void;
    defaultLevel?: CompanyLevel;
    /** Unit to open first; its kind decides the level. */
    defaultUnitId?: string;
    defaultView?: CompanyViewKey;
    onScopeChange?: (scope: {
        level: CompanyLevel;
        unitId: string | null;
    }) => void;
    labels?: Partial<CompanyViewLabels>;
    className?: string;
};
export declare function CompanyView({ company, layout: layoutProp, defaultLayout, onLayoutChange, showLayoutSwitch, methodology: methodologyProp, onMethodologyChange, showMethodologySwitch, today, showTree, collection: collectionProp, onCollectionChange, defaultLevel, defaultUnitId, defaultView, onScopeChange, labels: labelsProp, className, }: CompanyViewProps): React.JSX.Element;
export default CompanyView;
/** The Collection view on its own (catalog, inai.sh pages): tokens + styles included. */
export declare function CollectionPanel({ className, ...props }: React.ComponentProps<typeof CollectionView> & {
    className?: string;
}): React.JSX.Element;
