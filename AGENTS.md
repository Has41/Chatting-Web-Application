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
- Keep feature container components thin. A container should mostly assemble hooks, derived props, and child components; if it grows past roughly 120-150 lines, look for action hooks, permission/derived-data hooks, and child component splits before adding more JSX or handlers.
- Put user-triggered orchestration in feature-local action hooks when it combines confirmation/picker UI, mutations, route navigation, modal open state, and pending flags. Keep the component responsible for wiring the returned state and handlers to child components.
- Split derived permission/display state into focused hooks when it is reused across several child props, such as owner/admin/member checks, sorted member lists, selected IDs, visibility icons, or route/display helpers.
- Keep refs and non-render objects as refs, not reducer state. Do not store `File`, `Socket`, `MediaStream`, DOM nodes, or `RTCPeerConnection` objects in reducers.
- For reducer refactors, place initial state, action types, and reducer logic in the feature `state/` folder when they are reused or large enough to distract from the hook/component.
- Keep raw HTTP functions in `api/`. Move TanStack Query hooks, query keys, invalidation helpers, and cache update helpers to `queries/`.
- Use real types at module boundaries. Prefer feature-local request/response/socket/cache types over `any`; use `unknown` only for genuinely opaque values that are narrowed before use.
- Prefer native `Date` and `Intl.DateTimeFormat` / `Intl.RelativeTimeFormat` for date and time formatting. Add or keep a date library only when native APIs would make the code meaningfully harder to read or less correct.
- For socket hooks, keep payloads object-shaped, type event payloads near the owning socket module, and keep socket refs out of render-time return values when callers only need action functions or refs.
- For React context providers, export contexts from non-component context value files and keep provider files focused on components. This preserves Fast Refresh rules.
- When strict ESLint or React Doctor reports a problem, fix the root cause. Do not disable, suppress, or silence a rule unless the item is verified as a true tool false positive and documented.
- Follow React Query v5 names and object syntax. Mutation loading state is `isPending`, not legacy `isLoading`.
- Prefer `useWatch` over broad React Hook Form `watch()` calls in render when strict React compiler rules flag the component.
- After each meaningful frontend refactor or cleanup batch, verify with `cd client; npm run type-check`, `cd client; npm run lint`, and a full-codebase React Doctor scan with `cd client; npx react-doctor@latest --verbose`.
- Always run React Doctor with approval/escalation in this repo. It regularly needs npm registry/cache access and may hang or fail under sandboxed permissions.
- Run React Doctor in full-codebase mode, not diff-only mode.
- Skip `cd client; npm run build` for routine frontend refactor verification unless the user explicitly asks for a production build, the task changes bundling/build config, or a deployment-ready check is required.
- If lint-staged/pre-commit tooling is changed, verify the command from `client/` and keep the hook using local package commands, not global tools.

## React Call Implementation Plan

Use the installed `.agents/skills/react-call` guidance when a React task needs UI that returns a value to the caller, such as confirmations, call-type pickers, destructive-action prompts, small form modals, context menus, or retryable async dialogs.

Adopt `react-call` gradually. Do not rewrite working modal flows unless the user asks for this migration or the component is already being refactored.

Stage 1: Dependency And Root Setup

- Add `react-call` to `client/package.json` dependencies with `cd client; npm install react-call`.
- Create a feature-aware callable location, such as `client/src/shared/components/callables/` only for cross-module callables, or feature-local callable folders such as `client/src/modules/chat/channels/components/callables/` when the UI belongs to one feature.
- Mount each Callable Root exactly once, high enough that it stays alive while callers use it. Prefer `app/providers/` or the authenticated app shell for cross-module callables.
- Never mount the same Callable Root in multiple route branches or repeated feature components; `react-call` throws when a Callable has multiple live Roots.

Stage 2: Shared Confirmation Callable

- Build a typed `ConfirmAction` Callable for generic yes/no confirmations that currently use custom local modal state.
- Keep per-call data in `ConfirmAction.call({ ... })` props: title, description, confirm label, danger/neutral tone, and optional icon intent.
- Keep app-wide styling/root configuration in Root props only when it truly applies to every call.
- Use native semantic dialog behavior where possible and preserve visible focus states, close buttons, and escape/backdrop behavior.
- Keep Callable files focused on the UI that returns a Response. Do not let feature containers grow because of `react-call`; put Call construction, accepted/cancelled branching, mutations, and route effects in a feature-local action hook.

Stage 3: First Migration Candidates

- Start with `client/src/modules/chat/channels/components/ChannelInfoSidebar.tsx`, because it already has local confirmation state for member actions, leave, and delete.
- Replace local confirmation reducer/state with awaited calls:

```ts
const accepted = await ConfirmAction.call({
  title: "Delete channel?",
  description: "This cannot be undone.",
  confirmLabel: "Delete",
  tone: "danger"
})

if (!accepted) return
```

- Keep the existing backend mutations, query invalidation, route behavior, and visible copy unless the user asks for UX changes.
- After moving to `ConfirmAction.call(...)`, slim the original component: move action orchestration to a hook such as `useChannelInfoActions`, move permission/derived data to a hook such as `useChannelInfoPermissions`, and keep extracted display sections under a feature-owned component subfolder.
- After the first migration, search for other local confirmation flows with `rg "ConfirmationModal|window.confirm|confirmLabel|role=\"dialog\"" client/src`.

Stage 4: Calls Module Pickers

