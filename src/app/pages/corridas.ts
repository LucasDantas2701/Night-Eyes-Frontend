import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { supabase } from '../core/supabase.client';
import { ToastService } from '../core/toast.service';
import { IconComponent } from '../shared/icon.component';
import { ModalComponent } from '../shared/modal.component';
import { PaginationComponent } from '../shared/pagination.component';

interface Corrida {
  id: number; data: string; timestamp: number; motorista: string; rota: string;
  duracao: string; duracaoMin: number; eventos: number; status: 'andamento' | 'finalizada';
}
type SortOption = 'recent' | 'oldest' | 'longest' | 'mostTiring';

const SORT_LABELS: Record<SortOption, string> = {
  recent: 'Mais Recentes', oldest: 'Mais Antigas', longest: 'Mais Longas', mostTiring: 'Mais Cansativas',
};

@Component({
  selector: 'ne-corridas',
  imports: [FormsModule, IconComponent, ModalComponent, PaginationComponent],
  template: `
    <div class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Corridas</h1>
          <p class="text-gray-500">Monitore o desempenho e fadiga em tempo real</p>
        </div>
        <button (click)="open.set(true)"
                class="inline-flex items-center gap-2 rounded-xl px-6 py-2 font-semibold bg-[#2979FF] text-white hover:opacity-90 transition-all">
          <ne-icon name="plus" [size]="16" /> Cadastrar Corrida
        </button>
      </div>

      <div class="flex flex-wrap gap-3 items-center">
        <div class="flex items-center bg-white border rounded-xl px-3">
          <ne-icon name="search" [size]="20" class="text-gray-400" />
          <input type="text" placeholder="Buscar..." class="ml-2 bg-transparent outline-none text-sm w-full py-2"
                 [ngModel]="searchText()" (ngModelChange)="searchText.set($event); pagina.set(1)" />
        </div>

        @for (opt of sortOptions; track opt) {
          <button (click)="sortBy.set(opt); pagina.set(1)"
                  class="rounded-xl px-6 py-2 font-semibold transition-all border"
                  [class]="sortBy() === opt ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm border-transparent' : 'text-gray-600 border-gray-200 hover:bg-gray-50'">
            {{ labels[opt] }}
          </button>
        }

        <button class="p-2 rounded-lg hover:bg-gray-100" (click)="refresh()" [disabled]="refreshing()" aria-label="Atualizar">
          <ne-icon name="refresh" [size]="20" class="text-gray-400" [class.animate-spin]="refreshing()" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @if (loading()) {
          @for (i of [1,2,3,4,5,6]; track i) { <div class="h-56 bg-gray-100 animate-pulse rounded-3xl"></div> }
        } @else {
          @for (c of exibidas().itens; track c.id) {
            <div (click)="abrir(c.id)"
                 class="p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer bg-white relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-1" [class]="c.status === 'andamento' ? 'bg-green-400' : 'bg-gray-200'"></div>

              <div class="flex items-center gap-2 mb-6">
                <div class="w-2 h-2 rounded-full" [class]="c.status === 'andamento' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"></div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">{{ c.status }}</span>
              </div>

              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <ne-icon name="mapPin" [size]="20" class="text-blue-300" />
                  <h3 class="font-semibold text-gray-800 line-clamp-1">{{ c.rota }}</h3>
                </div>
                <div class="flex items-center gap-3 text-sm text-gray-500">
                  <ne-icon name="user" [size]="16" /> <span>{{ c.motorista }}</span>
                </div>
                <div class="flex gap-4 text-xs text-gray-400 pt-2">
                  <div class="flex items-center gap-1"><ne-icon name="calendar" [size]="14" /> {{ c.data }}</div>
                  <div class="flex items-center gap-1"><ne-icon name="clock" [size]="14" /> {{ c.duracao }}</div>
                  <div class="flex items-center gap-1"><ne-icon name="hash" [size]="14" /> {{ c.id }}</div>
                </div>
              </div>

              <div class="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                <span class="text-xs text-gray-400">Eventos detectados</span>
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 rounded-lg text-sm font-bold"
                        [class]="c.eventos > 3 ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-600'">{{ c.eventos }}</span>
                  @if (c.eventos > 3) { <ne-icon name="alertCircle" [size]="16" class="text-red-400" /> }
                </div>
              </div>
            </div>
          }
        }
      </div>

      <ne-pagination [page]="pagina()" [total]="exibidas().total" (pageChange)="pagina.set($event)" />
    </div>

    <ne-modal [open]="open()" title="Nova Corrida" (closed)="open.set(false)">
      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Motorista</label>
          <select class="w-full rounded-xl border px-3 py-2 bg-white" [(ngModel)]="motoristaSel">
            <option value="">Selecione</option>
            @for (m of motoristas(); track m.funcionario_id) { <option [value]="m.funcionario_id">{{ m.nome }}</option> }
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Rota</label>
          <select class="w-full rounded-xl border px-3 py-2 bg-white" [(ngModel)]="rotaSel">
            <option value="">Selecione</option>
            @for (r of rotas(); track r.rota_id) { <option [value]="r.rota_id">{{ r.nome_rota }}</option> }
          </select>
        </div>
        <button (click)="criar()" class="w-full bg-blue-400 text-white rounded-xl mt-4 py-2 hover:bg-blue-500">Iniciar Viagem</button>
      </div>
    </ne-modal>
  `,
})
export class Corridas implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly porPagina = 6;
  sortOptions: SortOption[] = ['recent', 'oldest', 'longest', 'mostTiring'];
  labels = SORT_LABELS;

  loading = signal(true);
  refreshing = signal(false);
  open = signal(false);
  corridas = signal<Corrida[]>([]);
  motoristas = signal<any[]>([]);
  rotas = signal<any[]>([]);
  sortBy = signal<SortOption>('recent');
  searchText = signal('');
  pagina = signal(1);
  motoristaSel = '';
  rotaSel = '';

  async ngOnInit() {
    await Promise.all([this.fetchCorridas(), this.fetchMotoristas(), this.fetchRotas()]);
    this.loading.set(false);
  }

  private async fetchMotoristas() {
    const { data } = await supabase.from('Funcionario').select('funcionario_id, nome');
    if (data) this.motoristas.set(data);
  }

  private async fetchRotas() {
    const { data } = await supabase.from('Rota').select('rota_id, nome_rota');
    if (data) this.rotas.set(data);
  }

  async fetchCorridas() {
    const now = new Date();
    const inicio = new Date(now.getFullYear(), now.getMonth(), 1);
    const fim = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const { data } = await supabase
      .from('Viagem')
      .select(`viagem_id, comeco_viagem, fim_viagem, Funcionario(nome), Rota(nome_origem, nome_destino), Eventos(eventos_id)`)
      .gte('comeco_viagem', inicio.toISOString())
      .lt('comeco_viagem', fim.toISOString())
      .order('comeco_viagem', { ascending: false });

    if (!data) return;

    this.corridas.set(data.map((v: any): Corrida => {
      const start = new Date(v.comeco_viagem).getTime();
      const end = v.fim_viagem ? new Date(v.fim_viagem).getTime() : Date.now();
      const diffMin = Math.max(0, Math.floor((end - start) / 60000));
      return {
        id: v.viagem_id,
        data: new Date(v.comeco_viagem).toLocaleDateString('pt-BR'),
        timestamp: start,
        motorista: v.Funcionario?.nome ?? 'Desconhecido',
        rota: `${v.Rota?.nome_origem || 'N/A'} → ${v.Rota?.nome_destino || 'N/A'}`,
        duracao: `${Math.floor(diffMin / 60)}h ${diffMin % 60}min`,
        duracaoMin: diffMin,
        eventos: v.Eventos?.length ?? 0,
        status: v.fim_viagem ? 'finalizada' : 'andamento',
      };
    }));
  }

  processadas = computed(() => {
    const busca = this.searchText().toLowerCase();
    const filtradas = this.corridas().filter((c) =>
      c.motorista.toLowerCase().includes(busca) || c.rota.toLowerCase().includes(busca) || c.data.includes(busca));

    const sorters: Record<SortOption, (a: Corrida, b: Corrida) => number> = {
      recent: (a, b) => b.timestamp - a.timestamp,
      oldest: (a, b) => a.timestamp - b.timestamp,
      longest: (a, b) => b.duracaoMin - a.duracaoMin,
      mostTiring: (a, b) => b.eventos - a.eventos,
    };
    return filtradas.sort(sorters[this.sortBy()]);
  });

  exibidas = computed(() => {
    const lista = this.processadas();
    const p = this.pagina();
    return { total: Math.ceil(lista.length / this.porPagina), itens: lista.slice((p - 1) * this.porPagina, p * this.porPagina) };
  });

  abrir(id: number) { this.router.navigate(['/dashboard/corridas', id]); }

  async criar() {
    if (!this.motoristaSel || !this.rotaSel) return this.toast.error('Preencha todos os campos');

    const { error } = await supabase.from('Viagem').insert({
      funcionario_id: Number(this.motoristaSel),
      rota_id: Number(this.rotaSel),
      comeco_viagem: new Date().toISOString(),
    });
    if (error) return this.toast.error('Erro ao criar corrida');

    this.toast.success('Corrida iniciada!');
    this.open.set(false);
    this.fetchCorridas();
  }

  async refresh() {
    this.refreshing.set(true);
    await this.fetchCorridas();
    this.refreshing.set(false);
  }
}
