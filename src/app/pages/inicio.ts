import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { EventosService } from '../core/eventos.service';
import { ViagemService } from '../core/viagem.service';
import { FuncionarioService } from '../core/funcionario.service';
import { ChartComponent } from '../shared/chart.component';
import { IconComponent } from '../shared/icon.component';
import { IconName } from '../shared/icons';

const calcularAnterior = (atual: number, percTexto: string) => {
  const perc = parseFloat(percTexto?.replace('%', '')) || 0;
  return atual / (1 + perc / 100);
};

const formatarPercentual = (texto?: string) => {
  if (!texto || texto.includes('Infinity') || texto.includes('∞')) return null;
  const num = parseFloat(texto.replace('%', ''));
  return isNaN(num) ? null : `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
};
const sinal = (texto?: string) => (texto ? parseFloat(texto.replace('%', '')) : 0);
const isPositivo = (t?: string) => sinal(t) > 0;
const isNegativo = (t?: string) => sinal(t) < 0;

const NOMES_FORMATADOS: Record<string, { singular: string; plural: string }> = {
  'Distração': { singular: 'Evento de distração', plural: 'Eventos de distrações' },
  'Uso de celular': { singular: 'Evento de uso de celular', plural: 'Eventos de uso de celular' },
  'Fadiga': { singular: 'Evento de fadiga', plural: 'Eventos de fadigas' },
  'Rosto não detectado': { singular: 'Evento de rosto não detectado', plural: 'Eventos de rostos não detectados' },
};

interface Card { title: string; value: number; icon: IconName; perc: string | null; cor: string; }

@Component({
  selector: 'ne-inicio',
  imports: [ChartComponent, IconComponent],
  template: `
    <div class="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Painel de Controle</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (card of statsCards(); track card.title) {
          <div class="p-6 bg-white rounded-2xl shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm text-gray-500">{{ card.title }}</p>
              <ne-icon [name]="card.icon" [size]="20" class="text-gray-400" />
            </div>
            <h2 class="text-3xl font-bold">{{ card.value }}</h2>
            @if (card.perc) {
              <p class="text-sm mt-1 font-medium" [class]="card.cor">{{ card.perc }}</p>
            }
          </div>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="p-6 rounded-2xl bg-white shadow-sm">
          <h3 class="font-bold mb-4">Pareto de Eventos</h3>
          <ne-chart [config]="paretoChart()" />
        </div>

        <div class="p-6 rounded-2xl bg-white shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold">Funcionários mais recorrentes</h3>
            <select class="border rounded-lg px-3 py-1 text-sm" [value]="tipoFiltro()" (change)="mudarFiltro($any($event.target).value)">
              <option value="todos">Todos</option>
              @for (tipo of tiposUnicos(); track tipo) {
                <option [value]="tipo">{{ tipo }}</option>
              }
            </select>
          </div>
          <ne-chart [config]="funcionariosChart()" />
        </div>
      </div>
    </div>
  `,
})
export class Inicio implements OnInit {
  private viagens = inject(ViagemService);
  private eventos = inject(EventosService);
  private funcionarios = inject(FuncionarioService);

  loading = signal(true);
  tipoFiltro = signal('todos');

  dashboard = signal({
    viagens: 0, percViagens: { texto: '', cor: '' },
    eventos: 0, percEventos: { texto: '', cor: '' },
    funcionarios: 0, mediaEventos: 0, percMedia: { texto: '', cor: '' },
    pareto: [] as { tipo: string; quantidade: number; acumulado: number }[],
    funcionariosTop: [] as { nome: string; eventos: number }[],
  });

  ngOnInit() { this.carregar(); }

  mudarFiltro(valor: string) {
    this.tipoFiltro.set(valor);
    this.carregar();
  }

  async carregar() {
    this.loading.set(true);
    try {
      const [vAtual, vPerc, eAtual, ePerc, funcs, eventosTipo, eventosFunc] = await Promise.all([
        this.viagens.getViagensNoMesAtual(),
        this.viagens.getPorcentagemMudancaViagens(),
        this.eventos.getEventosNoMesAtual(),
        this.eventos.getPorcentagemMudancaEventos(),
        this.funcionarios.getTotalFuncionariosAtivos(),
        this.eventos.getEventosPorTipoMesAtual(),
        this.eventos.getEventosPorFuncionarioMesAtual(this.tipoFiltro()),
      ]);

      const mediaAtual = vAtual ? eAtual / vAtual : 0;
      const vAnterior = calcularAnterior(vAtual, vPerc.texto);
      const eAnterior = calcularAnterior(eAtual, ePerc.texto);
      const mediaAnterior = vAnterior > 0 ? eAnterior / vAnterior : 0;
      const diffMedia = mediaAtual - mediaAnterior;
      const percMediaTexto = mediaAnterior === 0
        ? '0%'
        : `${diffMedia >= 0 ? '+' : '-'}${Math.abs((diffMedia / mediaAnterior) * 100).toFixed(1)}%`;

      const totalEventos = eventosTipo.reduce((acc, e) => acc + e.total, 0);
      let acumulado = 0;
      const pareto = [...eventosTipo]
        .sort((a, b) => b.total - a.total)
        .map((e) => {
          acumulado += totalEventos ? (e.total / totalEventos) * 100 : 0;
          return { tipo: e.tipo_evento, quantidade: e.total, acumulado: Number(acumulado.toFixed(1)) };
        });

      const funcionariosTop = [...eventosFunc]
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)
        .map((f) => ({ nome: f.nome, eventos: f.total }));

      this.dashboard.set({
        viagens: vAtual, percViagens: vPerc,
        eventos: eAtual, percEventos: ePerc,
        funcionarios: funcs, mediaEventos: Number(mediaAtual.toFixed(2)),
        percMedia: { texto: percMediaTexto, cor: '' },
        pareto, funcionariosTop,
      });
    } catch (err) {
      console.error('Erro dashboard:', err);
    } finally {
      this.loading.set(false);
    }
  }

  // O filtro lista os tipos vistos no Pareto; ao filtrar, o Pareto não muda (mesma lógica do original)
  tiposUnicos = computed(() => [...new Set(this.dashboard().pareto.map((e) => e.tipo))]);

  statsCards = computed<Card[]>(() => {
    const d = this.dashboard();
    return [
      { title: 'Condutores', value: d.funcionarios, icon: 'users', perc: null, cor: '' },
      { title: 'Viagens (Mês)', value: d.viagens, icon: 'car',
        perc: formatarPercentual(d.percViagens.texto), cor: isPositivo(d.percViagens.texto) ? 'text-green-500' : 'text-red-500' },
      { title: 'Eventos (Mês)', value: d.eventos, icon: 'alert',
        perc: formatarPercentual(d.percEventos.texto), cor: isNegativo(d.percEventos.texto) ? 'text-green-500' : 'text-red-500' },
      { title: 'Média Eventos/Viagem', value: d.mediaEventos, icon: 'trendingUp',
        perc: formatarPercentual(d.percMedia.texto), cor: isNegativo(d.percMedia.texto) ? 'text-green-500' : 'text-red-500' },
    ];
  });

  paretoChart = computed<ChartConfiguration>(() => {
    const p = this.dashboard().pareto;
    return {
      type: 'bar',
      data: {
        labels: p.map((e) => e.tipo),
        datasets: [
          { type: 'bar', label: 'Quantidade', data: p.map((e) => e.quantidade), backgroundColor: '#3b82f6', borderRadius: 4, yAxisID: 'y' },
          { type: 'line', label: '% acumulado', data: p.map((e) => e.acumulado), borderColor: '#ef4444', backgroundColor: '#ef4444', borderWidth: 3, tension: 0.3, yAxisID: 'y1' },
        ],
      },
      options: {
        scales: {
          y: { position: 'left', beginAtZero: true },
          y1: { position: 'right', min: 0, max: 100, grid: { drawOnChartArea: false } },
        },
      },
    } as ChartConfiguration;
  });

  funcionariosChart = computed<ChartConfiguration>(() => {
    const top = this.dashboard().funcionariosTop;
    const filtro = this.tipoFiltro();
    return {
      type: 'bar',
      data: {
        labels: top.map((f) => f.nome),
        datasets: [{ label: 'Eventos', data: top.map((f) => f.eventos), backgroundColor: '#8b5cf6' }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const valor = ctx.parsed.y as number;
                let texto = 'eventos';
                if (filtro !== 'todos') {
                  const t = NOMES_FORMATADOS[filtro];
                  texto = t ? (valor === 1 ? t.singular : t.plural) : filtro;
                }
                return `${valor} ${texto}`;
              },
            },
          },
        },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    } as ChartConfiguration;
  });
}