- Use `react-call` for UI that should return a selected call action, especially the call-log action menu where the user chooses audio or video.
- Keep private call behavior private-chat only. A picker should return `"audio"`, `"video"`, or `null`; the caller should continue to use `useCallSocket` actions.
- Do not move WebRTC refs, sockets, `MediaStream`, or peer connection objects into Callable props. Pass only serializable/display data and return a small typed response.

Stage 5: Async Mutation Dialogs

- Use `useMutationFlow` from `react-call/mutation-flow` only when a Callable submits async work and should stay open on error so the user can retry.
- Keep raw HTTP in feature `api/` folders and TanStack Query wrappers/cache invalidation in feature `queries/`; the Callable should orchestrate UI, not own transport boundaries.
- Use TanStack Query v5 object syntax inside any query/mutation hooks used by a Callable.

Stage 6: Architecture And Naming Rules

- Use the `react-call` vocabulary exactly:
  - Callable: the `createCallable()` export.
  - Root: the mounted `<Callable />`.
  - Call: one `Callable.call(...)` invocation.
  - Response: the value resolved by a Call.
  - Stack: active Calls rendered by a Root.
  - Upsert: singleton-style `Callable.upsert(...)`.
- Use `call()` for confirmations and pickers where multiple calls may stack.
- Use `upsert()` for singleton UI such as progress, loading, or toast-like surfaces.
- Call `Callable.call(...)` only from client event handlers or effects, never during render.
- Keep Callable prop and response types close to the Callable unless they are reused across modules; then move them to the owning feature `types/`.
- Do not treat a Callable as a normal component with per-instance props. Props passed to `<Callable />` are Root props, not per-call props.

Stage 7: Verification

- After each `react-call` migration batch, run:

```powershell
cd client
npm run type-check
npm run lint
npx react-doctor@latest --verbose
```

- Always run React Doctor as an approved/escalated full-codebase scan.
- Skip `npm run build` unless the user explicitly asks for it, build config changed, or deployment verification is needed.
- Smoke-check the migrated flow manually: open the modal/picker, cancel, confirm, keyboard focus, escape/backdrop behavior, and the original success path.

## Frontend Test Pattern

When adding frontend tests later, use Vitest from the client root and keep tests module-based.

- Put Vitest config at `client/vitest.config.ts` unless the existing Vite config is intentionally extended.
- Keep test files under `client/tests/`, grouped by feature ownership:

```txt
client/tests/
  modules/
    auth/
    chat/
      conversations/
      messages/
      composer/
      attachments/
    calls/
    stories/
    profile/
  shared/
```

- Mirror source ownership in tests. For example, tests for `client/src/modules/calls/hooks/useCallLogActions.ts` belong under `client/tests/modules/calls/`.
- Prefer user-facing behavior tests for components and focused unit tests for pure helpers, reducers, query key builders, and socket payload utilities.
- Keep test fixtures/builders beside the test feature when they are feature-specific. Move them to `client/tests/shared/` only when multiple top-level modules reuse them.
- Do not put tests beside production files unless the repo deliberately changes to colocated tests later.
- Use React Testing Library for component behavior, Vitest for units/mocks, and MSW or small typed fakes for network/socket boundaries when needed.
- Add client scripts such as `test`, `test:watch`, and `test:coverage` only when Vitest is actually introduced.

## Frontend Docs Plan

Add frontend documentation under `client/docs/` when a feature, architecture decision, or integration is complex enough that future work would otherwise require rediscovery.

Use this structure:

```txt
client/docs/
  README.md
  architecture/
    frontend-structure.md
    routing-and-providers.md
    api-and-query-boundaries.md
  modules/
    auth.md
    chat/
      conversations.md
      messages.md
      composer.md
      attachments.md
      channels.md
    calls.md
    stories.md
    profile.md
  integrations/
    sockets.md
    react-call.md
    react-doctor.md
    cloudinary.md
  testing/
    vitest-plan.md
    smoke-checks.md
```

Docs rules:

- Keep `client/docs/README.md` as the entry point with links to the most useful docs.
- Prefer short, decision-focused docs over long tutorials. Document ownership, data flow, commands, gotchas, and extension points.
- Mirror feature ownership from `client/src/modules/`. For example, call log docs belong in `client/docs/modules/calls.md`, while message reaction docs belong in `client/docs/modules/chat/messages.md`.
- Put cross-cutting integration docs in `client/docs/integrations/`, such as Socket.IO contracts, React Doctor cleanup workflow, `react-call` Callable patterns, Cloudinary upload behavior, and future LiveKit/WebRTC notes.
- When changing architecture, socket payloads, cache keys, or reusable workflows, update the matching doc in the same pass.
- Do not document implementation details that are obvious from a small component. Add docs when the code has hidden constraints, multi-file flows, or behavior that would be risky to infer.
- Keep docs behavior-preserving and aligned with `AGENTS.md`, `PRODUCT.md`, and `DESIGN.md`. If a doc conflicts with those files, update the stale file instead of creating competing guidance.
- Use plain Markdown. Mermaid diagrams are allowed for flows such as message sending, call signaling, query invalidation, or provider hierarchy.
- Do not add a docs build system unless the user explicitly asks for a rendered docs site.

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
9. Run `cd client; npm run type-check`, `cd client; npm run lint`, and an approved/escalated full-codebase `cd client; npx react-doctor@latest --verbose` after frontend move batches. Skip `npm run build` unless explicitly requested or build behavior changed.
10. Refactor backend modules only after the frontend feature structure is stable.
