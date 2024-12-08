export interface Page {
  path: string;
  pageCache: string | null;
}

export interface StackNavigationProps {
  children: React.ReactNode;
  animationDisabledUrls?: string[];
  animationDuration?: number;
}

export interface ViewData {
  path: string;
  pageCache: string | null;
  scrollPosition?: { x: number; y: number };
}
