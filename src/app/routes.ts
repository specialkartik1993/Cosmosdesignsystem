import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Overview } from './pages/Overview';
import { Installation } from './pages/Installation';
import { Colors } from './pages/foundations/Colors';
import { Typography } from './pages/foundations/Typography';
import { Spacing } from './pages/foundations/Spacing';
import { Shadows } from './pages/foundations/Shadows';
import { Icons } from './pages/foundations/Icons';
import { Tokens } from './pages/Tokens';
import { ButtonPage } from './pages/components/ButtonPage';
import { InputPage } from './pages/components/InputPage';
import { BadgePage } from './pages/components/BadgePage';
import { AvatarPage } from './pages/components/AvatarPage';
import { TogglePage } from './pages/components/TogglePage';
import { CheckboxPage } from './pages/components/CheckboxPage';
import { TooltipPage, SkeletonPage, SeparatorPage, SliderPage, ProgressPage } from './pages/components/MiscAtoms';
import { CardPage } from './pages/components/CardPage';
import { AlertPage } from './pages/components/AlertPage';
import { TabsPage } from './pages/components/TabsPage';
import { DropdownPage } from './pages/components/DropdownPage';
import { SelectPage } from './pages/components/SelectPage';
import { DialogPage } from './pages/components/DialogPage';
import { PopoverPage } from './pages/components/PopoverPage';
import { BreadcrumbPage } from './pages/components/BreadcrumbPage';
import { PaginationPage } from './pages/components/PaginationPage';
import { AccordionPage } from './pages/components/AccordionPage';
import { ErrorStatesPage } from './pages/components/ErrorStatesPage';
import { TimelinePage } from './pages/components/TimelinePage';
import { StatusIndicatorPage } from './pages/components/StatusIndicatorPage';
import { TagChipPage } from './pages/components/TagChipPage';
import { SearchBarPage } from './pages/components/SearchBarPage';
import { NotificationPage } from './pages/components/NotificationPage';
import { TablePage } from './pages/components/TablePage';
import { NavigationPage } from './pages/components/NavigationPage';
import { FormPage } from './pages/components/FormPage';
import { ChartsPage } from './pages/components/ChartsPage';
import { CalendarPage } from './pages/components/CalendarPage';
import { DrawerSheetPage } from './pages/components/DrawerSheetPage';
import { Dashboard } from './pages/examples/Dashboard';
import { Animations } from './pages/examples/Animations';
import { Playground } from './pages/examples/Playground';
import { AIPlayground } from './pages/examples/AIPlayground';
import { AccessibilityPage } from './pages/Accessibility';
import { Changelog } from './pages/Changelog';
import { Theming } from './pages/Theming';
import { FigmaIntegration } from './pages/FigmaIntegration';
import { ApiReference } from './pages/ApiReference';
import { DataGridPage } from './pages/components/enterprise/DataGridPage';
import { FileUploadPage } from './pages/components/enterprise/FileUploadPage';
import { RichTextEditorPage } from './pages/components/enterprise/RichTextEditorPage';
import { DateRangePickerPage } from './pages/components/enterprise/DateRangePickerPage';
import { InteractiveCardsPage } from './pages/interactions/InteractiveCardsPage';
import { ScrollTriggeredPage } from './pages/interactions/ScrollTriggeredPage';
import { ParallaxPage } from './pages/interactions/ParallaxPage';
import { RevealEffectsPage } from './pages/interactions/RevealEffectsPage';
import { AIChatPage } from './pages/ai/AIChatPage';
import { AIPromptPage } from './pages/ai/AIPromptPage';
import { AIResponsePage } from './pages/ai/AIResponsePage';
import { AICopilotPage } from './pages/ai/AICopilotPage';
import { AIWidgetsPage } from './pages/ai/AIWidgetsPage';
import { FigmaPlugin } from './pages/examples/FigmaPlugin';
import { PluginGuide } from './pages/PluginGuide';
import { NotFound } from './pages/NotFound';
import { ComingSoon } from './pages/ComingSoon';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Overview },
      { path: 'installation', Component: Installation },
      // { path: 'changelog', Component: Changelog }, // Coming soon
      { path: 'changelog', Component: ComingSoon },
      // Foundations
      { path: 'foundations/colors', Component: Colors },
      { path: 'foundations/typography', Component: Typography },
      { path: 'foundations/spacing', Component: Spacing },
      { path: 'foundations/shadows', Component: Shadows },
      { path: 'foundations/icons', Component: Icons },
      // Tokens
      { path: 'tokens', Component: Tokens },
      { path: 'theming', Component: Theming },
      // { path: 'figma', Component: FigmaIntegration }, // Coming soon
      // { path: 'figma/plugin-guide', Component: PluginGuide }, // Coming soon
      { path: 'figma', Component: ComingSoon },
      { path: 'figma/plugin-guide', Component: ComingSoon },
      { path: 'api', Component: ApiReference },
      // Atoms
      { path: 'components/button', Component: ButtonPage },
      { path: 'components/input', Component: InputPage },
      { path: 'components/badge', Component: BadgePage },
      { path: 'components/avatar', Component: AvatarPage },
      { path: 'components/toggle', Component: TogglePage },
      { path: 'components/checkbox', Component: CheckboxPage },
      { path: 'components/tooltip', Component: TooltipPage },
      { path: 'components/skeleton', Component: SkeletonPage },
      { path: 'components/separator', Component: SeparatorPage },
      { path: 'components/slider', Component: SliderPage },
      { path: 'components/progress', Component: ProgressPage },
      { path: 'components/icon-button', Component: ComingSoon },
      // Molecules
      { path: 'components/card', Component: CardPage },
      { path: 'components/alert', Component: AlertPage },
      { path: 'components/tabs', Component: TabsPage },
      { path: 'components/dropdown', Component: DropdownPage },
      { path: 'components/select', Component: SelectPage },
      { path: 'components/dialog', Component: DialogPage },
      { path: 'components/popover', Component: PopoverPage },
      { path: 'components/breadcrumb', Component: BreadcrumbPage },
      { path: 'components/pagination', Component: PaginationPage },
      { path: 'components/accordion', Component: AccordionPage },
      // New Creative Components
      { path: 'components/error-states', Component: ErrorStatesPage },
      { path: 'components/timeline', Component: TimelinePage },
      { path: 'components/status', Component: StatusIndicatorPage },
      { path: 'components/tag', Component: TagChipPage },
      { path: 'components/search-bar', Component: SearchBarPage },
      { path: 'components/notification', Component: NotificationPage },
      // Organisms
      { path: 'components/table', Component: TablePage },
      { path: 'components/navigation', Component: NavigationPage },
      { path: 'components/form', Component: FormPage },
      { path: 'components/charts', Component: ChartsPage },
      { path: 'components/calendar', Component: CalendarPage },
      { path: 'components/drawer', Component: DrawerSheetPage },
      // Enterprise
      { path: 'enterprise/data-grid', Component: DataGridPage },
      { path: 'enterprise/file-upload', Component: FileUploadPage },
      { path: 'enterprise/rich-text-editor', Component: RichTextEditorPage },
      { path: 'enterprise/date-range-picker', Component: DateRangePickerPage },
      // Interactions
      { path: 'interactions/interactive-cards', Component: InteractiveCardsPage },
      { path: 'interactions/scroll-triggered', Component: ScrollTriggeredPage },
      { path: 'interactions/parallax', Component: ParallaxPage },
      { path: 'interactions/reveal-effects', Component: RevealEffectsPage },
      // AI Components
      { path: 'ai/chat', Component: AIChatPage },
      { path: 'ai/prompt', Component: AIPromptPage },
      { path: 'ai/response', Component: AIResponsePage },
      { path: 'ai/copilot', Component: AICopilotPage },
      { path: 'ai/widgets', Component: AIWidgetsPage },
      // Examples
      { path: 'examples/dashboard', Component: Dashboard },
      { path: 'examples/animations', Component: Animations },
      { path: 'examples/playground', Component: Playground },
      { path: 'examples/ai-playground', Component: AIPlayground },
      { path: 'examples/figma-plugin', Component: ComingSoon },
      // Accessibility
      { path: 'accessibility', Component: AccessibilityPage },
      // 404
      { path: '*', Component: NotFound },
    ],
  },
]);