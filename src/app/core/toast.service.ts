import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; type: 'success' | 'error'; message: string; }

/** Substitui o `sonner` do projeto React. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private next = 1;

  success(message: string) { this.push('success', message); }
  error(message: string) { this.push('error', message); }

  private push(type: Toast['type'], message: string) {
    const id = this.next++;
    this.toasts.update((t) => [...t, { id, type, message }]);
    setTimeout(() => this.toasts.update((t) => t.filter((x) => x.id !== id)), 4000);
  }
}
