/**
 * RoleDashboard demo (2026-11-17, screens.18) for the role-dashboard entry: the ac.me group
 * (acme-group.ts, the one small company fixture the dashboard needs — ~12 KB, no other fixtures),
 * its first person, a fixed «today». ac.me is a made-up company.
 */
import { acmeGroup } from "./acme-group";
import type { RoleDashboardProps } from "./role-dashboard";

export const roleDashboardDemo: RoleDashboardProps = { company: acmeGroup, personId: acmeGroup.people[0]?.id ?? "", today: new Date("2026-11-17T09:00:00+08:00") };
