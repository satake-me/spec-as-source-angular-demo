import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { AuthFacade } from '../../core/auth/auth.facade';
import { ShellMenuConfigLoader } from '../../layout/shell-menu-config.loader';
import { SidebarMenuItem } from '../../layout/shell-menu.models';
import { filterMenuItemsForAuth } from '../../layout/shell-navigation.models';
import { buildHomeFeatureCollectionState } from './home-feature-cards.mapper';
import { createErrorHomeFeatureCollectionState } from './home-page.models';

@Component({
  selector: 'app-home-page',
  imports: [MatCardModule, MatExpansionModule, MatIconModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly menuConfigLoader = inject(ShellMenuConfigLoader);
  private readonly router = inject(Router);

  private readonly rawMenuItems = signal<SidebarMenuItem[]>([]);
  private readonly menuStatus = signal<'loading' | 'ready' | 'error'>('loading');
  private readonly menuErrorMessage = signal<string | null>(null);
  private readonly actionErrorMessage = signal<string | null>(null);
  private readonly highlightedFeatureId = signal<string | null>(null);

  readonly navigationItems = computed(() =>
    filterMenuItemsForAuth(this.rawMenuItems(), this.authFacade.isAuthenticated())
  );
  readonly greeting = computed(() => {
    const displayName = this.authFacade.profile()?.displayName?.trim();
    return displayName ? `Hello, ${displayName} !` : 'Hello !';
  });
  readonly viewState = computed(() => {
    if (this.menuStatus() === 'error') {
      return createErrorHomeFeatureCollectionState(
        this.menuErrorMessage() ?? 'Unable to load feature navigation.',
        this.actionErrorMessage()
      );
    }

    return buildHomeFeatureCollectionState(this.navigationItems(), this.actionErrorMessage());
  });
  readonly allVisibleCards = computed(() => [
    ...this.viewState().directCards,
    ...this.viewState().groups.flatMap((group) => group.children),
  ]);
  readonly highlightedFeature = computed(() => {
    const cards = this.allVisibleCards();
    const highlightedId = this.highlightedFeatureId();
    return cards.find((card) => card.id === highlightedId) ?? cards[0] ?? null;
  });
  readonly selectedMessage = computed(() => {
    const feature = this.highlightedFeature();

    if (feature === null) {
      return 'Browse the feature cards below to open the next workflow from the same navigation model used by the side menu.';
    }

    const group = this.viewState().groups.find((item) => item.id === feature.parentId);
    const scope = feature.source === 'top-level' ? 'direct portal area' : `${group?.label ?? 'grouped'} workflow`;

    return `${feature.label} is available as a ${scope} and opens through ${feature.route}.`;
  });
  readonly homeStats = computed(() => ({
    directCount: this.viewState().directCards.length,
    groupedCount: this.viewState().groups.length,
    linkedCount: this.allVisibleCards().length,
  }));

  constructor() {
    void this.authFacade.ensureProfileLoaded();

    this.menuConfigLoader
      .loadMenu()
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        this.rawMenuItems.set(result.items);
        this.menuStatus.set(result.status);
        this.menuErrorMessage.set(result.errorMessage);
        this.highlightedFeatureId.set(this.allVisibleCards()[0]?.id ?? null);
      });
  }

  async navigateTo(route: string): Promise<void> {
    this.actionErrorMessage.set(null);

    try {
      const navigated = await this.router.navigateByUrl(route);
      if (!navigated) {
        this.actionErrorMessage.set('We could not open this feature right now. Please try again.');
      }
    } catch {
      this.actionErrorMessage.set('We could not open this feature right now. Please try again.');
    }
  }

  highlightFeature(cardId: string): void {
    this.highlightedFeatureId.set(cardId);
  }

  isFeatureHighlighted(cardId: string): boolean {
    return this.highlightedFeature()?.id === cardId;
  }

  getFeatureSummary(route: string, parentLabel: string | null): string {
    const entryLabel = route.split('/').filter(Boolean).join(' / ') || 'root route';

    if (parentLabel) {
      return `Open the ${parentLabel} workflow via ${entryLabel}.`;
    }

    return `Open the ${entryLabel} portal view from the main workspace.`;
  }
}