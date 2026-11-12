/**
 * @inai/thinking-state — the package inai.sh (and other apps) import.
 * Code and tokens only: no fixtures, no vault data. Components take their
 * data as props (the Company contract, collections, chat widget JSON) and
 * their look from `--ts-*` CSS variables (see "./tokens.css").
 */

// Company renderer (TENET phase 2)
export { CompanyView, CollectionPanel, COMPANY_VIEWS, companyLabelsMn } from "../company/company-view";
export type { CompanyLayout, CompanyViewKey, CompanyViewLabels, CompanyViewProps } from "../company/company-view";
export { Dashboard, ProjectReportFor, dependencyText, dueBucket, isHeld } from "../company/dashboard";
export { MethodologyView, methodologyName, methodologyShort } from "../company/methodology";
export { RaciView, PersonProfile, taskRaciOf } from "../company/raci";

// Collections (any vault type as a database)
export {
  CollectionView,
  Empty,
  PriorityBadge,
  ProgressNM,
  RelDate,
  RelationChip,
  StatusPill,
  TypeBadge,
  fieldIcon,
  inferKind,
  linkLabel,
  rangeText,
  relatedTo,
  relativeDay,
  resolveFields,
} from "../company/collection";
export type { CollectionViewKind, CollectionViewProps, Relation, ResolvedField } from "../company/collection";

// Replay: ↺ re-mounts any component (entry animation and state start over)
export { Replay, withReplay } from "../replay/replay";
export type { ReplayProps } from "../replay/replay";

// Icons (Lucide shapes, inline) and the contract
export * from "../company/icons";
export * from "../company/types";

// Chat widgets
export { ProjectReport, toPhaseState } from "../library/project-report";
export type { ProjectReportData, ProjectReportProps, ProjectReportPhase, ProjectReportWaiting } from "../library/project-report";
export { PrDeployStatus } from "../library/pr-deploy-status";
export type { PrDeployStatusData, PrDeployStatusProps, PdDeploy, PdPullRequest } from "../library/pr-deploy-status";
export { DecisionInboxChat } from "../library/decision-inbox-chat";
export type { DecisionInboxChatData, DecisionInboxChatProps, DecisionChatItem, DecisionChatOption } from "../library/decision-inbox-chat";
export { SessionBoard, toSessionState } from "../library/session-board";
export type { SessionBoardInput, SessionBoardProps, SessionBoardSession, SessionBoardGroup, SessionBoardProject } from "../library/session-board";

// Motion foundation (v2): spring tokens, loop primitives, in-view playback, ↺ / ⏸
export * from "../motion";

// Layout: spacing tokens + Stack (controls carry no outer margin; the parent's gap spaces them)
export { GAPS, SPACE, Stack, gapVar } from "../layout/stack";
export type { GapName, SpaceStep, StackProps } from "../layout/stack";

// Primitives — the one design system for the app and the site (ts.css for sites)
export { Badge, Button, Card, IconTile, Pill, PrimitiveStyles, PRIMITIVES_CSS, SplitCTA, STATUS_ICON, STATUSES, Tabs, Text } from "../ui/primitives";
export type { BadgeTone, IconTileTone, StatusTone, ButtonProps, ButtonVariant, CardProps, PillProps, SplitCTAProps, TabItem, TabsProps, TextVariant } from "../ui/primitives";

// Site chrome and story components (one design system for the app and the site)
export { Footer, NavBar, Wordmark, navBarLabelsMn, MEGA_CLOSE_DELAY } from "../ui/site";
export type { FooterColumn, FooterProps, NavBarLabels, NavBarProps, NavFeature, NavFeatured, NavGroup, NavItem, NavLink } from "../ui/site";
export { ScenarioChat, scenarioChatLabelsMn } from "../ui/scenario-chat";
export type { ChatScenario, ChatSourceType, ScenarioChatLabels, ScenarioChatProps } from "../ui/scenario-chat";
export { AgentConsent, agentConsentLabelsMn } from "../ui/agent-consent";
export type { AgentConsentLabels, AgentConsentProps, ConsentDecision, ConsentRisk, ConsentScope } from "../ui/agent-consent";
