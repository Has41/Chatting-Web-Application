# AGENTS.md

Guidance for Codex agents working in this repository.

## Project

This is a fullstack chat application.

- `client/`: Vite + React + TypeScript + Tailwind CSS v4.
- `server/`: NestJS + TypeScript + Socket.IO + Mongoose.
- The main product is the authenticated chat app. The public home/auth flow is secondary.
- Product/design context lives in `PRODUCT.md` and `DESIGN.md`. Follow those before making UI changes.

## Run Commands

Frontend:

```powershell
cd client
npm run dev
npm run build
npm run type-check
npm run lint
```

Backend:

```powershell
cd server
npm run start:dev
npm run build
npm test
```

The Vite dev server runs on port `5173`. It proxies:

- `/api` to `http://localhost:3000`
- `/socket.io` to `http://localhost:3000`

Do not create frontend paths like `/api/api/...`.

## Design Direction

Use `PRODUCT.md` and `DESIGN.md` as the source of truth.

- Register: product.
- Platform: web.
- Positioning: rich media messenger.
- Visual direction: playful social, but still familiar chat UI.
- Design system name: Social Mint Studio.
- Core accent: mint green `#96e6a1`.
- Strong blue/fuchsia/amber social colors are mostly for stories and media moments.
- App UI should not feel like a generic SaaS dashboard, cold enterprise inbox, or over-decorated social feed.

For UI work:

- Use lucide icons when available.
- Keep controls familiar: composer, attachments, calls, media viewer, chat info, message menus.
- Use visible focus states.
- Avoid empty `src=""`; render avatar fallbacks instead.
- Prefer skeletons or inline state over vague loading text.
- Use reduced-motion alternatives for pulsing/animated UI.

## Frontend Structure Goal

Move toward this module structure gradually:

```txt
client/src/
  app/
    providers/
    App.tsx
    routes.tsx
    store.tsx

  modules/
    auth/
      api/
      components/
      hooks/
      pages/
      services/
      states/
      types/

    chat/
      api/
      components/
        layout/
        messages/
        composer/
        chat-info/
        media/
        calls/
        stories/
        navigation/
      hooks/
      pages/
      services/
      socket/
      states/
      types/
      utils/

    profile/
      api/
      components/
      hooks/
      pages/
      types/

  shared/
    components/
      ui/
      feedback/
      media/
    constants/
    hooks/
    types/
    utils/

  styles/
```

`shared/` should only contain code that is genuinely reusable across modules. Chat-specific components should live under `modules/chat/`.

Likely chat-specific components currently worth moving out of `shared/components` over time:

- `AudioRecorder`
- `AudioPlayer`
- `AttachmentMenu`
- `EditMessageModal`
- `FileMessagePreview`
- `MediaViewerModal`
- `PDFMeta`
- `PDFPreview`
- `GroupModal`

Move files in small batches and update imports immediately. Do not do a giant structure rewrite in one pass.

## Backend Structure Goal

Move toward this NestJS structure gradually:

```txt
server/src/
  main.ts
  app.module.ts

  modules/
    auth/
    users/
    conversations/
    messages/
    stories/
    uploads/
    mail/

  gateway/
    socket.gateway.ts
    socket.types.ts
    socket.utils.ts

  common/
    decorators/
    guards/
    filters/
    interceptors/
    types/
    utils/

  config/
```

Keep backend refactors behavior-preserving unless the user asks for feature changes.

## Coding Rules

- Prefer existing aliases from `client/vite.config.ts`: `@app`, `@auth`, `@chat`, `@profile`, `@shared`, `@styles`.
- Use TanStack Query v5 object syntax only:

```ts
useQuery({ queryKey: ["key"], queryFn })
queryClient.invalidateQueries({ queryKey: ["key"] })
```

- Socket payloads should be object-shaped. Avoid positional event arguments for new code.
- Preserve optimistic UI for messages, files, and audio sends.
- Message state should handle `sending`, `failed`, `edited`, and deleted states cleanly.
- File/message UI should render based on resolved media type, not only the selected upload category.
- For image/video media, use the media viewer. Documents should not open in the media viewer.
- Captions are editable; non-caption file payloads should not show edit controls.
- Keep private audio/video call behavior private-chat only unless the user asks for group calls.

## Git And Safety

- The worktree may be dirty. Do not revert user changes.
- Do not run destructive git commands unless explicitly asked.
- Make narrow, behavior-focused changes.
- Use `rg` for searching.
- Use `apply_patch` for manual edits.

## Recommended Refactor Order

1. Keep `PRODUCT.md`, `DESIGN.md`, and this `AGENTS.md` updated.
2. Move chat-only shared components into `modules/chat/components/...`.
3. Split chat UI by concern: `messages`, `composer`, `chat-info`, `media`, `calls`, `stories`, `navigation`.
4. Move chat socket hooks into `modules/chat/socket` or a clear `hooks/socket` convention.
5. Clean aliases and imports after each batch.
6. Run `cd client; npm run build` after frontend move batches.
7. Refactor backend modules only after the frontend chat structure is stable.
