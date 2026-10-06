import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../core/supabase.client';

@Component({
  selector: 'ne-login',
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-[#F7F9FC] flex overflow-hidden">

      <!-- ========================================================= -->
      <!-- ÁREA CLARA                                                -->
      <!-- ========================================================= -->

      <main class="relative flex-1 min-w-0 bg-[#F7F9FC]">

        <!-- Logo superior esquerdo -->
        <div
          class="absolute top-10 left-10 xl:left-14 z-20 flex items-center gap-3"
        >

          <img
            src="logo_v.png"
            alt="NightEyes"
            class="w-11 h-11 object-contain"
          />

          <div>
            <h2
              class="text-[21px] leading-none font-bold tracking-tight text-[#0B1F3A]"
            >
              NightEyes
            </h2>

            <p class="text-[12px] mt-1 text-[#64748B]">
              Sistema de Monitoramento
            </p>
          </div>

        </div>


        <!-- ======================================================= -->
        <!-- CONTEÚDO PRINCIPAL DA ÁREA CLARA                       -->
        <!-- ======================================================= -->

        <div
          class="h-full min-h-screen flex items-center"
        >

          <!-- ----------------------------------------------------- -->
          <!-- TEXTO ESQUERDO                                       -->
          <!-- ----------------------------------------------------- -->

          <section
            class="
              w-[38%]
              pl-10 xl:pl-14
              pr-6
              flex
              flex-col
              justify-center
              pt-8
            "
          >

            <!-- pequeno detalhe azul/roxo -->
            <div
              class="w-12 h-[4px] rounded-full bg-gradient-to-r from-[#2979FF] to-[#6638A6] mb-7"
            ></div>


            <h1
              class="
                text-[42px]
                xl:text-[48px]
                2xl:text-[52px]
                leading-[1.08]
                font-bold
                tracking-[-1.5px]
                text-[#0B1F3A]
              "
            >
              Mais segurança
              <br />
              nas estradas.
            </h1>


            <p
              class="
                mt-7
                text-[17px]
                xl:text-[18px]
                leading-8
                text-[#64748B]
              "
            >
              Tecnologia e inteligência para
              <br />
              um futuro mais seguro.
            </p>


            <!-- Feature -->
            <div
              class="flex items-center gap-3 mt-10"
            >

              <div
                class="
                  w-11
                  h-11
                  rounded-xl
                  bg-[#EEF5FF]
                  flex
                  items-center
                  justify-center
                "
              >

                <svg
                  class="w-5 h-5 text-[#2979FF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >

                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.042-.133-2.052-.382-3.016z"
                  />

                </svg>

              </div>


              <div>

                <p
                  class="text-sm font-semibold text-[#0B1F3A]"
                >
                  Monitoramento inteligente
                </p>

                <p
                  class="text-xs text-[#94A3B8] mt-0.5"
                >
                  Segurança em tempo real
                </p>

              </div>

            </div>

          </section>


          <!-- ----------------------------------------------------- -->
          <!-- CARD DE LOGIN                                        -->
          <!-- ----------------------------------------------------- -->

          <section
            class="
              w-[62%]
              flex
              justify-center
              items-center
              pr-8
              xl:pr-10
              2xl:pr-12
            "
          >

            <div
              class="
                w-full
                max-w-[580px]
                bg-white
                rounded-[26px]
                border
                border-[#E2E8F0]
                shadow-[0_18px_55px_rgba(15,23,42,0.08)]
                px-10
                py-10
                xl:px-11
                xl:py-11
              "
            >

              <!-- Logo -->
              <div class="flex flex-col items-center">

                <div
                  class="
                    w-[68px]
                    h-[68px]
                    rounded-[17px]
                    bg-[#0B1F3A]
                    flex
                    items-center
                    justify-center
                    shadow-[0_8px_20px_rgba(11,31,58,0.16)]
                  "
                >

                  <img
                    src="logo_v.png"
                    alt="NightEyes"
                    class="w-[48px] h-[48px] object-contain"
                  />

                </div>


                <h2
                  class="
                    mt-6
                    text-[29px]
                    xl:text-[31px]
                    leading-tight
                    font-bold
                    tracking-[-0.8px]
                    text-[#0B1F3A]
                    text-center
                  "
                >
                  Sistema de
                  <br />
                  Monitoramento
                </h2>


                <p
                  class="mt-2 text-[15px] text-[#64748B]"
                >
                  Acesse sua conta NightEyes
                </p>

              </div>


              <!-- FORM -->
              <form
                (ngSubmit)="submit()"
                class="mt-9"
              >

                <!-- EMAIL -->
                <div>

                  <label
                    for="email"
                    class="block text-[14px] font-semibold text-[#334155] mb-2"
                  >
                    Email
                  </label>


                  <div class="relative">

                    <!-- ícone -->
                    <svg
                      class="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        w-5
                        h-5
                        text-[#94A3B8]
                      "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >

                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />

                    </svg>


                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autocomplete="email"
                      placeholder="seuEmail@email.com"
                      [(ngModel)]="email"
                      class="
                        w-full
                        h-[60px]
                        pl-12
                        pr-4
                        rounded-xl
                        bg-[#F8FAFC]
                        border
                        border-[#DDE5EF]
                        outline-none
                        text-[#0F172A]
                        placeholder-[#94A3B8]
                        transition-all
                        focus:bg-white
                        focus:border-[#2979FF]
                        focus:ring-4
                        focus:ring-[#2979FF]/10
                      "
                    />

                  </div>

                </div>


                <!-- SENHA -->
                <div class="mt-6">

                  <label
                    for="password"
                    class="block text-[14px] font-semibold text-[#334155] mb-2"
                  >
                    Senha
                  </label>


                  <div class="relative">

                    <svg
                      class="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        w-5
                        h-5
                        text-[#94A3B8]
                      "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >

                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
                      />

                    </svg>


                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autocomplete="current-password"
                      placeholder="••••••••"
                      [(ngModel)]="password"
                      class="
                        w-full
                        h-[60px]
                        pl-12
                        pr-4
                        rounded-xl
                        bg-[#F8FAFC]
                        border
                        border-[#DDE5EF]
                        outline-none
                        text-[#0F172A]
                        placeholder-[#94A3B8]
                        transition-all
                        focus:bg-white
                        focus:border-[#2979FF]
                        focus:ring-4
                        focus:ring-[#2979FF]/10
                      "
                    />

                  </div>

                </div>


                <!-- ERRO -->
                @if (error()) {

                  <div
                    class="
                      mt-5
                      p-3
                      rounded-xl
                      bg-red-50
                      border
                      border-red-100
                    "
                  >

                    <p
                      class="
                        text-red-600
                        text-sm
                        text-center
                        font-medium
                      "
                    >
                      {{ error() }}
                    </p>

                  </div>

                }


                <!-- BOTÃO -->
                <button
                  type="submit"
                  [disabled]="loading()"
                  class="
                    w-full
                    h-[60px]
                    mt-6
                    rounded-xl
                    bg-[#2979FF]
                    hover:bg-[#1769E8]
                    text-white
                    font-semibold
                    text-[16px]
                    flex
                    items-center
                    justify-center
                    gap-3
                    transition-all
                    shadow-[0_9px_24px_rgba(41,121,255,0.28)]
                    hover:shadow-[0_12px_28px_rgba(41,121,255,0.34)]
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >

                  @if (loading()) {

                    <svg
                      class="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >

                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      />

                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />

                    </svg>

                    <span>Entrando...</span>

                  } @else {

                    <span>Entrar</span>

                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >

                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />

                    </svg>

                  }

                </button>

              </form>


              <!-- Rodapé -->
              <div
                class="
                  mt-8
                  pt-6
                  border-t
                  border-[#E5EAF0]
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                <svg
                  class="w-4 h-4 text-[#94A3B8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >

                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
                  />

                </svg>

                <span
                  class="text-xs text-[#94A3B8]"
                >
                  Acesso seguro ao sistema
                </span>

              </div>

            </div>

          </section>

        </div>


        <!-- ======================================================= -->
        <!-- DECORAÇÃO INFERIOR ESQUERDA                            -->
        <!-- ======================================================= -->

        <div
          class="
            absolute
            -bottom-32
            -left-32
            w-[350px]
            h-[350px]
            rounded-full
            border
            border-[#2979FF]/10
            pointer-events-none
          "
        ></div>

        <div
          class="
            absolute
            -bottom-24
            -left-24
            w-[260px]
            h-[260px]
            rounded-full
            border
            border-[#6638A6]/10
            pointer-events-none
          "
        ></div>


        <!-- Copyright -->
        <span
          class="
            absolute
            bottom-8
            left-10
            xl:left-14
            text-xs
            text-[#94A3B8]
          "
        >
          NightEyes © 2026
        </span>

      </main>


      <!-- ========================================================= -->
      <!-- PAINEL DIREITO                                           -->
      <!-- ========================================================= -->

      <aside
        class="
          hidden
          xl:flex
          w-[29%]
          min-w-[390px]
          max-w-[500px]
          relative
          overflow-hidden
          bg-[#061A33]
          flex-col
        "
      >

        <!-- Fundo -->
        <div
          class="
            absolute
            inset-0
            bg-gradient-to-b
            from-[#0C2D57]
            via-[#08213F]
            to-[#03101F]
          "
        ></div>


        <!-- círculos decorativos -->
        <div
          class="
            absolute
            -top-20
            -right-28
            w-[360px]
            h-[360px]
            rounded-full
            border
            border-[#2979FF]/20
          "
        ></div>

        <div
          class="
            absolute
            -top-5
            -right-5
            w-[260px]
            h-[260px]
            rounded-full
            border
            border-[#2979FF]/10
          "
        ></div>


        <!-- ===================================================== -->
        <!-- WIDGET MOTORISTA                                      -->
        <!-- ===================================================== -->

        <div
          class="
            relative
            z-10
            mx-8
            mt-16
            rounded-2xl
            border
            border-white/10
            bg-white/[0.06]
            backdrop-blur-md
            p-4
          "
        >

          <div class="flex items-center gap-3">

            <div
              class="
                w-11
                h-11
                rounded-xl
                bg-[#2979FF]/20
                flex
                items-center
                justify-center
              "
            >

              <svg
                class="w-5 h-5 text-[#4B8DFF]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >

                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />

              </svg>

            </div>


            <div class="flex-1">

              <p
                class="text-white font-semibold text-[15px]"
              >
                Motorista Ativo
              </p>

              <div
                class="flex items-center gap-2 mt-1"
              >

                <span
                  class="w-2 h-2 rounded-full bg-emerald-400"
                ></span>

                <span
                  class="text-white/50 text-xs"
                >
                  Sem sinais de fadiga
                </span>

              </div>

            </div>

          </div>

        </div>


        <!-- ===================================================== -->
        <!-- GRÁFICO                                               -->
        <!-- ===================================================== -->

        <div
          class="
            relative
            z-10
            mx-8
            mt-4
            rounded-2xl
            border
            border-white/10
            bg-white/[0.06]
            backdrop-blur-md
            p-4
          "
        >

          <div
            class="
              flex
              items-center
              justify-between
              mb-5
            "
          >

            <span
              class="text-white/60 text-xs font-medium"
            >
              Monitoramento
            </span>

            <span
              class="text-emerald-400 text-xs"
            >
              ● Online
            </span>

          </div>


          <div
            class="
              h-[95px]
              flex
              items-end
              gap-2
            "
          >

            <div
              class="flex-1 h-[25%] rounded-t-md bg-[#1D579F]"
            ></div>

            <div
              class="flex-1 h-[45%] rounded-t-md bg-[#245FB0]"
            ></div>

            <div
              class="flex-1 h-[32%] rounded-t-md bg-[#2865BA]"
            ></div>

            <div
              class="flex-1 h-[65%] rounded-t-md bg-[#2979FF]"
            ></div>

            <div
              class="flex-1 h-[52%] rounded-t-md bg-[#2870D5]"
            ></div>

            <div
              class="flex-1 h-[78%] rounded-t-md bg-[#3485FF]"
            ></div>

          </div>

        </div>


        <!-- ===================================================== -->
        <!-- CAMINHÃO                                              -->
        <!-- ===================================================== -->

        <div
          class="
            absolute
            bottom-14
            left-1/2
            -translate-x-1/2
            w-[300px]
            h-[180px]
          "
        >

          <!-- sombra -->
          <div
            class="
              absolute
              bottom-0
              left-2
              w-[290px]
              h-5
              rounded-full
              bg-black/30
              blur-xl
            "
          ></div>


          <!-- carroceria -->
          <div
            class="
              absolute
              left-0
              bottom-4
              w-[205px]
              h-[105px]
              rounded-t-2xl
              rounded-bl-xl
              bg-gradient-to-br
              from-[#71809A]
              to-[#34445D]
              shadow-2xl
            "
          >

            <!-- janela -->
            <div
              class="
                absolute
                left-9
                top-27
                w-[85px]
                h-[35px]
                rounded-md
                bg-[#061A33]
              "
            ></div>


            <!-- roda -->
            <div
              class="
                absolute
                left-7
                -bottom-7
                w-11
                h-11
                rounded-full
                bg-[#020B18]
                border-[5px]
                border-[#60718D]
              "
            ></div>


            <!-- roda -->
            <div
              class="
                absolute
                right-4
                -bottom-7
                w-11
                h-11
                rounded-full
                bg-[#020B18]
                border-[5px]
                border-[#60718D]
              "
            ></div>

          </div>


          <!-- cabine -->
          <div
            class="
              absolute
              right-0
              bottom-4
              w-[90px]
              h-[82px]
              rounded-tr-2xl
              rounded-br-xl
              bg-gradient-to-br
              from-[#44556F]
              to-[#293B53]
            "
          >

            <!-- vidro -->
            <div
              class="
                absolute
                top-4
                right-3
                w-[35px]
                h-[42px]
                rounded-sm
                bg-[#174A83]
                border
                border-[#2979FF]/40
              "
            ></div>

          </div>


          <!-- ícone olho -->
          <div
            class="
              absolute
              -top-1
              left-[103px]
              w-12
              h-12
              rounded-xl
              bg-[#061A33]
              border
              border-[#2979FF]
              flex
              items-center
              justify-center
              shadow-lg
            "
          >

            <svg
              class="w-6 h-6 text-[#2979FF]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />

              <circle
                cx="12"
                cy="12"
                r="3"
                stroke-width="2"
              />

            </svg>

          </div>

        </div>


        <!-- linha inferior decorativa -->
        <div
          class="
            absolute
            bottom-0
            left-0
            right-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#2979FF]/30
            to-transparent
          "
        ></div>

      </aside>

    </div>
  `,
})
export class Login {

  private router = inject(Router);

  email = '';
  password = '';

  error = signal('');
  loading = signal(false);

  async submit() {

    this.loading.set(true);
    this.error.set('');

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password
      });

    if (error) {

      this.error.set(
        error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : error.message
      );

      this.loading.set(false);

      return;
    }

    if (data.user) {

      this.router.navigateByUrl(
        '/dashboard',
        { replaceUrl: true }
      );

    }
  }
}