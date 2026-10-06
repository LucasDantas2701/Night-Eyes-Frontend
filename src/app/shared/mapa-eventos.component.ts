import { AfterViewInit, Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import { L } from './leaflet-setup';
import { Evento, EVENT_CONFIG } from '../core/models';

/** Mapa da tela de detalhes da corrida (antigo components/ui/map.tsx). */
@Component({
  selector: 'ne-mapa-eventos',
  template: `<div #mapa style="height:300px;width:100%"></div>`,
})
export class MapaEventosComponent implements AfterViewInit, OnDestroy {
  eventos = input<Evento[]>([]);
  selecionado = input<Evento | null>(null);

  private el = viewChild.required<ElementRef<HTMLDivElement>>('mapa');
  private map?: L.Map;
  private markers = L.layerGroup();
  private pronto = false;

  constructor() {
    effect(() => {
      const eventos = this.eventos();
      if (this.pronto) this.desenhar(eventos);
    });
    effect(() => {
      const sel = this.selecionado();
      if (!this.pronto || !sel) return;
      const [lat, lng] = sel.localizacao.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) this.map!.setView([lat, lng], 15);
    });
  }

  ngAfterViewInit() {
    this.map = L.map(this.el().nativeElement, { center: [-3.119, -60.021], zoom: 13, scrollWheelZoom: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(this.map);
    this.markers.addTo(this.map);
    this.pronto = true;
    this.desenhar(this.eventos());
  }

  private desenhar(eventos: Evento[]) {
    this.markers.clearLayers();
    let primeiro = true;
    for (const e of eventos) {
      const [lat, lng] = e.localizacao.split(',').map(Number);
      if (isNaN(lat) || isNaN(lng)) continue;
      L.marker([lat, lng]).bindPopup(`${EVENT_CONFIG[e.tipo].label}<br>${e.horario}`).addTo(this.markers);
      if (primeiro) { this.map!.setView([lat, lng], 13); primeiro = false; }
    }
  }

  ngOnDestroy() { this.map?.remove(); }
}
