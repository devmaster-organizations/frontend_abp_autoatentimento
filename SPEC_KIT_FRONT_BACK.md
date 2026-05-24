# Spec-Kit Frontend + Conexoes Backend

## Objetivo
Definir uma arquitetura clara para conectar o frontend ao backend atual, manter organizacao por dominio, separar interfaces por perfil (admin/secretaria/usuario) e preparar o fluxo de email/perguntas sem quebrar o que ja existe.

## Estado Atual (Resumo)
- Frontend possui telas: `login`, `admin`, `secretaria`, `usuarios`, `home/chat`.
- Chat ainda usa fluxo local estatico (`src/data/fluxo.ts`) e nao integra com `navigation-logs`.
- Existem cabecalhos diferentes e misturados por tela.
- Cadastro de usuarios em `app/usuarios` esta mockado (sem API real).
- Modal de email existe, mas envio esta stub.
- Backend ja possui:
  - `POST /api/auth/login`
  - `POST /api/users`
  - `GET /api/users`
  - `GET/POST/PATCH /api/navigation-logs`
  - analytics de navegacao em `/api/navigation-logs/analytics/*`
- Backend ainda NAO possui (lacunas):
  - modulo de email/perguntas com copia para secretaria e remetente
  - fluxo completo de reset/primeiro acesso por email
  - autorizacao por perfil aplicada em todas as rotas sensiveis (admin-only)

---

## 1. Arquitetura Frontend (Organizacao)

### 1.1 Estrutura de pastas proposta
```text
src/
  app/
    (public)/
      page.tsx
      login/page.tsx
    (admin)/
      admin/page.tsx
      usuarios/page.tsx
    (secretaria)/
      secretaria/page.tsx
    api/
      chat/route.ts
  components/
    chat/
    header/
      PublicHeader.tsx
      AdminHeader.tsx
      SecretariaHeader.tsx
    usuarios/
    secretaria/
    email/
  services/
    api/
      client.ts
      auth.service.ts
      users.service.ts
      navigation.service.ts
      analytics.service.ts
      inquiry.service.ts
  stores/
    auth.store.ts
    chat.store.ts
    users.store.ts
    inquiries.store.ts
    analytics.store.ts
  types/
    api.ts
    auth.ts
    navigation.ts
    inquiry.ts
```

### 1.2 Regra de organizacao
- `components/`: apenas UI (sem regra de negocio de API).
- `services/api/`: chamadas HTTP, mapeamento de endpoints, tratamento de erro.
- `stores/` (zustand): estado global e orquestracao por dominio.
- `app/*`: composicao de tela e wiring entre store + componentes.

---

## 2. Item 1 - Logs de navegacao no Chat

### 2.1 Requisito
Conectar `app/api/chat` e `components/Chat` ao backend para:
- buscar no por slug
- registrar navegacao (ja acontece no backend ao chamar `GET /navigation-logs/:slug`)

### 2.2 Contrato frontend -> backend
- Inicio da conversa:
  - `GET /api/navigation-logs/inicio`
- Clique de opcao:
  - `GET /api/navigation-logs/:slug?optionLabel=<label>&optionTargetId=<id>`

### 2.3 Resultado esperado
- Chat deixa de usar `fluxo.ts` como fonte primaria.
- `fluxo.ts` pode ficar como fallback temporario (feature flag) sem quebrar.

---

## 3. Item 2 - Separar Header em 3 componentes

### 3.1 Componentes
- `PublicHeader` (home/chat publico)
- `AdminHeader` (admin + usuarios)
- `SecretariaHeader` (secretaria)

### 3.2 Regra
- Cada layout de grupo usa seu header fixo.
- Nao compartilhar condicao complexa dentro de um unico componente.

---

## 4. Item 3 + 10 - Cadastro de usuarios com perfil

### 4.1 Requisitos
- Tela `app/usuarios` conectada ao backend (`GET /users`, `POST /users`).
- So ADMIN pode:
  - visualizar lista completa
  - cadastrar usuario
- SECRETARIA nao acessa tela de usuarios.

### 4.2 Lacuna do backend
- Hoje as rotas de usuario exigem token, mas nao filtram por perfil admin/secretaria.
- Necessario backend validar role no JWT para `POST /users` e `GET /users` admin-only.

### 4.3 Comportamento frontend
- Guard de rota por role no `auth.store`.
- Se perfil != ADMIN:
  - redirecionar
  - ocultar menu/entry de usuarios.

---

## 5. Item 5 - Uso de Zustand

