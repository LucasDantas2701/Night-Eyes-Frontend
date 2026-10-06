import { Component } from '@angular/core';
import { MapaRotasComponent } from '../shared/mapa-rotas.component';

@Component({
  selector: 'ne-overview',
  imports: [MapaRotasComponent],
  template: `
    <div class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Overview - Rotas e Eventos</h1>
      <ne-mapa-rotas />
    </div>
  `,
})
export class Overview {}
