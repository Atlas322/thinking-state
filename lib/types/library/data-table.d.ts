import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type TagTone = "blue" | "violet" | "pink" | "green" | "amber" | "gray";
export type DataColumn = {
    key: string;
    label: string;
    icon?: React.ReactNode;
    width?: number | string;
    type?: "title" | "tag" | "link" | "number" | "text";
    editable?: boolean;
    options?: string[];
    format?: (value: number) => string;
};
export type DataRow = {
    id: string;
    logo?: React.ReactNode;
    [key: string]: unknown;
};
export type DataTableProps = {
    title?: string;
    icon?: React.ReactNode;
    columns?: DataColumn[];
    rows?: DataRow[];
    tagTones?: Record<string, TagTone>;
    editable?: boolean;
    onRowsChange?: (rows: DataRow[]) => void;
    onSelectionChange?: (ids: string[]) => void;
    className?: string;
};
export declare function DataTable({ title, icon, columns, rows: initialRows, tagTones, editable, onRowsChange, onSelectionChange, className, }: DataTableProps): React.JSX.Element;
export default DataTable;
