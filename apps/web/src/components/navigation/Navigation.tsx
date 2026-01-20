// web/src/components/navigation/Navigation.tsx

"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";
import type { NavItem, NavigationDefinition } from "./navigationDefinition";

type NavigationProps = {
  definition: NavigationDefinition;
  variant: "sidebar" | "mobileTop";
  appName?: string;
};

function isItemEnabled(item: NavItem): boolean {
  return item.enabled !== false;
}

function normalizeItems(items: NavItem[]): NavItem[] {
  return items.filter(isItemEnabled).map((item) => ({
    ...item,
    children: item.children ? normalizeItems(item.children) : undefined,
  }));
}

function isActivePath(currentPath: string, href?: string): boolean {
  if (!href) return false;
  if (href === "/") return currentPath === "/";
  // Basic “startsWith” matching. If you want stricter route matching later, refine here.
  return currentPath === href || currentPath.startsWith(href + "/");
}

function Icon({ name }: { name?: NavItem["icon"] }) {
  // Keep icons dead-simple for MVP; swap with lucide-react or your icon system later.
  // This avoids a dependency decision right now.
  const glyph = useMemo(() => {
    switch (name) {
      case "workspaces":
        return "▦";
      case "datasets":
        return "⧉";
      case "settings":
        return "⚙";
      case "help":
        return "?";
      default:
        return "•";
    }
  }, [name]);

  return <span className={styles.icon}>{glyph}</span>;
}

function Badge({ text, variant }: { text: string; variant?: string }) {
  const className =
    variant === "warning"
      ? styles.badgeWarning
      : variant === "info"
        ? styles.badgeInfo
        : styles.badgeNeutral;

  return <span className={`${styles.badge} ${className}`}>{text}</span>;
}

function NavRow({
                  item,
                  depth,
                  currentPath,
                  isOpen,
                  onToggle
                }: {
  item: NavItem,
  depth: number,
  currentPath: string,
  isOpen: boolean,
  onToggle: () => void,
  key?: string
}) {
  const active = isActivePath(currentPath, item.href);

  const hasChildren = Boolean(item.children && item.children.length > 0);

  const rowClass = [
    styles.row,
    active ? styles.rowActive : "",
    hasChildren ? styles.rowHasChildren : "",
  ]
    .filter(Boolean)
    .join(" ");

  const indentStyle: React.CSSProperties = { paddingLeft: `${12 + depth * 12}px` };

  // If it has children and also a href, you can decide:
  // - clicking label navigates
  // - clicking chevron expands
  // For MVP, we’ll: label navigates if href; chevron toggles.
  return (
    <div className={styles.rowWrap}>
      <div className={rowClass} style={indentStyle}>
        <Icon name={item.icon} />

        {item.href ? (
          <Link className={styles.rowLink} href={item.href}>
            <span className={styles.rowLabel}>{item.label}</span>
          </Link>
        ) : (
          <button className={styles.rowButton} onClick={onToggle} type="button">
            <span className={styles.rowLabel}>{item.label}</span>
          </button>
        )}

        {item.badge ? <Badge text={item.badge.text} variant={item.badge.variant} /> : null}

        {hasChildren ? (
          <button
            type="button"
            className={styles.chevronButton}
            onClick={onToggle}
            aria-label={isOpen ? "Collapse submenu" : "Expand submenu"}
          >
            <span className={styles.chevron}>{isOpen ? "▾" : "▸"}</span>
          </button>
        ) : null}
      </div>

      {hasChildren && isOpen ? (
        <div className={styles.children}>
          {item.children!.map((child) => (
            <NavRow
              key={child.id}
              item={child}
              depth={depth + 1}
              currentPath={currentPath}
              isOpen={false} // child groups can be supported later; keep simple now
              onToggle={() => {}}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SidebarNav({ definition }: { definition: NavigationDefinition }) {
  const pathname = usePathname() || "/";
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const normalized = useMemo(() => {
    return {
      primary: normalizeItems(definition.primary),
      footer: normalizeItems(definition.footer),
    };
  }, [definition]);

  // Auto-open group if current path is inside it
  const shouldGroupBeOpen = (item: NavItem): boolean => {
    const stored = openGroups[item.id];
    if (typeof stored === "boolean") return stored;

    if (item.children?.some((c) => isActivePath(pathname, c.href))) return true;
    return false;
  };

  return (
    <nav className={styles.sidebar} aria-label="Primary navigation">
      <div className={styles.section}>
        {normalized.primary.map((item) => {
          const open = shouldGroupBeOpen(item);
          return (
            <NavRow
              key={item.id}
              item={item}
              depth={0}
              currentPath={pathname}
              isOpen={open}
              onToggle={() =>
                setOpenGroups((prev) => ({
                  ...prev,
                  [item.id]: !open,
                }))
              }
            />
          );
        })}
      </div>

      <div className={styles.footer}>
        {normalized.footer.map((item) => (
          <NavRow
            key={item.id}
            item={item}
            depth={0}
            currentPath={pathname}
            isOpen={false}
            onToggle={() => {}}
          />
        ))}
      </div>
    </nav>
  );
}

function MobileTopNav({
  definition,
  appName = "Project Reality",
}: {
  definition: NavigationDefinition;
  appName?: string;
}) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const items = useMemo(() => {
    return [...normalizeItems(definition.primary), ...normalizeItems(definition.footer)];
  }, [definition]);

  return (
    <div className={styles.mobileTop}>
      <div className={styles.mobileBar}>
        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          ☰
        </button>

        <div className={styles.appName}>{appName}</div>
        <div className={styles.mobileRightSlot} />
      </div>

      {open ? (
        <div className={styles.mobileMenu} role="dialog" aria-label="Menu">
          {items.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);

            return (
              <div key={item.id} className={styles.mobileMenuItem}>
                {/* Top-level row */}
                {item.href ? (
                  <Link
                    className={isActivePath(pathname, item.href) ? styles.mobileLinkActive : styles.mobileLink}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                    {item.badge ? <Badge text={item.badge.text} variant={item.badge.variant} /> : null}
                  </Link>
                ) : (
                  <div className={styles.mobileGroupLabel}>
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                    {item.badge ? <Badge text={item.badge.text} variant={item.badge.variant} /> : null}
                  </div>
                )}

                {/* Children */}
                {hasChildren ? (
                  <div className={styles.mobileChildren}>
                    {item.children!.map((c) =>
                      c.href ? (
                        <Link
                          key={c.id}
                          className={isActivePath(pathname, c.href) ? styles.mobileSubLinkActive : styles.mobileSubLink}
                          href={c.href}
                          onClick={() => setOpen(false)}
                        >
                          {c.label}
                        </Link>
                      ) : (
                        <div key={c.id} className={styles.mobileSubLabel}>
                          {c.label}
                        </div>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}


export function Navigation({ definition, variant, appName }: NavigationProps) {
  if (variant === "mobileTop") return <MobileTopNav definition={definition} appName={appName} />;
  return <SidebarNav definition={definition} />;
}
