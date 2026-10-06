import { Component, input, output } from '@angular/core';
import { IconComponent } from './icon.component';

/** Substitui o Dialog do Radix. */
@Component({
  selector: 'ne-modal',
  imports: [IconComponent],
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-black/50" (click)="closed.emit()"></div>
        <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
          <button class="absolute right-4 top-4 text-gray-400 hover:text-gray-700" (click)="closed.emit()" aria-label="Fechar">
            <ne-icon name="close" [size]="18" />
          </button>
          <h2 class="text-lg font-semibold mb-2">{{ title() }}</h2>
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  open = input.required<boolean>();
  title = input.required<string>();
  closed = output<void>();
}
