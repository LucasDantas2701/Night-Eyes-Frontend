<a id="readme-top"></a>

# NIGHT EYES – Frontend (Angular)

**Interface web do sistema inteligente de monitoramento de fadiga e distrações.**

[Começar »](#começando)

[Reportar um bug](https://github.com/LucasDantas2701/Night-Eyes-Frontend/issues) · [Sugerir uma funcionalidade](https://github.com/LucasDantas2701/Night-Eyes-Frontend/issues)

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Construído Com](#construído-com)
- [Começando](#começando)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Solução de Problemas](#solução-de-problemas)
- [Feedback](#feedback)
- [Contato](#contato)
- [Agradecimentos](#agradecimentos)

---

## Sobre o Projeto

O **Night Eyes** é um sistema de monitoramento de fadiga e distrações. Este repositório contém o **frontend**: a aplicação web onde os dados do sistema são visualizados e acompanhados de forma operacional.

A aplicação é uma SPA (*Single Page Application*) em **Angular 20** (componentes standalone, *signals* e rotas com *lazy loading*), que se conecta ao **Supabase** para autenticação e consulta dos dados do sistema.

Telas da aplicação:

- **Login** com e-mail e senha (Supabase Auth) e rotas protegidas por *guards*.
- **Painel de Controle**: indicadores do mês (condutores, viagens, eventos e média por viagem), Pareto de eventos e ranking de funcionários por tipo de evento.
- **Overview Rotas e Eventos**: mapa com a rota selecionada e os eventos marcados por tipo.
- **Corridas**: lista com busca, ordenação, paginação e cadastro de nova corrida; **detalhes da corrida** com mapa, linha do tempo e distribuição de riscos.
- **Alertas**: eventos de risco do mês, com severidade, ordenação e paginação.
- **Funcionários**: cadastro, edição e exclusão de motoristas, com indicadores de corridas e alertas.

O repositório inclui também o material de estratégia de marca do projeto (`NightEyes_Brand_Strategy.pptx (1).pdf`).

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

## Construído Com

- [Angular 20](https://angular.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Leaflet](https://leafletjs.com/)
- [Chart.js](https://www.chartjs.org/)
- [Lucide](https://lucide.dev/) (ícones)

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

## Começando

### Pré-requisitos

- **Git**: [git-scm.com/downloads](https://git-scm.com/downloads)
- **Node.js 20.19 ou superior** (o npm já vem incluído). Versão compatível com o Angular 20: 20.19+ ou 22.12+.: [nodejs.org](https://nodejs.org). Baixe a versão LTS.

Verifique a instalação no terminal:

```bash
git --version
node -v
npm -v
```

> O Angular CLI é instalado junto com as dependências do projeto (`npm install`). Não é necessário instalá-lo globalmente.

### Instalação

1. Clone o repositório

   ```bash
   git clone https://github.com/LucasDantas2701/Night-Eyes-Frontend.git
   cd Night-Eyes-Frontend
   ```

2. Instale as dependências

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente (veja a seção abaixo)

4. Inicie o servidor de desenvolvimento

   ```bash
   npm start
   ```

5. Abra no navegador:

   ```
   http://localhost:4200
   ```

### Variáveis de Ambiente

O projeto usa o Supabase, então é preciso criar um arquivo `.env` na raiz (use o `.env.example` como modelo) com as credenciais do **seu** projeto. Os nomes das variáveis são os mesmos da versão React:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

- Use apenas a chave pública (*anon*). **Nunca** coloque a `service_role` no frontend.
- O arquivo `.env` não deve ser enviado ao Git.
- Ao rodar `npm start` ou `npm run build`, o script `scripts/set-env.mjs` lê o `.env` e gera `src/environments/environment.ts` (arquivo ignorado pelo Git).

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

## Uso

Os comandos disponíveis estão definidos no `package.json`:

| Comando           | O que faz                                          |
| ----------------- | -------------------------------------------------- |
| `npm start`       | Gera o ambiente a partir do `.env` e inicia o servidor de desenvolvimento (porta 4200). |
| `npm run build`   | Gera a versão de produção na pasta `dist/`.        |

A versão de produção é gerada em `dist/nighteyes-angular/browser/`. Para servi-la localmente:

```bash
npm run build
npx http-server dist/nighteyes-angular/browser -p 8080 --proxy http://localhost:8080?
```

Como a aplicação usa rotas do navegador, o servidor de produção precisa redirecionar qualquer caminho para o `index.html`.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

## Estrutura do Projeto

```
nighteyes-angular/
├── public/                       # logos (copiadas para a raiz do build)
├── scripts/set-env.mjs           # gera environment.ts a partir do .env
├── src/
│   ├── environments/             # environment.ts (gerado, não versionado)
│   ├── app/
│   │   ├── core/                 # Supabase, serviços (eventos, viagens, funcionários), guards, toast
│   │   ├── shared/               # ícones, gráfico, mapas, modal, paginação
│   │   ├── pages/                # login, layout, painel, corridas, detalhes, alertas, funcionários, overview
│   │   ├── app.routes.ts         # rotas com lazy loading e guards
│   │   └── app.config.ts
│   ├── index.html
│   └── styles.css                # Tailwind CSS 4
├── .postcssrc.json               # plugin do Tailwind
├── angular.json
└── package.json
```

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

## Solução de Problemas

Se ocorrer algum erro ao rodar o projeto, remova a pasta `node_modules` e instale novamente:

```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules
# Linux/macOS: rm -rf node_modules

npm install
```

Se a aplicação abrir mas não carregar os dados, confira se o `.env` existe, se as variáveis estão preenchidas e se você reiniciou o `npm start` depois de criá-lo (o `.env` só é lido quando o `npm start` gera o `environment.ts`).

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

## Feedback

Feedback é muito bem-vindo. Abra uma [issue](https://github.com/LucasDantas2701/Night-Eyes-Frontend/issues) com:

- o que você esperava e o que aconteceu;
- os passos para reproduzir o problema;
- a mensagem de erro do console do navegador ou do terminal;
- seu ambiente: sistema operacional, versão do Node.js e navegador.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

## Contato

Lucas dos Santos Dantas — [@LucasDantas2701](https://github.com/LucasDantas2701) — [LinkedIn](https://www.linkedin.com/in/lucas-dantass)

Projeto: [github.com/LucasDantas2701/Night-Eyes-Frontend](https://github.com/LucasDantas2701/Night-Eyes-Frontend)

Projeto desenvolvido no contexto da Faculdade Matias Machline (Manaus, Brasil).

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

## Agradecimentos

- Angular
- Tailwind CSS
- Supabase
- Leaflet, Chart.js e Lucide
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>
