/**
 * @inai/thinking-state — the package inai.sh (and other apps) import.
 * Code and tokens only: no fixtures, no vault data. Components take their
 * data as props (the Company contract, collections, chat widget JSON) and
 * their look from `--ts-*` CSS variables (see "./tokens.css").
 */

// Company renderer (TENET phase 2)
export { CompanyView, CollectionPanel, COMPANY_VIEWS, companyLabelsMn } from "../company/company-view";
export { CompanyMini, companyMiniLabelsMn } from "../company/company-mini";
export type { CompanyMiniLabels } from "../company/company-mini";
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
export { UseCaseRun, useCaseRunDemo } from "../library/usecase-run";
export type { UseCaseRunData, UseCaseRunProps, UseCaseRunLabels, UseCaseSource, UseCaseStep } from "../library/usecase-run";
export { BrainMap, brainMapDemo } from "../library/brain-map";
export type { BrainMapData, BrainMapProps, BrainMapLabels, BrainMapBranch, BrainMapAgent } from "../library/brain-map";
export { BrainGrowth, brainGrowthDemo, brainGrowthStops } from "../library/brain-growth";
export type { BrainGrowthData, BrainGrowthProps, BrainGrowthLabels, BrainGrowthStage } from "../library/brain-growth";
export { BrainField, layoutBrain, useBrainProgress } from "../brain/field";
export type { BrainCluster, BrainLink, BrainTone, BrainFieldProps } from "../brain/field";
export { ModuleScene, moduleSceneDemo } from "../library/module-scene";
export type { ModuleSceneData, ModuleSceneProps, ModuleSceneLabels, ModuleSceneModule, ModuleSceneKpi } from "../library/module-scene";
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

// Second Brain app screens (2026-11-17): one screen library for inai.sh, social and Journal.
// Glass window + six screens; data via props. acmeDemo = the made-up ACME case (no real people).
export { AppScreen, AppWindow, InboxScreen, NoteScreen, ProjectScreen, ChatScreen, MemoryScreen, TeamScreen, SCREENS, appScreenLabelsMn } from "../screens/app-screens";
export type { AppScreenProps, AppWindowProps, AppScreenLabels, ScreenKey, ScreenTheme, WindowVariant } from "../screens/app-screens";
export { acmeDemo } from "../screens/acme";
export type { ScreenData, InboxItem, AtomNote, NoteLink, AppProject, ProjectTask, CaptureKind } from "../screens/acme";

// Source chip + file preview popover (site hero, chat)
export { BRAND_LOGO, BRAND_MARK, BRAND_NAME, SourcePreview, SourceIcon, SOURCE_ICON, brandTrademarkNoteMn, sourcePreviewLabelsMn } from "../library/source-preview";
export type { PreviewSource, SourceKind, SourcePreviewLabels, SourcePreviewProps } from "../library/source-preview";

// Cited answer (site hero, chat): sources as icon tiles, citations, quoted preview
export { CitedAnswer } from "../library/cited-answer";
export type { CitedAnswerProps, CitedSegment, CitedSource } from "../library/cited-answer";

// Ask Window: the site hero's Ask block (app window + sidebar + sources + cited answer)
export { AskWindow, askNavMn, askWindowDemo, askWindowDemoNote, askWindowLabelsMn, askWindowMicroMn } from "../screens/ask-window";
export { FinanceReport, financeReportDemo } from "../screens/finance-report";
export { CashRiver, cashRiverDemo } from "../screens/cash-river";
export { AppShell, PARA_KEYS, paraBaseMn, acmeParaVocab, appShellLabelsMn } from "../screens/app-shell";
export type { AppShellProps, AppShellView, AppShellLabels, ParaKey, ParaVocab } from "../screens/app-shell";
export { CeoDaily, CeoDailyScreen, CeoMeetingOverview, ceoDailyDemo, ceoDailyLogisticsDemo, appShellDemo, appShellLogisticsDemo, ceoDailyScreenDemo } from "../screens/ceo-daily";
export type { CeoDailyProps, CeoDailyData, CeoKpi, CeoDayItem, CeoMeeting, CeoArea, CeoProject, CeoGoal, CeoContract, CeoAgent } from "../screens/ceo-daily";
export type { CashRiverProps, CashEvent, CashToggle } from "../screens/cash-river";
export type { FinanceReportData, FinanceReportProps, FinanceKpi, FinanceLine } from "../screens/finance-report";
export type { AskPhase } from "../screens/ask-window";
export type { AskChat, AskNavItem, AskSource, AskWindowLabels, AskWindowProps } from "../screens/ask-window";

// Method Quiz: the build page's questionnaire → recommended method (BMC · PMBOK · OKR · Lean Canvas)
export { MethodQuiz, methodQuizDemo, methodQuizLabelsMn, scoreMethods } from "../screens/method-quiz";
export type { MethodQuizLabels, MethodQuizProps, QuizMethod, QuizOption, QuizQuestion } from "../screens/method-quiz";

// Build Wizard: the build page's four-step «Бүтээх горим» → a draft Company (MethodQuiz inside step 2)
export { BuildWizard, SEGMENT_ALIASES, buildWizardLabelsMn, resolveSegment, segmentFromSearch, toDraftCompany, buildWizardDemo } from "../screens/build-wizard";
export type { BuildWizardLabels, BuildWizardProps, WizardAnswers, WizardField, WizardOption, WizardRecipe, WizardStep } from "../screens/build-wizard";

// Role Dashboard: one company from one position (burning first, agent proposals to approve, timeline, brief)
export { RoleDashboard, findPerson, roleDashboardLabelsMn, roleView } from "../company/role-dashboard";
export type { RoleDashboardLabels, RoleDashboardProps, RoleView } from "../company/role-dashboard";
export { ConvergeNet, convergeNetDemo, drawConvergeNet, convergeNetLayout } from "../motion/converge-net";
export type { ConvergeNetProps } from "../motion/converge-net";
