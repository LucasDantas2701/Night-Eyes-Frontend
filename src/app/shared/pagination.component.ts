import { Component, computed, input, output } from '@angular/core';

/** Paginação numerada (janela de 5 páginas), igual à dos cards de Corridas e Alertas. */
@Component({
  selector: 'ne-pagination',
  template: `
    @if (total() > 1) {
      <div class="flex justify-center mt-12 gap-1">
        <button class="px-3 rounded-lg hover:bg-gray-100 disabled:opacity-40" [disabled]="page() === 1" (click)="go(page() - 1)">&lt;</button>
        @for (p of pages(); track p) {
          <button class="w-10 h-10 rounded-xl font-bold transition-all"
                  [class]="p === page() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-400 hover:text-gray-900'"
                  (click)="go(p)">{{ p }}</button>
        }
        <button class="px-3 rounded-lg hover:bg-gray-100 disabled:opacity-40" [disabled]="page() === total()" (click)="go(page() + 1)">&gt;</button>
      </div>
    }
  `,
})
export class PaginationComponent {
  page = input.required<number>();
  total = input.required<number>();
  pageChange = output<number>();

  pages = computed(() => {
    const total = this.total();
    let start = Math.max(1, this.page() - 2);
    const end = Math.min(total, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    const list: number[] = [];
    for (let i = start; i <= end; i++) list.push(i);
    return list;
  });

  go(p: number) {
    this.pageChange.emit(p);
    window.scrollTo(0, 0);
  }
}
