import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

interface UIContextValue {
  /** Desktop: narrow icon-only rail. */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  /** Mobile (< lg): off-canvas drawer open state. */
  mobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  paletteOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Stable identities — so consumers' effects (e.g. close-on-route-change) don't
  // re-fire just because the provider re-rendered.
  const toggleSidebar = useCallback(() => setSidebarCollapsed((v) => !v), []);
  const toggleMobileSidebar = useCallback(() => setMobileSidebarOpen((v) => !v), []);
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  const value = useMemo<UIContextValue>(
    () => ({
      sidebarCollapsed,
      toggleSidebar,
      setSidebarCollapsed,
      mobileSidebarOpen,
      toggleMobileSidebar,
      closeMobileSidebar,
      paletteOpen,
      openPalette,
      closePalette,
    }),
    [
      sidebarCollapsed,
      mobileSidebarOpen,
      paletteOpen,
      toggleSidebar,
      toggleMobileSidebar,
      closeMobileSidebar,
      openPalette,
      closePalette,
    ],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within a UIProvider');
  return ctx;
}
