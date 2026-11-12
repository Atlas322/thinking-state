// Module entry: the renderer lives in src/company/ (contract, fixtures,
// views) and reuses the chat widgets, so this file is not a single-file copy.
import { CompanyView, type CompanyViewProps } from "../company/company-view";
import { CompanyPreview } from "../company/company-preview";

export function CompanyWorkspace(props: Omit<CompanyViewProps, "defaultTemplate">) {
  return <CompanyView {...props} defaultTemplate="workspace" />;
}

export default function Preview() {
  return <CompanyPreview template="workspace" />;
}
