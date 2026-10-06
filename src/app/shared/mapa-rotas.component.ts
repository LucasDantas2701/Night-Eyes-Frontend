import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import polyline from '@mapbox/polyline';
import { supabase } from '../core/supabase.client';
import { L } from './leaflet-setup';

interface Rota { rota_id: number; nome_rota: string; nome_origem?: string | null; nome_destino?: string | null; rota_geometria?: any; }

const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

const criarIcone = (cor: string) => L.icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${cor}.png`,
  shadowUrl: 'leaflet/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

/** Mapa da tela Overview (antigo components/ui/MapaRotas.tsx). */
@Component({
  selector: 'ne-mapa-rotas',
  imports: [FormsModule],
  template: `
    <div class="p-6 bg-white rounded-xl border shadow-sm">
      <div class="flex justify-end items-center mb-4">
        <select class="border rounded-lg p-2 bg-white" [ngModel]="rotaId()" (ngModelChange)="selecionar($event)">
          <option value="">Selecione uma rota</option>
          @for (r of rotas(); track r.rota_id) { <option [value]="r.rota_id">{{ r.nome_rota }}</option> }
        </select>
      </div>
      <div #mapa class="rounded-xl overflow-hidden border" style="height:550px"></div>
    </div>
  `,
})
export class MapaRotasComponent implements OnInit, AfterViewInit, OnDestroy {
  rotas = signal<Rota[]>([]);
  rotaId = signal<string>('');

  private el = viewChild.required<ElementRef<HTMLDivElement>>('mapa');
  private map!: L.Map;
  private camada = L.layerGroup();
  private iconFadiga = criarIcone('red');
  private iconDistracao = criarIcone('yellow');
  private iconPadrao = criarIcone('blue');

  async ngOnInit() {
    const { data } = await supabase.from('Rota').select('*').order('rota_id');
    if (data) this.rotas.set(data);
  }

  ngAfterViewInit() {
    this.map = L.map(this.el().nativeElement, { center: [-3.119, -60.0217], zoom: 12 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    this.camada.addTo(this.map);
  }

  private escolherIcone(tipo: string | null) {
    const t = tipo?.toLowerCase() || '';
    if (t.includes('fadiga')) return this.iconFadiga;
    if (t.includes('distra')) return this.iconDistracao;
    return this.iconPadrao;
  }

  async selecionar(id: string) {
    this.rotaId.set(id);
    this.camada.clearLayers();
    const rota = this.rotas().find((r) => r.rota_id === Number(id));
    if (!rota?.rota_geometria) return;

    try {
      const g = rota.rota_geometria;
      const trajeto: [number, number][] = typeof g === 'string'
        ? (polyline.decode(g) as [number, number][])
        : g.coordinates.map((c: number[]) => [c[1], c[0]]);

      if (trajeto.length === 0) return;
      L.polyline(trajeto, { color: '#1D546D', weight: 10 }).addTo(this.camada);
      this.map.fitBounds(trajeto, { padding: [30, 30] });

      const { data: viagens } = await supabase.from('Viagem').select('viagem_id').eq('rota_id', rota.rota_id);
      if (!viagens?.length) return;

      const { data: eventos } = await supabase.from('Eventos').select('*').in('viagem_id', viagens.map((v) => v.viagem_id));
      for (const ev of eventos ?? []) {
        if (!ev.latitude_evento || !ev.longitude_evento) continue;
        const quando = ev.horario_evento ? new Date(ev.horario_evento).toLocaleString() : '';
        L.marker([ev.latitude_evento, ev.longitude_evento], { icon: this.escolherIcone(ev.tipo_evento) })
          .bindPopup(`<strong>${esc((ev.tipo_evento ?? '').toUpperCase())}</strong><br>${esc(ev.classificacao_evento)}<br>${esc(quando)}`)
          .addTo(this.camada);
      }
    } catch (err) {
      console.error('Erro:', err);
    }
  }

  ngOnDestroy() { this.map?.remove(); }
}
