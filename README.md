# Rickson.dev

Site profissional do Rickson de Oliveira, desenvolvido em Next.js.

## Scripts

```bash
npm run dev
npm run lint
npm test
npm run build
npm run typecheck
npm run verify
```

## Estrutura

- `src/app`: rotas, layout global e estilos.
- `src/features/portfolio`: UI e runtime visual do portfólio.
- `public/assets`: logos, imagens do Sobre e prévias sanitizadas dos projetos.
- `public/portfolio-runtime.js`: runtime visual aprovado no protótipo, responsável por tema, idioma, navegação suave e canvas mágico.

## CI/CD e ambientes

- `develop`: ambiente de desenvolvimento publicado como Preview na Vercel.
- `main`: ambiente de produção publicado em `rickson.dev`.
- Pull requests: recebem uma Preview temporária da Vercel.
- GitHub Actions: executa lint, testes, verificação de tipos e build.
- Vercel: repete a verificação completa antes de cada publicação.
