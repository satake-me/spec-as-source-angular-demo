import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AppLoadingService } from '../core/loading/app-loading.service';

const APP_LOADING_OVERLAY_READY_EVENT = 'app-loading-overlay-ready';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOverlayComponent implements AfterViewInit {
  private readonly appLoadingService = inject(AppLoadingService);
  private didNotifyOverlayReady = false;

  readonly state = this.appLoadingService.state;

  protected buildContentBlocks(count: number): number[] {
    return Array.from({ length: count }, (_value, index) => index);
  }

  ngAfterViewInit(): void {
    if (this.didNotifyOverlayReady || typeof window === 'undefined') {
      return;
    }

    this.didNotifyOverlayReady = true;
    window.dispatchEvent(new CustomEvent(APP_LOADING_OVERLAY_READY_EVENT));
  }
}