### 5.1 Stores necessarias
- `auth.store.ts`
  - `token`, `user`, `role`, `isAuthenticated`
  - `login()`, `logout()`, `hydrateFromStorage()`
- `chat.store.ts`
  - no atual, historico de mensagens, estado de carregamento
  - `loadNodeBySlug()`, `selectOption()`
- `users.store.ts`
  - lista de usuarios, loading, erro
  - `fetchUsers()`, `createUser()`
- `inquiries.store.ts`
  - lista de perguntas/email, filtros, status respondido
- `analytics.store.ts`
  - top acessados, por no, navegacoes paginadas

---

## 6. Item 7 - O que existe no backend e nao esta no frontend

### Ja existe no backend (aproveitar no front)
- analytics:
  - `GET /api/navigation-logs/analytics/navigations`
  - `GET /api/navigation-logs/analytics/node/:id/accesses`
  - `GET /api/navigation-logs/analytics/top-accessed`
- filtros analytics:
  - `period=week|month`
  - `from` / `to`
  - `withinNodeId`
- `PATCH /api/navigation-logs/:id` com whitelist de campos editaveis.

### Ainda falta no frontend
- pagina de analytics para admin (consumir rotas acima)
- uso real do chat via API
- integracao real de login

---

## 7. Item 8 - Fluxo de login (admin e secretaria)

### 7.1 Fluxo
1. Usuario envia email/senha em `/login`.
2. Front chama `POST /api/auth/login`.
3. Armazena token + payload (role).
4. Redireciona por role:
   - `ADMIN` -> `/admin`
   - `SECRETARIA` -> `/secretaria`
5. Rotas protegidas validam token e role no client.

### 7.2 Observacao
- Validacao de role no frontend e UX.
- Seguranca real obrigatoria no backend (middleware por role).

---

## 8. Item 9 - Fluxo de cadastrar novos usuarios

### 8.1 Fluxo alvo
1. Admin abre `/usuarios`.
2. Lista usuarios via `GET /api/users`.
3. Cadastra novo via `POST /api/users`.
4. Feedback de sucesso/erro.

### 8.2 Evolucao prevista
- Quando backend de convite por email estiver pronto:
  - cadastro dispara senha temporaria por email
  - primeiro acesso obriga troca de senha.

---

## 9. Item 11 - Tela de recebimento de email + backend

### 9.1 Frontend
- Tela da secretaria (`/secretaria`) deve consumir dados reais de perguntas enviadas.
- Tabela com status:
  - `respondido = true|false`
  - data de envio
  - data de resposta

### 9.2 Backend (necessario implementar)
Criar modulo de perguntas/email:
- `POST /api/inquiries`
  - recebe nome, email, pergunta/mensagem
  - envia email com copia para:
    - secretaria
    - remetente
  - grava registro em tabela de perguntas
- `GET /api/inquiries`
  - lista para secretaria (paginado)
- `PATCH /api/inquiries/:id/status`
  - secretaria marca respondido/nao respondido

### 9.3 Requisito de copia
No envio:
- `to`: destinatario principal
- `cc`: secretaria + remetente (ou estrategia equivalente de duplicacao)
- registrar no banco status de envio (enviado/falha)

---

## 10. Item 12 - Manutenibilidade

### Regras de qualidade
- Sem chamadas `fetch` espalhadas em componentes.
- Tipos centralizados por dominio (`types/*`).
- Stores pequenas por contexto, sem store monolitica.
- Headers por perfil em arquivos separados.
- Feature flags para migracoes gradativas (chat local -> chat API).

---

## 11. Plano de execucao (ordem recomendada)

1. Base de API client + `auth.store` + login real.
2. Separacao dos 3 headers e layouts por perfil.
3. Integracao chat com `navigation-logs` + registro de navegacao.
4. Integracao `usuarios` com backend e guard admin-only.
5. Painel analytics (top, por no, navegacoes paginadas).
6. Modulo email/perguntas (backend + frontend secretaria).
7. Endurecimento de autorizacao por role no backend.

---

## 12. Criterios de aceite (front + conexoes)
- Chat consumindo backend e registrando trilha de navegacao.
- Headers separados em 3 componentes distintos.
- Login funcional com redirecionamento por role.
- Usuarios: apenas ADMIN ve/cadastra.
- Secretaria: tabela de perguntas integrada ao backend.
- Analytics consumindo filtros de periodo e escopo por no.
- Organizacao em `services`, `stores`, `components`, `app` sem mistura.
- Nao quebrar comportamento atual durante migracao (com fallback controlado).
