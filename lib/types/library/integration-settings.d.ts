import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type IntegrationValues = {
    enabled: boolean;
    siteUrl: string;
    timeZone: string;
    apiKey: string;
};
export type IntegrationSettingsProps = {
    name?: string;
    logo?: React.ReactNode;
    count?: number;
    meta?: string;
    defaultValues?: Partial<IntegrationValues>;
    siteHint?: string;
    timeZones?: string[];
    onGenerateKey?: () => string | Promise<string>;
    onSave?: (values: IntegrationValues) => void | Promise<void>;
    onToggle?: (enabled: boolean) => void;
    className?: string;
};
export declare function IntegrationSettings({ name, logo, count, meta, defaultValues, siteHint, timeZones, onGenerateKey, onSave, onToggle, className, }: IntegrationSettingsProps): React.JSX.Element;
export default IntegrationSettings;
