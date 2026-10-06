import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';
import { Funcionario } from './models';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  async getTodosFuncionarios(): Promise<Funcionario[]> {
    const { data, error } = await supabase.from('Funcionario').select('*');
    if (error) {
      console.error('Erro ao buscar funcionários:', error.message);
      return [];
    }
    return data as Funcionario[];
  }

  async getTotalFuncionariosAtivos(): Promise<number> {
    return (await this.getTodosFuncionarios()).length;
  }
}
