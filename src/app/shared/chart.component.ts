import { Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

/** Wrapper fino do Chart.js (substitui o Recharts do projeto React). */
@Component({
  selector: 'ne-chart',
  template: `<div class="relative h-[300px] w-full"><canvas #canvas></canvas></div>`,
})
export class ChartComponent implements OnDestroy {
  config = input.required<ChartConfiguration>();
  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart?: Chart;

  constructor() {
    effect(() => {
      const cfg = this.config();
      this.chart?.destroy();
      this.chart = new Chart(this.canvas().nativeElement, {
        ...cfg,
        options: { responsive: true, maintainAspectRatio: false, ...cfg.options },
      });
    });
  }

  ngOnDestroy() { this.chart?.destroy(); }
}
