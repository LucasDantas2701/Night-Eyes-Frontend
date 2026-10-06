import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';
import { Percentual } from './models';

export interface ViagensPorMes { mes: string; total: number; }

@Injectable({ providedIn: 'root' })
export class ViagemService {
  async getViagens() {
    const { data, error } = await supabase
      .from('Viagem')
      .select(`viagem_id, comeco_viagem, fim_viagem, Funcionario ( nome ), Rota ( nome_rota ), Eventos ( eventos_id )`);
    if (error) {
      console.error('Erro ao buscar viagens:', error.message);
      return [];
    }
    return data || [];
  }

  /** Viagens por mês (função RPC `viagens_por_mes` no Supabase) */
  async getViagensPorMes(): Promise<ViagensPorMes[]> {
    const { data, error } = await supabase.rpc('viagens_por_mes');
    if (error) {
      console.error('Erro ao buscar viagens por mês:', error.message);
      return [];
    }
    return (data as any[]).map((d) => ({ mes: d.mes, total: Number(d.total) }));
  }

  async getViagensNoMesAtual(): Promise<number> {
    const porMes = await this.getViagensPorMes();
    const mesAtual = new Date().toISOString().slice(0, 7);
    return porMes.find((v) => v.mes === mesAtual)?.total || 0;
  }

  private getMesAnterior(): string {
    const h = new Date();
    return new Date(h.getFullYear(), h.getMonth() - 1, 1).toISOString().slice(0, 7);
  }

  calcularPorcentagemMudancaComCor(atual: number, anterior: number): Percentual {
    if (anterior === 0) return { texto: '—', cor: 'text-gray-400' };
    const pct = ((atual - anterior) / anterior) * 100;
    if (pct >= 0) return { texto: `+${pct.toFixed(1)}%`, cor: 'text-green-500' };
    return { texto: `−${Math.abs(pct).toFixed(1)}%`, cor: 'text-red-500' };
  }

  async getPorcentagemMudancaViagens(): Promise<Percentual> {
    const porMes = await this.getViagensPorMes();
    const atual = porMes.find((v) => v.mes === new Date().toISOString().slice(0, 7))?.total || 0;
    const anterior = porMes.find((v) => v.mes === this.getMesAnterior())?.total || 0;
    return this.calcularPorcentagemMudancaComCor(atual, anterior);
  }

  async getViagemById(id: string) {
    const { data, error } = await supabase
      .from('Viagem')
      .select(`
        viagem_id, comeco_viagem, fim_viagem,
        Funcionario ( funcionario_id, nome, cargo ),
        Rota ( rota_id, nome_rota, nome_origem, nome_destino, distancia_total ),
        Eventos ( eventos_id, tipo_evento, classificacao_evento, horario_evento, latitude_evento, longitude_evento )
      `)
      .eq('viagem_id', id)
      .single();
    if (error) {
      console.error('Erro ao buscar viagem:', error.message);
      return null;
    }
    return data as any;
  }
}
