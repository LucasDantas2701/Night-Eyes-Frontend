import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { supabase } from '../core/supabase.client';
import { EventosService } from '../core/eventos.service';
import { ToastService } from '../core/toast.service';
import { IconComponent } from '../shared/icon.component';
import { ModalComponent } from '../shared/modal.component';

interface Func { id: number; nome: string; cargo: string; totalCorridas: number; totalEventos: number; }
type SortKey = keyof Func;

@Component({
  selector: 'ne-funcionarios',
  imports: [FormsModule, IconComponent, ModalComponent],
  template: `
    <div class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Funcionários</h1>
          <p class="text-gray-500 font-medium">Gestão de motoristas e indicadores de risco</p>
        </div>
        <button (click)="abrirCadastro()" class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-xl px-6 py-2 font-bold">
          <ne-icon name="plus" [size]="16" class="mr-2" /> Novo Funcionário
        </button>
      </div>

      <div class="rounded-2xl ring-1 ring-gray-200 overflow-hidden shadow-sm bg-white overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50/50 text-left">
              @for (col of cols; track col.key) {
                <th (click)="toggleSort(col.key)" class="cursor-pointer select-none py-3 px-4 group" [class]="col.cls">
                  <div class="flex items-center text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-blue-600 transition-colors"
                       [class.justify-center]="col.center">
                    {{ col.label }}
                    @if (sort().key === col.key) { <ne-icon [name]="sort().dir === 'asc' ? 'arrowUp' : 'arrowDown'" [size]="12" class="ml-1" /> }
                  </div>
                </th>
              }
              <th class="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-4">Cargo</th>
              <th class="w-16"></th>
            </tr>
          </thead>
          <tbody>
            @if (loading()) {
              @for (i of [1,2,3,4,5]; track i) {
                <tr class="animate-pulse">
                  <td class="pl-6 py-4"><div class="h-4 w-8 bg-gray-200 rounded"></div></td>
                  <td><div class="h-4 w-32 bg-gray-200 rounded"></div></td>
                  <td><div class="h-4 w-12 bg-gray-200 rounded mx-auto"></div></td>
                  <td><div class="h-6 w-10 bg-gray-200 rounded-lg mx-auto"></div></td>
                  <td><div class="h-4 w-24 bg-gray-200 rounded"></div></td>
                  <td></td>
                </tr>
              }
            } @else if (pagina_itens().length > 0) {
              @for (f of pagina_itens(); track f.id) {
                <tr class="hover:bg-blue-50/30 group transition-colors border-t border-gray-100">
                  <td class="pl-6 py-4 font-mono text-[10px] text-gray-400">#{{ f.id }}</td>
                  <td class="px-4 font-bold text-gray-900">{{ f.nome }}</td>
                  <td class="px-4 text-center text-gray-600 font-medium">{{ f.totalCorridas }}</td>
                  <td class="px-4 text-center">
                    <span class="px-2.5 py-1 rounded-lg text-xs font-bold border"
                          [class]="f.totalEventos > 10 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'">{{ f.totalEventos }}</span>
                  </td>
                  <td class="px-4 text-gray-500 text-sm font-medium">{{ f.cargo }}</td>
                  <td class="pr-4">
                    <button (click)="abrirEdicao(f)" class="opacity-0 group-hover:opacity-100 rounded-full p-2 text-blue-500 hover:bg-blue-100 transition-all" aria-label="Editar">
                      <ne-icon name="pencil" [size]="16" />
                    </button>
                  </td>
                </tr>
              }
            } @else {
              <tr><td colspan="6" class="h-40 text-center text-gray-400 font-medium">Nenhum funcionário encontrado.</td></tr>
            }
          </tbody>
        </table>
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
        <p class="text-sm text-gray-400 font-bold">Mostrando {{ pagina_itens().length }} de {{ funcionarios().length }} motoristas</p>
        <div class="flex gap-1">
          <button (click)="pagina.set(pagina() - 1)" [disabled]="pagina() === 1"
                  class="rounded-lg px-4 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-sm disabled:opacity-40">Anterior</button>
          <div class="flex items-center px-4 text-sm font-black text-blue-600 bg-blue-50 rounded-lg border border-blue-100">{{ pagina() }} / {{ totalPaginas() || 1 }}</div>
          <button (click)="pagina.set(pagina() + 1)" [disabled]="pagina() >= totalPaginas()"
                  class="rounded-lg px-4 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-sm disabled:opacity-40">Próxima</button>
        </div>
      </div>
    </div>

    <ne-modal [open]="modal() !== null" [title]="modal() === 'cadastro' ? 'Cadastrar Motorista' : 'Editar Funcionário'" (closed)="modal.set(null)">
      <div class="space-y-4 pt-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">{{ modal() === 'cadastro' ? 'Nome Completo' : 'Nome' }}</label>
          <input [(ngModel)]="form.nome" placeholder="Ex: João Silva" class="w-full rounded-xl border px-3 py-2" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">{{ modal() === 'cadastro' ? 'Cargo / Função' : 'Cargo' }}</label>
          <input [(ngModel)]="form.cargo" placeholder="Ex: Motorista de Carreta" class="w-full rounded-xl border px-3 py-2" />
        </div>
        <div class="flex gap-2 pt-2">
          <button (click)="salvar()" [disabled]="enviando()" class="flex-1 bg-blue-600 text-white rounded-xl font-bold py-2 disabled:opacity-60">
            {{ enviando() ? 'Enviando...' : modal() === 'cadastro' ? 'Salvar Funcionário' : 'Atualizar Dados' }}
          </button>
          @if (modal() === 'edicao') {
            <button (click)="excluir()" class="rounded-xl bg-red-600 text-white p-3 hover:bg-red-700" aria-label="Excluir"><ne-icon name="trash" [size]="16" /></button>
          }
        </div>
      </div>
    </ne-modal>
  `,
})
export class Funcionarios implements OnInit {
  private eventos = inject(EventosService);
  private toast = inject(ToastService);
  readonly porPagina = 10;

