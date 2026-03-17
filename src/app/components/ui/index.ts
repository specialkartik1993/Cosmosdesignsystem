/**
 * @cosmos-ds/react: Barrel Export
 *
 * All components are re-exported from this file so consumers
 * can import everything from a single entry point:
 *
 *   import { Button, Badge, Tag, SearchBar } from '@cosmos-ds/react';
 *
 * Each component file also supports direct deep imports:
 *
 *   import { Button } from '@cosmos-ds/react/button';
 */

// ================================================================
// ATOMS: Primitive building blocks
// ================================================================
export * from "./button";
export * from "./badge";
export * from "./input";
export * from "./label";
export * from "./textarea";
export * from "./checkbox";
export * from "./radio-group";
export * from "./switch";
export * from "./toggle";
export * from "./toggle-group";
export * from "./slider";
export * from "./progress";
export * from "./skeleton";
export * from "./separator";
export * from "./avatar";
export * from "./tooltip";
export * from "./aspect-ratio";

// ================================================================
// MOLECULES: Composed patterns
// ================================================================
export * from "./accordion";
export * from "./alert";
export * from "./alert-dialog";
export * from "./card";
export * from "./dialog";
export * from "./drawer";
export * from "./dropdown-menu";
export * from "./context-menu";
export * from "./menubar";
export * from "./popover";
export * from "./hover-card";
export * from "./select";
export * from "./tabs";
export * from "./collapsible";
export * from "./sheet";
export * from "./scroll-area";
export * from "./form";
export * from "./calendar";
export * from "./pagination";
export * from "./breadcrumb";
export * from "./navigation-menu";
export * from "./command";
export * from "./input-otp";
export * from "./sonner";
export * from "./resizable";

// ================================================================
// ORGANISMS: Complex compositions
// ================================================================
export * from "./table";
export * from "./carousel";
export * from "./timeline";
export * from "./chart";
export * from "./sidebar";

// ================================================================
// CUSTOM COMPONENTS: Cosmos-specific
// ================================================================
export * from "./tag";
export * from "./status-indicator";
export * from "./search-bar";
export * from "./notification";
export * from "./error-state";

// ================================================================
// ENTERPRISE: Data-heavy & productivity components
// ================================================================
export * from "./data-table";
export * from "./file-upload";
export * from "./rich-text-editor";
export * from "./date-range-picker";

// ================================================================
// INTERACTIONS: Motion & animation components
// ================================================================
export * from "./interactive-card";
export * from "./scroll-triggered";
export * from "./parallax";
export * from "./reveal-effects";

// ================================================================
// COSMIC AI: AI-powered interface components
// ================================================================
export * from "./ai-avatar";
export * from "./ai-chat";
export * from "./ai-prompt";
export * from "./ai-response";
export * from "./ai-copilot";
export * from "./ai-widgets";

// ================================================================
// UTILITIES
// ================================================================
export { cn } from "./utils";
export { useIsMobile } from "./use-mobile";