import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../core/supabase.client';
import { ViagemService } from '../core/viagem.service';
import { EVENT_CONFIG, Evento, TipoEvento } from '../core/models';
import { IconComponent } from '../shared/icon.component';
import { MapaEventosComponent } from '../shared/mapa-eventos.component';

@Component({
  selector: 'ne-detalhes-corrida',
  imports: [IconComponent, MapaEventosComponent],
  template: `
    @if (!corrida() || !funcionario()) {
      <div class="p-8 text-gray-500">Carregando...</div>
    } @else {
      <div class="p-6 max-w-7xl mx-auto space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <button (click)="voltar()" class="pl-0 text-gray-500 font-bold inline-flex items-center">
              <ne-icon name="arrowLeft" [size]="16" class="mr-2" /> Voltar para Corridas
            </button>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">{{ corrida().rota }}</h1>
            <div class="flex gap-4 text-gray-400 text-sm font-bold uppercase tracking-wider flex-wrap">
              <span class="flex items-center gap-1.5"><ne-icon name="calendar" [size]="16" class="text-blue-500" /> {{ corrida().data }}</span>
              <span class="flex items-center gap-1.5"><ne-icon name="clock" [size]="16" class="text-blue-500" /> {{ corrida().duracao }}</span>
              <span class="flex items-center gap-1.5"><ne-icon name="route" [size]="16" class="text-blue-500" /> {{ corrida().distancia }}</span>
              <span class="flex items-center gap-1.5"><ne-icon name="hash" [size]="16" class="text-blue-500" /> id:{{ corrida().id }}</span>
            </div>
          </div>

          <div class="p-4 bg-white ring-1 ring-gray-100 shadow-sm rounded-2xl flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><ne-icon name="user" [size]="20" /></div>
            <div>
              <p class="text-sm font-black text-gray-900 leading-none">{{ funcionario().nome }}</p>
              <p class="text-[10px] text-gray-400 font-bold uppercase mt-1">{{ funcionario().cargo }}</p>
            </div>
          </div>

          @if (corrida().status === 'andamento') {
            <button (click)="finalizar()" class="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-4 py-2">Finalizar corrida</button>
          }
        </div>

        <div class="overflow-hidden ring-1 ring-gray-200 shadow-lg rounded-3xl h-[300px] bg-white">
          <ne-mapa-eventos [eventos]="eventos()" [selecionado]="selecionado()" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 p-6 bg-white ring-1 ring-gray-200 shadow-sm rounded-2xl">
            <h2 class="font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-tighter">
              <ne-icon name="activity" [size]="20" class="text-blue-600" /> Linha do Tempo de Segurança
            </h2>

            @if (eventos().length === 0) {
              <p class="text-sm text-gray-400 font-bold uppercase tracking-wider mb-6">Não houve nenhum evento nesta viagem</p>
            } @else {
              <div class="relative space-y-2 pl-4">
                <div class="absolute left-[27px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                @for (e of visiveis(); track e.id) {
                  <div (click)="selecionar(e)"
                       class="relative flex items-center gap-6 p-3 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group border border-transparent hover:border-gray-100">
                    <span class="text-[12px] font-black text-gray-400 min-w-[45px]">{{ e.horario }}</span>
                    <div class="relative z-10 p-2.5 rounded-xl border shadow-sm transition-transform group-hover:rotate-12" [class]="cfg(e.tipo).color">
                      <ne-icon [name]="cfg(e.tipo).icon" [size]="16" />
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-black text-gray-800">{{ cfg(e.tipo).label }}</p>
                      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Coordenadas: {{ e.localizacao }}</p>
                    </div>
                  </div>
                }
              </div>
            }

            @if (limite() < eventos().length) {
              <button (click)="limite.set(limite() + 20)"
                      class="w-full mt-6 rounded-xl font-black text-xs uppercase tracking-widest border border-gray-200 text-gray-500 hover:bg-gray-50 py-2">
                Carregar mais {{ eventos().length - limite() }} alertas
              </button>
            }
          </div>

          <div class="space-y-6">
            <div class="p-6 bg-white ring-1 ring-gray-200 shadow-sm rounded-2xl">
              <h2 class="font-black text-gray-900 mb-6 text-sm uppercase tracking-widest">Distribuição de Riscos</h2>
              <div class="space-y-5">
                @for (item of distribuicao(); track item.label) {
                  <div>
                    <div class="flex justify-between text-[11px] font-black uppercase mb-1.5">
                      <span [class]="item.text">{{ item.label }}</span>
                      <span class="text-gray-900">{{ item.count }} un</span>
                    </div>
                    <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div class="h-full transition-all duration-500" [class]="item.color" [style.width.%]="item.pct"></div>
                    </div>
                  </div>
                }
              </div>
              <div class="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Total de Eventos</p>
                <p class="text-2xl font-black text-gray-900">{{ eventos().length }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class DetalhesCorrida {
  private router = inject(Router);
  private viagens = inject(ViagemService);

  /** Parâmetro :id da rota (via withComponentInputBinding) */
  id = input.required<string>();

  corrida = signal<any>(null);
  funcionario = signal<any>(null);
  eventos = signal<Evento[]>([]);
  selecionado = signal<Evento | null>(null);
  limite = signal(4);

  constructor() {
    effect(() => { this.carregar(this.id()); });
  }

  cfg = (t: TipoEvento) => EVENT_CONFIG[t];

  async carregar(id: string) {
    const data = await this.viagens.getViagemById(id);
    if (!data) return;

    const inicio = new Date(data.comeco_viagem);
    const fim = data.fim_viagem ? new Date(data.fim_viagem) : null;
    let duracao = 'Em andamento';
    if (fim) {
      const min = Math.floor((fim.getTime() - inicio.getTime()) / 60000);
      duracao = `${Math.floor(min / 60)}h ${min % 60}min`;
    }

    const rota = Array.isArray(data.Rota) ? data.Rota[0] : data.Rota;
    const func = Array.isArray(data.Funcionario) ? data.Funcionario[0] : data.Funcionario;

    this.corrida.set({
      id: data.viagem_id,
      rota: `${rota?.nome_origem ?? 'Origem'} → ${rota?.nome_destino ?? 'Destino'}`,
      data: inicio.toLocaleDateString('pt-BR'),
      duracao,
      distancia: `${rota?.distancia_total ?? 0} km`,
      status: data.fim_viagem ? 'finalizada' : 'andamento',
    });
    this.funcionario.set({ nome: func?.nome ?? 'Desconhecido', cargo: func?.cargo ?? 'Motorista' });

    this.eventos.set((data.Eventos || []).map((e: any): Evento => {
      const tipoLimpo = e.tipo_evento?.trim().toLowerCase();
      return {
        id: e.eventos_id,
        tipo: (EVENT_CONFIG[tipoLimpo as TipoEvento] ? tipoLimpo : 'fadiga') as TipoEvento,
        horario: new Date(e.horario_evento).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Manaus' }),
        localizacao: `${e.latitude_evento}, ${e.longitude_evento}`,
      };
    }));
  }

  ordenados = computed(() => [...this.eventos()].sort((a, b) => a.horario.localeCompare(b.horario)));
  visiveis = computed(() => this.ordenados().slice(0, this.limite()));

  distribuicao = computed(() => {
    const ev = this.eventos();
    const total = ev.length;
    const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
    const n = (t: TipoEvento) => ev.filter((e) => e.tipo === t).length;
    return [
      { label: 'Fadiga', count: n('fadiga'), color: 'bg-purple-500', text: 'text-purple-600' },
      { label: 'Distração', count: n('distração'), color: 'bg-blue-500', text: 'text-blue-600' },
      { label: 'Celular', count: n('uso de celular'), color: 'bg-orange-500', text: 'text-orange-600' },
    ].map((i) => ({ ...i, pct: pct(i.count) }));
  });

  selecionar(e: Evento) {
    this.selecionado.set(e);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  voltar() { this.router.navigate(['/dashboard/corridas']); }

  async finalizar() {
    await supabase.from('Viagem').update({ fim_viagem: new Date().toISOString() }).eq('viagem_id', this.corrida().id);
    await this.carregar(this.id());
  }
}
