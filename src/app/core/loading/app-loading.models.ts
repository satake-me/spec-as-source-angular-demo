export type AppLoadingReason = 'app-startup' | 'route-transition' | 'manual';

export type AppLoadingPhase = 'hidden' | 'active' | 'exiting';

export interface AppLoadingSkeletonLayout {
  readonly sidebarVisible: boolean;
  readonly topbarVisible: boolean;
  readonly contentBlockCount: number;
}

export interface AppLoadingState {
  readonly phase: AppLoadingPhase;
  readonly reason: AppLoadingReason;
  readonly startedAtMs: number;
  readonly minimumVisibleMs: number;
  readonly fadeOutMs: number;
  readonly reducedMotion: boolean;
  readonly skeletonLayout: AppLoadingSkeletonLayout;
}

export interface AppLoadingShowOptions {
  readonly minimumVisibleMs?: number;
  readonly fadeOutMs?: number;
}

export const DEFAULT_LOADING_MINIMUM_VISIBLE_MS = 220;
export const DEFAULT_LOADING_FADE_OUT_MS = 280;

export const DEFAULT_LOADING_SKELETON_LAYOUT: AppLoadingSkeletonLayout = {
  sidebarVisible: true,
  topbarVisible: true,
  contentBlockCount: 4,
};

export const INITIAL_APP_LOADING_STATE: AppLoadingState = {
  phase: 'hidden',
  reason: 'manual',
  startedAtMs: 0,
  minimumVisibleMs: DEFAULT_LOADING_MINIMUM_VISIBLE_MS,
  fadeOutMs: DEFAULT_LOADING_FADE_OUT_MS,
  reducedMotion: false,
  skeletonLayout: DEFAULT_LOADING_SKELETON_LAYOUT,
};
