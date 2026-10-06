import { Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'ne-toasts',
  template: `
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      @for (t of toast.toasts(); track t.id) {
        <div class="rounded-xl px-4 py-3 text-sm font-medium shadow-lg border bg-white"
             [class]="t.type === 'success' ? 'border-green-200 text-green-700' : 'border-red-200 text-red-600'">
          {{ t.message }}
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  toast = inject(ToastService);
}
