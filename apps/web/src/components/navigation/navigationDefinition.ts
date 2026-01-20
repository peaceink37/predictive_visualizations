// web/src/components/navigation/navigationDefinition.ts

export type NavBadge = {
  text: string;
  variant?: "neutral" | "info" | "warning";
};

export type NavItem = {
  /** Stable id used for keys, tests, analytics */
  id: string;

  /** Text shown in UI */
  label: string;

  /** Route to navigate to. If omitted, item may act as a group header */
  href?: string;

  /** Optional icon identifier; render however you like */
  icon?: "workspaces" | "datasets" | "settings" | "help";

  /** Optional badge/pill */
  badge?: NavBadge;

  /** Optional nested children */
  children?: NavItem[];

  /** Whether to show this item in MVP; handy for phased rollout */
  enabled?: boolean;
};

export type NavigationDefinition = {
  /** Items in the primary (top) section */
  primary: NavItem[];

  /** Items pinned to the bottom (settings/account/help) */
  footer: NavItem[];
};

/**
 * MVP navigation: tiny and opinionated.
 * - Workspaces = primary object
 * - Datasets = dependency object
 * - Settings = footer
 */
export const navigationDefinition: NavigationDefinition = {
  primary: [
    {
      id: "workspaces",
      label: "Workspaces",
      href: "/workspaces",
      icon: "workspaces",
      enabled: true,
      children: [
        { id: "workspaces-new", label: "New workspace", href: "/workspaces/new", enabled: true },
        { id: "workspaces-recent", label: "Recent", href: "/workspaces?view=recent", enabled: true },
        { id: "workspaces-saved", label: "Saved", href: "/workspaces?view=saved", enabled: true },
      ],
    },
    {
      id: "datasets",
      label: "Datasets",
      href: "/datasets",
      icon: "datasets",
      enabled: true,
      children: [
        { id: "datasets-upload", label: "Upload dataset", href: "/datasets/upload", enabled: true },
        { id: "datasets-browse", label: "Browse", href: "/datasets", enabled: true },
      ],
    },
  ],
  footer: [
    {
      id: "settings",
      label: "Settings",
      href: "/settings",
      icon: "settings",
      enabled: true,
    },
    {
      id: "help",
      label: "Help",
      href: "/help",
      icon: "help",
      enabled: true,
      badge: { text: "MVP", variant: "neutral" },
    },
  ],
};
