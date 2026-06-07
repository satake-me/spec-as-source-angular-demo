import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AppLoadingService } from '../core/loading/app-loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOverlayComponent {
  private readonly appLoadingService = inject(AppLoadingService);

  readonly state = this.appLoadingService.state;

  protected buildContentBlocks(count: number): number[] {
    return Array.from({ length: count }, (_value, index) => index);
  }
}
