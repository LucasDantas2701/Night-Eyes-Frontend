import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';
import { Percentual } from './models';

const inicioDoMes = (offset = 0) => new Date(new Date().getFullYear(), new Date().getMonth() + offset, 1).toISOString();

@Injectable({ providedIn: 'root' })
export class EventosService {
  /** Total de eventos no mês atual */
  async getEventosNoMesAtual(): Promise<number> {
    const { count, error } = await supabase
      .from('Eventos')
      .select('*', { count: 'exact' })
      .gte('horario_evento', inicioDoMes())
      .lte('horario_evento', new Date().toISOString());

    if (error) {
      console.error('Erro ao buscar total de eventos:', error.message);
      return 0;
    }
    return count || 0;
  }

  /** Variação percentual dos eventos em relação ao mês anterior */
  async getPorcentagemMudancaEventos(): Promise<Percentual> {
    const inicioAtual = inicioDoMes();
    const inicioAnterior = inicioDoMes(-1);

    const { count: countAtual } = await supabase
      .from('Eventos').select('*', { count: 'exact' })
      .gte('horario_evento', inicioAtual).lte('horario_evento', new Date().toISOString());

    const { count: countAnterior } = await supabase
      .from('Eventos').select('*', { count: 'exact' })
      .gte('horario_evento', inicioAnterior).lt('horario_evento', inicioAtual);

    const atual = countAtual || 0;
    const anterior = countAnterior || 0;

    if (anterior === 0) return { texto: atual === 0 ? '0%' : '∞%', cor: 'text-green-500' };

    const pct = ((atual - anterior) / anterior) * 100;
    return pct >= 0
      ? { texto: `+${pct.toFixed(1)}%`, cor: 'text-green-500' }
      : { texto: `−${Math.abs(pct).toFixed(1)}%`, cor: 'text-red-500' };
  }

  /** Eventos agrupados por tipo no mês atual */
  async getEventosPorTipoMesAtual(): Promise<{ tipo_evento: string; total: number }[]> {
    const { data, error } = await supabase
      .from('Eventos')
      .select('tipo_evento, eventos_id')
      .gte('horario_evento', inicioDoMes())
      .lte('horario_evento', new Date().toISOString());

    if (error) {
      console.error('Erro ao buscar eventos por tipo:', error.message);
      return [];
    }

    const count: Record<string, number> = {};
    data?.forEach((e: any) => {
      const tipo = e.tipo_evento || 'Desconhecido';
      count[tipo] = (count[tipo] || 0) + 1;
    });
    return Object.entries(count).map(([tipo_evento, total]) => ({ tipo_evento, total }));
  }

  /** Eventos agrupados por funcionário no mês atual (filtro opcional por tipo) */
  async getEventosPorFuncionarioMesAtual(tipo?: string): Promise<{ nome: string; total: number }[]> {
    let query = supabase
      .from('Eventos')
      .select('eventos_id, tipo_evento, Funcionario(nome)')
      .gte('horario_evento', inicioDoMes())
      .lte('horario_evento', new Date().toISOString());

    if (tipo && tipo !== 'todos') query = query.eq('tipo_evento', tipo);

    const { data, error } = await query;
    if (error) {
      console.error(error);
      return [];
    }

    const count: Record<string, number> = {};
    data?.forEach((e: any) => {
      const nome = e.Funcionario?.nome || 'Sem nome';
      count[nome] = (count[nome] || 0) + 1;
    });
    return Object.entries(count).map(([nome, total]) => ({ nome, total }));
  }
}
