import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type Integration = {
    id: string;
    name: string;
    domain: string;
    category: string;
    description: string;
    features: string[];
    /** SVG path data drawn in white on the brand color (24×24 box). */
    path?: string;
    color?: string;
    icon?: React.ReactNode;
    connected?: boolean;
};
export type IntegrationPickerProps = {
    integrations?: Integration[];
    appName?: string;
    appIcon?: React.ReactNode;
    defaultSelected?: string;
    onToggle?: (id: string, connected: boolean) => void;
    onExplore?: (id: string) => void;
    onBack?: () => void;
    onClose?: () => void;
    className?: string;
};
export declare function IntegrationPicker({ integrations, appName, appIcon, defaultSelected, onToggle, onExplore, onBack, onClose, className, }: IntegrationPickerProps): React.JSX.Element;
export default IntegrationPicker;
