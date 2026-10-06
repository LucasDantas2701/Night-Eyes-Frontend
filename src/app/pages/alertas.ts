import { Component, OnInit, computed, signal } from '@angular/core';
import { supabase } from '../core/supabase.client';
import { IconComponent } from '../shared/icon.component';
import { IconName } from '../shared/icons';
import { PaginationComponent } from '../shared/pagination.component';

const SEVERIDADE_MAP: Record<string, { badge: string; dot: string; weight: number }> = {
  critico: { badge: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500', weight: 5 },
  alto: { badge: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500', weight: 4 },
  moderado: { badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', weight: 3 },
  baixo: { badge: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500', weight: 1 },
};

const TIPO_MAP: Record<string, { label: string; icon: IconName }> = {
  fadiga: { label: 'Fadiga', icon: 'eyeOff' },
  distracao: { label: 'Distração', icon: 'eye' },
  celular: { label: 'Uso de Celular', icon: 'phone' },
  'rosto não detectado': { label: 'Rosto não detectado', icon: 'alert' },
};

interface Alerta {
  id: number; viagemId: number; severidade: string; motorista: string; rota: string;
  tipo: string; dataHora: string; dataHoraRaw: string; tempoViagem: string;
}
type Sort = 'recent' | 'oldest' | 'critical';
const LABELS: Record<Sort, string> = { recent: 'Mais Recentes', oldest: 'Mais Antigos', critical: 'Mais Críticos' };

@Component({
  selector: 'ne-alertas',
  imports: [IconComponent, PaginationComponent],
  template: `
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Alertas</h1>
        <p class="text-gray-500 mt-1 font-medium">Eventos de risco detectados em tempo real</p>
      </div>

      <div class="mb-8 flex flex-wrap gap-3">
        @for (opt of opts; track opt) {
          <button (click)="sortBy.set(opt); pagina.set(1)"
                  class="rounded-xl px-6 py-2 font-semibold transition-all border"
                  [class]="sortBy() === opt ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm border-transparent' : 'text-gray-600 border-gray-200 hover:bg-gray-50'">
            {{ labels[opt] }}
          </button>
        }
        <button class="p-2 rounded-xl hover:bg-gray-100" (click)="fetchAlertas()" [disabled]="refreshing()" aria-label="Atualizar">
          <ne-icon name="refresh" [size]="20" class="text-gray-400" [class.animate-spin]="refreshing()" />
        </button>
      </div>

      <div class="grid gap-4">
        @if (loading()) {
          @for (i of [1,2,3,4,5,6]; track i) { <div class="h-20 animate-pulse bg-gray-50 rounded-2xl border border-gray-100"></div> }
        } @else if (exibidos().itens.length > 0) {
          @for (a of exibidos().itens; track a.id) {
            <div class="rounded-2xl shadow-sm ring-1 ring-gray-100 p-5 bg-white hover:shadow-lg transition-all group overflow-hidden">
              <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                <div class="flex items-center gap-3 min-w-[120px]">
                  <div class="w-2.5 h-2.5 rounded-full" [class]="sev(a.severidade).dot"></div>
                  <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider" [class]="sev(a.severidade).badge">{{ a.severidade }}</span>
                </div>

                <div class="flex items-center gap-3 text-gray-700 min-w-[160px]">
                  <div class="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-blue-500 transition-colors">
                    <ne-icon [name]="tipo(a.tipo).icon" [size]="16" />
                  </div>
                  <span class="text-sm font-semibold">{{ tipo(a.tipo).label }}</span>
                </div>

                <div class="flex items-center gap-3 flex-1">
                  <div class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-50"><ne-icon name="user" [size]="18" /></div>
                  <div>
                    <p class="text-sm font-bold text-gray-900">{{ a.motorista }}</p>
                    <p class="text-[11px] text-gray-400 font-medium">Viagem #{{ a.viagemId }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 text-gray-600 flex-1">
                  <ne-icon name="mapPin" [size]="16" class="text-blue-400" />
                  <p class="text-sm font-medium truncate max-w-[200px]">{{ a.rota }}</p>
                </div>

                <div class="flex items-center gap-6 text-sm text-gray-500 border-l pl-6 border-gray-100">
                  <div class="flex items-center gap-2"><ne-icon name="clock" [size]="16" class="text-gray-400" /><span class="font-mono font-medium">{{ a.dataHora }}</span></div>
                  <div class="text-right min-w-[70px]">
                    <p class="text-[9px] uppercase font-bold text-gray-300 tracking-tighter">Duração</p>
                    <p class="font-bold text-gray-700">{{ a.tempoViagem }}</p>
                  </div>
                </div>
              </div>
            </div>
          }
        } @else {
          <div class="text-center py-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl">
            <ne-icon name="alert" [size]="48" class="text-gray-300 mx-auto mb-4" />
            <p class="text-gray-400 font-medium">Nenhum evento detectado neste período.</p>
          </div>
        }
      </div>

      @if (!loading()) { <ne-pagination [page]="pagina()" [total]="exibidos().total" (pageChange)="pagina.set($event)" /> }
    </div>
  `,
})
export class Alertas implements OnInit {
  readonly porPagina = 6;
  opts: Sort[] = ['recent', 'oldest', 'critical'];
  labels = LABELS;

  alertas = signal<Alerta[]>([]);
  loading = signal(true);
  refreshing = signal(false);
  sortBy = signal<Sort>('recent');
  pagina = signal(1);

  sev = (s: string) => SEVERIDADE_MAP[s] ?? SEVERIDADE_MAP['baixo'];
  tipo = (t: string) => TIPO_MAP[t] ?? { label: 'Evento', icon: 'alert' as IconName };

  ngOnInit() { this.fetchAlertas(); }

  async fetchAlertas() {
    this.refreshing.set(true);
    try {
      const agora = new Date();
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString();

      const { data, error } = await supabase
        .from('Eventos')
        .select(`
          eventos_id, tipo_evento, classificacao_evento, horario_evento,
          Viagem!inner( viagem_id, comeco_viagem, fim_viagem, Rota!inner(nome_origem, nome_destino) ),
          Funcionario!inner(nome)
        `)
        .gte('horario_evento', inicioMes)
        .lte('horario_evento', agora.toISOString());

      if (error) throw error;

      this.alertas.set((data || []).map((e: any): Alerta => {
        const comeco = e.Viagem?.comeco_viagem;
        const fim = e.Viagem?.fim_viagem;
        let tempo = '—';
        if (comeco && fim) {
          const d = new Date(fim).getTime() - new Date(comeco).getTime();
          tempo = `${Math.floor(d / 3600000)}h ${Math.floor((d / 60000) % 60)}min`;
        }

        const tipoRaw = e.tipo_evento?.trim().toLowerCase();
        const sevRaw = e.classificacao_evento?.trim().toLowerCase();
        const sevNorm = sevRaw === 'medio' ? 'moderado' : sevRaw;

        return {
          id: e.eventos_id,
          viagemId: e.Viagem?.viagem_id,
          motorista: e.Funcionario?.nome || 'Desconhecido',
          rota: `${e.Viagem?.Rota?.nome_origem || 'N/A'} → ${e.Viagem?.Rota?.nome_destino || 'N/A'}`,
          severidade: sevNorm in SEVERIDADE_MAP ? sevNorm : 'baixo',
          tipo: tipoRaw === 'distração' ? 'distracao' : tipoRaw === 'uso de celular' ? 'celular' : tipoRaw,
          // Mantido o ajuste de -1h da versão React (fuso de Manaus)
          dataHora: new Date(new Date(e.horario_evento).getTime() - 3600000).toLocaleString('pt-BR', { timeZone: 'America/Manaus', hour12: false }),
          dataHoraRaw: e.horario_evento,
          tempoViagem: tempo,
        };
      }));
    } catch (err) {
      console.error('Erro ao buscar alertas:', err);
    } finally {
      this.refreshing.set(false);
      this.loading.set(false);
    }
  }

  exibidos = computed(() => {
    const by = this.sortBy();
    const sorted = [...this.alertas()].sort((a, b) => {
      if (by === 'recent') return new Date(b.dataHoraRaw).getTime() - new Date(a.dataHoraRaw).getTime();
      if (by === 'oldest') return new Date(a.dataHoraRaw).getTime() - new Date(b.dataHoraRaw).getTime();
      return (SEVERIDADE_MAP[b.severidade]?.weight || 0) - (SEVERIDADE_MAP[a.severidade]?.weight || 0);
    });
    const p = this.pagina();
    return { total: Math.ceil(sorted.length / this.porPagina), itens: sorted.slice((p - 1) * this.porPagina, p * this.porPagina) };
  });
}
