# Angular Federation: passo a passo

Este guia descreve como habilitar Angular Native Federation no projeto `spec-as-source-angular-demo` para consumir os remotes `mf1` e `mf2`.

## Objetivo

- Carregar `mf1` em `http://localhost:4201/remoteEntry.json`.
- Carregar `mf2` em `http://localhost:4202/remoteEntry.json`.
- Manter o bootstrap atual do app, incluindo runtime config e Keycloak.
- Expor rotas no host para navegar até os remotes.

## 1. Instalar as dependências de Federation

No projeto host, adicione as mesmas dependências usadas nos exemplos de referência:

- `@angular-architects/native-federation`
- `@softarc/native-federation`
- `@softarc/native-federation-runtime`
- `es-module-shims`

## 2. Criar a configuração de federation do host

Crie um arquivo `federation.config.js` na raiz do projeto com este papel:

- Definir o nome do host.
- Compartilhar dependências Angular com `shareAll`.
- Manter `singleton`, `strictVersion` e `requiredVersion: 'auto'`.
- Ignorar módulos do `rxjs` que não precisam ser compartilhados.

O modelo de referência está no projeto `shell`.

## 3. Ajustar o `angular.json`

Atualize o projeto para usar os builders de federation no lugar dos builders padrão:

- `build` deve usar `@angular-architects/native-federation:build`.
- `serve` também deve usar `@angular-architects/native-federation:build`.
- Crie um target intermediário baseado em `@angular/build:application`.
- Crie `serve-original` com `@angular/build:dev-server`.

Além disso, inclua `es-module-shims` em `polyfills` no target de build do host.

## 4. Inicializar Federation no bootstrap

Altere o fluxo do `src/main.ts` para iniciar federation antes de carregar a aplicação:

1. Chamar `initFederation('federation.manifest.json')`.
2. Após a inicialização, importar o bootstrap da aplicação.
3. Manter o carregamento do runtime config dentro do bootstrap atual.

Isso preserva a lógica existente de `loadRuntimeConfig()` e `bootstrapApplication()`.

## 5. Criar o manifesto dos remotes

Crie `public/federation.manifest.json` com o mapeamento dos remotes:

- `mf1` -> `http://localhost:4201/remoteEntry.json`
- `mf2` -> `http://localhost:4202/remoteEntry.json`

Esse arquivo é lido pelo `initFederation` no startup do host.

## 6. Expor as rotas dos remotes no host

No arquivo de rotas principal, adicione rotas lazy para os dois remotes:

- `path: 'mf1'` usando `loadRemoteModule('mf1', './Component')`
- `path: 'mf2'` usando `loadRemoteModule('mf2', './Component')`

O padrão de consumo é o mesmo usado no projeto `shell`.

## 7. Manter o contrato dos remotes

Cada remote precisa continuar expondo o mesmo módulo:

- `mf1` expõe `./Component`
- `mf2` expõe `./Component`

No host, o nome do exposed module consumido deve coincidir exatamente com esse contrato.

## 8. Integrar com o menu lateral

O menu lateral do projeto já vem de `public/config/sidebar-menu.json`.

Para aparecerem na navegação:

- Adicione itens com `route: "/mf1"` e `route: "/mf2"`.
- Se quiser proteger os itens por autenticação, ajuste `requiresAuth` e `visibleWhenAuthenticated`.
- O loader atual do menu já lê esse arquivo em runtime, então não precisa mudar a arquitetura.

## 9. Validar a ordem de execução

Para funcionar em desenvolvimento, a ordem recomendada é:

1. Subir `mf1` na porta `4201`.
2. Subir `mf2` na porta `4202`.
3. Subir o host em `spec-as-source-angular-demo`.
4. Abrir o host e navegar para `/mf1` e `/mf2`.

## 10. Pontos de atenção

- Não remova a lógica atual de runtime config do host.
- Não mude o contrato `./Component` dos remotes sem atualizar as rotas do host.
- Se o remote não estiver rodando, a navegação vai falhar no carregamento dinâmico.
- Em desenvolvimento, o host e os remotes devem estar disponíveis ao mesmo tempo.

## 11. Arquivos envolvidos

Os principais arquivos do host que participam dessa integração são:

- `angular.json`
- `federation.config.js`
- `src/main.ts`
- `src/app/app.routes.ts`
- `public/federation.manifest.json`
- `public/config/sidebar-menu.json`

## 12. Resumo curto

O fluxo final fica assim:

1. O host inicializa Federation no startup.
2. O manifesto aponta para `mf1` e `mf2`.
3. As rotas do host carregam `loadRemoteModule` sob demanda.
4. O menu lateral aponta para as rotas federadas.
5. Os remotes continuam independentes e expõem `./Component`.