/**
 * @inai/thinking-state — the package inai.sh (and other apps) import.
 * Code and tokens only: no fixtures, no vault data. Components take their
 * data as props (the Company contract, collections, chat widget JSON) and
 * their look from `--ts-*` CSS variables (see "./tokens.css").
 */
export { CompanyView, CollectionPanel, COMPANY_VIEWS, companyLabelsMn } from "../company/company-view";
export type { CompanyLayout, CompanyViewKey, CompanyViewLabels, CompanyViewProps } from "../company/company-view";
export { Dashboard, ProjectReportFor, dependencyText, dueBucket, isHeld } from "../company/dashboard";
export { MethodologyView, methodologyName, methodologyShort } from "../company/methodology";
export { RaciView, PersonProfile, taskRaciOf } from "../company/raci";
export { CollectionView, Empty, PriorityBadge, ProgressNM, RelDate, RelationChip, StatusPill, TypeBadge, fieldIcon, inferKind, linkLabel, rangeText, relatedTo, relativeDay, resolveFields, } from "../company/collection";
export type { CollectionViewKind, CollectionViewProps, Relation, ResolvedField } from "../company/collection";
export { Replay, withReplay } from "../replay/replay";
export type { ReplayProps } from "../replay/replay";
export * from "../company/icons";
export * from "../company/types";
export { ProjectReport, toPhaseState } from "../library/project-report";
export type { ProjectReportData, ProjectReportProps, ProjectReportPhase, ProjectReportWaiting } from "../library/project-report";
export { PrDeployStatus } from "../library/pr-deploy-status";
export type { PrDeployStatusData, PrDeployStatusProps, PdDeploy, PdPullRequest } from "../library/pr-deploy-status";
export { DecisionInboxChat } from "../library/decision-inbox-chat";
export type { DecisionInboxChatData, DecisionInboxChatProps, DecisionChatItem, DecisionChatOption } from "../library/decision-inbox-chat";
export { SessionBoard, toSessionState } from "../library/session-board";
export type { SessionBoardInput, SessionBoardProps, SessionBoardSession, SessionBoardGroup, SessionBoardProject } from "../library/session-board";
export * from "../motion";
export { GAPS, SPACE, Stack, gapVar } from "../layout/stack";
export type { GapName, SpaceStep, StackProps } from "../layout/stack";
export { Badge, Button, Card, IconTile, Pill, PrimitiveStyles, PRIMITIVES_CSS, SplitCTA, STATUS_ICON, STATUSES, Tabs, Text } from "../ui/primitives";
export type { BadgeTone, IconTileTone, StatusTone, ButtonProps, ButtonVariant, CardProps, PillProps, SplitCTAProps, TabItem, TabsProps, TextVariant } from "../ui/primitives";
export { Footer, NavBar, Wordmark, navBarLabelsMn } from "../ui/site";
export type { FooterColumn, FooterProps, NavBarLabels, NavBarProps, NavFeature, NavGroup, NavItem, NavLink } from "../ui/site";
export { ScenarioChat, scenarioChatLabelsMn } from "../ui/scenario-chat";
export type { ChatScenario, ChatSourceType, ScenarioChatLabels, ScenarioChatProps } from "../ui/scenario-chat";
export { AgentConsent, agentConsentLabelsMn } from "../ui/agent-consent";
export type { AgentConsentLabels, AgentConsentProps, ConsentDecision, ConsentRisk, ConsentScope } from "../ui/agent-consent";
