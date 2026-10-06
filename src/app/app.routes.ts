import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard-layout').then((m) => m.DashboardLayout),
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./pages/inicio').then((m) => m.Inicio) },
      { path: 'corridas', loadComponent: () => import('./pages/corridas').then((m) => m.Corridas) },
      { path: 'corridas/:id', loadComponent: () => import('./pages/detalhes-corrida').then((m) => m.DetalhesCorrida) },
      { path: 'funcionarios', loadComponent: () => import('./pages/funcionarios').then((m) => m.Funcionarios) },
      { path: 'alertas', loadComponent: () => import('./pages/alertas').then((m) => m.Alertas) },
      { path: 'overview', loadComponent: () => import('./pages/overview').then((m) => m.Overview) },
    ],
  },
  { path: '**', redirectTo: '' },
];
