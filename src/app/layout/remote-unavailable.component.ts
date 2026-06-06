import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RemoteFailureReason, RemoteId } from './shell-remote.models';

@Component({
  selector: 'app-remote-unavailable',
  standalone: true,
  templateUrl: './remote-unavailable.component.html',
  styleUrl: './remote-unavailable.component.scss',
})
export class RemoteUnavailableComponent {
  private readonly route = inject(ActivatedRoute);

  readonly remoteId = computed<RemoteId>(() => {
    const value = this.route.snapshot.data['remoteId'];
    return value === 'gateways' ? 'gateways' : 'ocpi';
  });

  readonly failureReason = computed<RemoteFailureReason>(() => {
    const value = this.route.snapshot.data['failureReason'];
    if (value === 'manifest' || value === 'entry' || value === 'exposed-module' || value === 'permission') {
      return value;
    }

    return null;
  });

  readonly message = computed(() => {
    const destination = this.remoteId() === 'ocpi' ? 'OCPI' : 'Gateways';
    const reason = this.failureReason();

    if (reason === 'manifest') {
      return `${destination} is temporarily unavailable because its runtime manifest could not be loaded.`;
    }

    if (reason === 'exposed-module') {
      return `${destination} is temporarily unavailable because its route exposure is incompatible.`;
    }

    if (reason === 'permission') {
      return `You do not have permission to open ${destination}.`;
    }

    return `${destination} is temporarily unavailable. Try again in a few moments or choose another destination.`;
  });
}
