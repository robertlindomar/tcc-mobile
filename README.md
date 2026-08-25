# Conecta Comércio — Mobile

Aplicativo Expo exclusivo para consumidores do Conecta Comércio. Associação e lojistas continuam no painel web.

## Stack

- Expo SDK 54, React Native e TypeScript;
- Expo Router;
- `expo-secure-store` para o JWT;
- Jest com `jest-expo` para funções e fluxos puros.

## Requisitos e instalação

Use Node.js LTS e o Expo Go atualizado no Android. Em seguida:

```bash
npm install
cp .env.example .env.local
```

Configure a URL da API em `.env.local`:

```dotenv
EXPO_PUBLIC_API_URL=http://IP_DA_SUA_MAQUINA:3000
```

`EXPO_PUBLIC_API_URL` é pública por natureza: não coloque tokens, senhas ou outros segredos em variáveis `EXPO_PUBLIC_*`.

## API em Android físico

No celular, `localhost` aponta para o próprio aparelho, e não para o computador. Com o backend executando na porta 3000, use o IP LAN acessível da máquina, como `http://192.168.0.10:3000`. Celular e computador devem estar na mesma rede, e o firewall deve permitir a porta do backend.

No emulador Android, normalmente é usado `http://10.0.2.2:3000`; no navegador do computador, `http://localhost:3000`. Não versione um IP particular: `.env.local` já é ignorado pelo Git.

## Web (testes no navegador)

Dev:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000 npm run web
```

Build estático (mesmo fluxo do Docker):

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000 npm run build:web
# saída em dist/
```

## Docker / Coolify (web na VPS)

O mobile sobe como **site estático** (Expo export + nginx), ideal para testes no navegador sem build nativo.

```bash
docker build \
  --build-arg EXPO_PUBLIC_API_URL=http://SUA-API:3000 \
  -t conecta-mobile-web .
docker run --rm -p 3000:3000 conecta-mobile-web
```

### Coolify

1. Novo app **Dockerfile** apontando para esta pasta (`mobile/`).
2. **Ports Exposes:** `3000`
3. Env / Build Variable:

| Key | Build? | Valor |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | **sim** | URL pública da API (ex.: backend na VPS) |
| `PORT` | não | `3000` |

A API precisa estar acessível pelo browser (CORS já liberado no backend). Conta demo: `cliente2@demo.local` / `senha123`.

## Executar (Expo Go)

Inicie o backend em `../tcc-backend` e depois o Expo em modo LAN:

```bash
npm start -- --lan
```

Escaneie o QR Code com Expo Go no Android. Os comandos de qualidade são:

```bash
npm test
npm run lint
npm run typecheck
npx expo install --check
npx expo-doctor
```

## Conta de demonstração e Golden Path

Após executar `npm run db:demo:reset` no backend, entre com:

- E-mail: `cliente2@demo.local`
- Senha: `senha123`

O fluxo esperado é: abrir sem sessão, entrar, visualizar 200 pontos e nível retornados pela API, fechar e reabrir preservando a sessão, consultar o perfil real, sair e confirmar que o próximo início permanece deslogado. Também valide o cadastro de um novo consumidor sem qualquer seleção de loja.

## Estrutura

`app/` contém somente rotas. O código de domínio fica em `src/features`; o cliente HTTP em `src/services`; o JWT em `src/storage`; e os componentes reutilizáveis em `src/components`. Pontos, nível e permissões sempre vêm do backend.
