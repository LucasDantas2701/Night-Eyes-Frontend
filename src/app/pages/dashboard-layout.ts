import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { supabase } from '../core/supabase.client';
import { IconComponent } from '../shared/icon.component';
import { IconName } from '../shared/icons';

const NAV_ITEMS: { to: string; icon: IconName; label: string; exact: boolean }[] = [
  { to: '/dashboard', icon: 'home', label: 'Painel de Controle', exact: true },
  { to: '/dashboard/overview', icon: 'users', label: 'Overview Rotas e Eventos', exact: false },
  { to: '/dashboard/corridas', icon: 'car', label: 'Corridas', exact: false },
  { to: '/dashboard/alertas', icon: 'alert', label: 'Alertas', exact: false },
  { to: '/dashboard/funcionarios', icon: 'users', label: 'Funcionários', exact: false },
];

@Component({
  selector: 'ne-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="flex min-h-screen bg-[#EDEDED]">
      <!-- SIDEBAR DESKTOP -->
      <aside class="fixed inset-y-0 left-0 z-40 hidden lg:flex flex-col bg-[#011526] border-r border-[#0B438C] transition-all duration-300"
             [class]="collapsed() ? 'w-20' : 'w-64'">
        <div class="p-4 h-20 flex items-center justify-between border-b border-[#0B438C]">
          <div class="flex items-center gap-2 overflow-hidden flex-1">
            <img src="logo_v.png" alt="Logo" class="w-12 h-12 object-contain shrink-0" />
            @if (!collapsed()) {
              <div class="min-w-0">
                <h2 class="text-sm font-bold text-white whitespace-nowrap">NightEyes</h2>
                <p class="text-[10px] text-[#EDEDED] uppercase tracking-widest whitespace-nowrap">Dashboard</p>
              </div>
            }
          </div>
          <button class="rounded-lg text-white hover:bg-[#0B438C] h-8 w-8 flex items-center justify-center"
                  (click)="collapsed.set(!collapsed())" aria-label="Recolher menu">
            <ne-icon [name]="collapsed() ? 'chevronRight' : 'chevronLeft'" [size]="16" />
          </button>
        </div>

        <nav class="flex-1 p-3 space-y-1">
          @for (item of nav; track item.to) {
            <a [routerLink]="item.to" routerLinkActive="!bg-[#165FF2] !text-white shadow-md"
               [routerLinkActiveOptions]="{ exact: item.exact }"
               class="group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[#EDEDED] hover:bg-[#0B438C] hover:text-white">
              <ne-icon [name]="item.icon" [size]="20" />
              <span class="text-sm font-medium transition-all duration-300"
                    [class]="collapsed() ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'">{{ item.label }}</span>
              @if (collapsed()) {
                <div class="hidden lg:block absolute left-14 bg-[#0B438C] text-white text-xs px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-[#165FF2] shadow-lg">
                  {{ item.label }}
                </div>
              }
            </a>
          }
        </nav>

        <div class="p-3 border-t border-[#0B438C] relative">
          @if (menuOpen()) {
            <div class="absolute bottom-full left-3 right-3 mb-2 w-56 rounded-xl border border-[#0B438C] bg-[#011526] p-1 shadow-lg">
              <button (click)="logout()" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-[#0B438C]">
                <ne-icon name="logOut" [size]="16" /> Sair da conta
              </button>
            </div>
          }
          <button (click)="menuOpen.set(!menuOpen())"
                  class="flex items-center gap-3 w-full p-2 bg-[#0B438C]/50 rounded-xl hover:bg-[#0B438C] transition-colors"
                  [class.justify-center]="collapsed()">
            <div class="w-9 h-9 shrink-0 bg-gradient-to-br from-[#165FF2] to-[#6638A6] rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-md">
              {{ user().initial }}
            </div>
            @if (!collapsed()) {
              <div class="flex-1 text-left min-w-0">
                <p class="text-sm font-medium text-white truncate">{{ user().name }}</p>
                <p class="text-xs text-[#EDEDED] truncate">{{ user().email }}</p>
              </div>
            }
          </button>
        </div>
      </aside>

      <div class="flex flex-col flex-1 min-w-0 transition-all duration-300" [class]="collapsed() ? 'lg:ml-20' : 'lg:ml-64'">
        <!-- TOP BAR MOBILE -->
        <header class="lg:hidden h-16 bg-[#011526] border-b border-[#0B438C] flex items-center justify-between px-4 sticky top-0 z-30">
          <div class="flex items-center gap-3 min-w-0">
            <img src="logo_v.png" alt="Logo" class="w-10 h-10 object-contain shrink-0" />
            <span class="font-bold text-white truncate">NightEyes</span>
          </div>
          <button class="rounded-xl text-white hover:bg-[#0B438C] h-9 w-9 flex items-center justify-center"
                  (click)="mobileOpen.set(true)" aria-label="Abrir menu">
            <ne-icon name="menu" [size]="20" />
          </button>
        </header>

        @if (mobileOpen()) {
          <div class="fixed inset-0 z-50 lg:hidden">
            <div class="absolute inset-0 bg-black/50" (click)="mobileOpen.set(false)"></div>
            <div class="absolute left-0 top-0 h-full w-64 sm:w-72 bg-[#011526] border-r border-[#0B438C] flex flex-col">
              <div class="p-6 border-b border-[#0B438C] font-bold text-white flex items-center gap-2">
                <ne-icon name="activity" [size]="20" class="text-[#165FF2]" /> Menu Principal
              </div>
              <nav class="flex-1 p-4 space-y-2">
                @for (item of nav; track item.to) {
                  <a [routerLink]="item.to" routerLinkActive="!bg-[#165FF2] !text-white shadow-md"
                     [routerLinkActiveOptions]="{ exact: item.exact }" (click)="mobileOpen.set(false)"
                     class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[#EDEDED] hover:bg-[#0B438C] hover:text-white">
                    <ne-icon [name]="item.icon" [size]="20" />
                    <span class="text-sm font-medium">{{ item.label }}</span>
                  </a>
                }
              </nav>
              <div class="p-4 border-t border-[#0B438C] flex items-center gap-3 bg-[#0B438C]/30">
                <div class="w-10 h-10 bg-gradient-to-br from-[#165FF2] to-[#6638A6] rounded-full flex items-center justify-center text-xs font-bold text-white">{{ user().initial }}</div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-white truncate">{{ user().name }}</p>
                  <button (click)="logout()" class="text-xs text-red-400 font-medium hover:underline">Sair</button>
                </div>
              </div>
            </div>
          </div>
        }

        <main class="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-auto pt-4">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayout implements OnInit {
  private router = inject(Router);
  nav = NAV_ITEMS;
  collapsed = signal(false);
  mobileOpen = signal(false);
  menuOpen = signal(false);
  user = signal({ name: '', email: '', initial: 'U' });

  async ngOnInit() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single();
    const name = profile?.name || 'Usuário';
    this.user.set({ name, email: user.email || '', initial: name.charAt(0).toUpperCase() });
  }

  async logout() {
    await supabase.auth.signOut();
    this.router.navigateByUrl('/');
  }
}
