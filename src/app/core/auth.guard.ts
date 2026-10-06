import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { supabase } from './supabase.client';

/** Protege /dashboard: sem usuário logado, volta para o login (antigo `requireAuth`). */
export const authGuard: CanActivateFn = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user ? true : inject(Router).createUrlTree(['/']);
};

/** Se já estiver logado, o login redireciona para o painel (antigo `redirectIfLogged`). */
export const guestGuard: CanActivateFn = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user ? inject(Router).createUrlTree(['/dashboard']) : true;
};
