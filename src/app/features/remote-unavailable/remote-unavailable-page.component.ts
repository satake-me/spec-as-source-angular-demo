import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-remote-unavailable-page',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: './remote-unavailable-page.component.html',
  styleUrl: './remote-unavailable-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoteUnavailablePageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly remoteTitle =
    (this.route.snapshot.data['title'] as string | undefined) ?? 'The remote application';

  retryCurrentRoute(): void {
    window.location.reload();
  }
}
