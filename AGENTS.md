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

Move toward this feature-sliced frontend structure gradually:

```txt
client/src/
  app/
    providers/
    router/
      routes.tsx
      guards/
    store/
    App.tsx
    main.tsx

  modules/
    auth/
      api/
      components/
      hooks/
      pages/
      state/
      types/
      index.ts

    chat/
      layout/
        components/
        ChatLayout.tsx

      conversations/
        api/
        components/
        hooks/
        queries/
        state/
        types/
        index.ts

      messages/
        api/
        components/
        hooks/
        queries/
        state/
        types/
        utils/
        index.ts

      composer/
        components/
        hooks/
        state/
        utils/
        index.ts

      attachments/
        api/
        components/
        hooks/
        queries/
        types/
        utils/

      chat-info/
        components/
        hooks/
        index.ts

      navigation/
        components/
        hooks/

      socket/
        chat-socket.ts
        chat-events.ts
        chat-socket.types.ts

      pages/
      types/
      index.ts

    calls/
      api/
      components/
      hooks/
      livekit/
      queries/
      socket/
      state/
      types/
      index.ts

    stories/
      api/
      components/
      hooks/
      pages/
      queries/
      state/
      types/
      index.ts

    profile/
      api/
      components/
      hooks/
      pages/
      state/
      types/
      index.ts

  shared/
    api/
      api-client.ts
      query-client.ts
    components/
      ui/
      feedback/
      layout/
      media/
    hooks/
    lib/
      socket/
      storage/
      cloudinary/
    constants/
    types/
    utils/

  styles/
```

Frontend placement rules:

- `shared/` is only for code that is genuinely reusable across multiple top-level modules such as `auth`, `chat`, `calls`, `stories`, and `profile`.
- `modules/chat/` owns the text chat workspace: layout, conversations, messages, composer, attachments, chat info, navigation, and chat socket plumbing.
- `modules/calls/` owns calling as a top-level feature: call logs, call panels, signaling adapters, LiveKit/WebRTC-specific helpers, call socket hooks, and call state.
- `modules/stories/` owns stories as a top-level feature: story upload, viewing, state, and story APIs.
- Keep feature-local components, hooks, types, state, utils, and APIs inside the feature folder that owns the behavior.
- Use `api/` for raw HTTP/client functions only. Put TanStack Query wrappers, query keys, cache invalidation helpers, and query-specific mutation hooks in feature-local `queries/`.
- Use `hooks/` for UI/domain hooks that are not primarily TanStack Query wrappers.
- Put exported request/response contracts and reusable domain shapes in feature-local `types/`; keep component-only prop types colocated with the component.
- Put reusable pure helpers in feature-local `utils/` once they are used by more than one file in that feature.
- Use `state/`, not `states/`, for new frontend folders.
- Add `index.ts` barrels only when they make imports clearer and do not hide ownership boundaries.
- Move files in small batches and update imports immediately. Do not do a giant structure rewrite in one pass.

## Frontend Refactor Playbook

Refactors should make the code easier to own without changing user-facing behavior unless the user explicitly asks for behavior changes.

- Refactor in small, buildable batches. Prefer one feature, component family, or root-cause class per pass.
- Before moving code, read the component/hook, its imports, its callers, and nearby feature patterns with `rg`.
- Keep public entry points stable when a move would create churn. Use thin compatibility wrappers temporarily, then delete wrappers only after `rg` and tooling confirm they are unreachable.
- Preserve current UI, copy, socket payloads, cache keys, route behavior, and optimistic message/file/audio flows during architecture refactors.
- When splitting a large component, move pure display logic into child components, reusable orchestration into feature-local `hooks/`, render state into `state/` reducers when it reduces scattered state, and shared pure helpers into feature-local `utils/`.
- Keep refs and non-render objects as refs, not reducer state. Do not store `File`, `Socket`, `MediaStream`, DOM nodes, or `RTCPeerConnection` objects in reducers.
- For reducer refactors, place initial state, action types, and reducer logic in the feature `state/` folder when they are reused or large enough to distract from the hook/component.
- Keep raw HTTP functions in `api/`. Move TanStack Query hooks, query keys, invalidation helpers, and cache update helpers to `queries/`.
- Use real types at module boundaries. Prefer feature-local request/response/socket/cache types over `any`; use `unknown` only for genuinely opaque values that are narrowed before use.
- For socket hooks, keep payloads object-shaped, type event payloads near the owning socket module, and keep socket refs out of render-time return values when callers only need action functions or refs.
- For React context providers, export contexts from non-component context value files and keep provider files focused on components. This preserves Fast Refresh rules.
- When strict ESLint or React Doctor reports a problem, fix the root cause. Do not disable, suppress, or silence a rule unless the item is verified as a true tool false positive and documented.
- Follow React Query v5 names and object syntax. Mutation loading state is `isPending`, not legacy `isLoading`.
- Prefer `useWatch` over broad React Hook Form `watch()` calls in render when strict React compiler rules flag the component.
- After each meaningful frontend refactor batch, run `cd client; npm run type-check`, `cd client; npm run lint`, and `cd client; npm run build`. React Doctor cleanup passes should also run `cd client; npx react-doctor@latest --verbose`.
- If lint-staged/pre-commit tooling is changed, verify the command from `client/` and keep the hook using local package commands, not global tools.

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
2. Move top-level app wiring toward `app/providers`, `app/router`, and `app/store`.
3. Move chat-owned shared code into the correct `modules/chat/*` feature folder: `messages`, `composer`, `attachments`, `chat-info`, `navigation`, `conversations`, or `layout`.
4. Split feature query wrappers into `queries/` while keeping raw transport functions in `api/`.
5. Move call-specific code out of `modules/chat` into top-level `modules/calls`.
6. Move story-specific code out of `modules/chat` into top-level `modules/stories`.
7. Move chat socket hooks and event contracts into `modules/chat/socket` once message/conversation structure is stable.
8. Clean aliases and imports after each batch.
9. Run `cd client; npm run build` after frontend move batches.
10. Refactor backend modules only after the frontend feature structure is stable.