  cols: { key: SortKey; label: string; cls: string; center: boolean }[] = [
    { key: 'id', label: 'ID', cls: 'pl-6 w-24', center: false },
    { key: 'nome', label: 'Nome', cls: '', center: false },
    { key: 'totalCorridas', label: 'Corridas', cls: 'text-center', center: true },
    { key: 'totalEventos', label: 'Alertas', cls: 'text-center', center: true },
  ];

  funcionarios = signal<Func[]>([]);
  loading = signal(true);
  enviando = signal(false);
  sort = signal<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'nome', dir: 'asc' });
  tipoFiltro = signal('todos');
  modal = signal<'cadastro' | 'edicao' | null>(null);
  pagina = signal(1);
  form = { id: 0, nome: '', cargo: '' };

  ordenados = computed(() => {
    const { key, dir } = this.sort();
    return [...this.funcionarios()].sort((a, b) => {
      const x = a[key], y = b[key];
      if (typeof x === 'number' && typeof y === 'number') return dir === 'asc' ? x - y : y - x;
      return dir === 'asc' ? String(x).localeCompare(String(y)) : String(y).localeCompare(String(x));
    });
  });
  pagina_itens = computed(() => { const i = (this.pagina() - 1) * this.porPagina; return this.ordenados().slice(i, i + this.porPagina); });
  totalPaginas = computed(() => Math.ceil(this.ordenados().length / this.porPagina));

  ngOnInit() { this.carregar(); }

  async carregar() {
    this.loading.set(true);
    try {
      const now = new Date();
      const inicio = new Date(now.getFullYear(), now.getMonth(), 1);
      const fim = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const { data, error } = await supabase
        .from('Funcionario')
        .select(`funcionario_id, nome, cargo, Viagem ( viagem_id, comeco_viagem )`)
        .gte('Viagem.comeco_viagem', inicio.toISOString())
        .lt('Viagem.comeco_viagem', fim.toISOString());
      if (error) throw error;

      const porFunc = await this.eventos.getEventosPorFuncionarioMesAtual(this.tipoFiltro());
      const mapa: Record<string, number> = {};
      porFunc.forEach((e) => (mapa[e.nome] = e.total));

      this.funcionarios.set((data || []).map((f: any): Func => ({
        id: f.funcionario_id, nome: f.nome, cargo: f.cargo || 'Não informado',
        totalCorridas: f.Viagem?.length || 0, totalEventos: mapa[f.nome] || 0,
      })));
    } catch {
      this.toast.error('Erro ao carregar dados');
    } finally {
      this.loading.set(false);
    }
  }

  toggleSort(key: SortKey) {
    const cur = this.sort();
    this.sort.set({ key, dir: cur.key === key && cur.dir === 'asc' ? 'desc' : 'asc' });
  }

  abrirCadastro() { this.form = { id: 0, nome: '', cargo: '' }; this.modal.set('cadastro'); }
  abrirEdicao(f: Func) { this.form = { id: f.id, nome: f.nome, cargo: f.cargo }; this.modal.set('edicao'); }

  async salvar() {
    if (!this.form.nome.trim()) return this.toast.error('Nome é obrigatório');
    this.enviando.set(true);
    const payload = { nome: this.form.nome, cargo: this.form.cargo || null };

    const { error } = this.modal() === 'cadastro'
      ? await supabase.from('Funcionario').insert(payload)
      : await supabase.from('Funcionario').update(payload).eq('funcionario_id', this.form.id);

    this.enviando.set(false);
    if (error) return this.toast.error('Erro na operação');
    this.toast.success('Sucesso!');
    this.modal.set(null);
    this.carregar();
  }

  async excluir() {
    if (!confirm('Deseja excluir este motorista permanentemente?')) return;
    const { error } = await supabase.from('Funcionario').delete().eq('funcionario_id', this.form.id);
    if (error) return this.toast.error('Erro ao excluir');
    this.toast.success('Removido com sucesso');
    this.modal.set(null);
    this.carregar();
  }
}
