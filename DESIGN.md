---
name: Chatting Web Application
description: A playful social rich-media messenger for web chat, stories, files, and calls.
colors:
  mint-primary: "#96e6a1"
  lime-highlight: "#d4fc79"
  shell-bg: "#f7f8fb"
  warm-white: "#faf9f6"
  surface: "#ffffff"
  ink: "#121212"
  slate-900: "#0f172a"
  slate-500: "#64748b"
  border-soft: "#e2e8f0"
  media-black: "#09090b"
  story-blue: "#2563eb"
  story-fuchsia: "#d946ef"
  story-amber: "#f59e0b"
  danger: "#ef4444"
typography:
  display:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  headline:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "normal"
  title:
    fontFamily: "Poppins, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Poppins, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  supporting:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Poppins, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  modal: "16px"
  bubble-sent: "18px 18px 0 18px"
  bubble-received: "18px 18px 18px 0"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.mint-primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "#4ade80"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-social:
    backgroundColor: "{colors.story-blue}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    typography: "{typography.body}"
  icon-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "36px"
  input-chat:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px"
    typography: "{typography.body}"
  message-sent:
    backgroundColor: "{colors.mint-primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.bubble-sent}"
    padding: "12px 16px"
    typography: "{typography.body}"
  message-received:
    backgroundColor: "{colors.warm-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.bubble-received}"
    padding: "12px 16px"
    typography: "{typography.body}"
---

# Design System: Chatting Web Application

## 1. Overview

**Creative North Star: "Social Mint Studio"**

This system is a friendly messenger workspace built around soft white product surfaces, mint-green chat actions, and compact social moments. It should feel playful where people and media are involved - stories, avatars, upload states, call status, typing, and empty starts - while the core chat flow stays familiar and quick.

The authenticated app is the source of truth. Marketing sections can be more open and expressive, but app surfaces should stay dense, readable, and recognizable as chat UI. PRODUCT.md says the product must not feel like "a generic SaaS dashboard, a cold enterprise inbox, or an over-decorated social feed"; this visual system enforces that line.

**Key Characteristics:**
- Soft white and slate shell with mint as the core action and message accent.
- Rounded chat-specific shapes: asymmetric bubbles, circular avatars, compact icon buttons, and 8px cards.
- Dark immersive surfaces reserved for media viewers, story viewers, and active call overlays.
- Strong social colors - blue, fuchsia, and amber - reserved for stories, progress, and online presence.
- Familiar controls first: icon buttons, bottom composer, side chat info, modal viewers, and inline sending states.

## 2. Colors

The palette is product-neutral at rest, mint-forward in conversation, and more colorful only when the user is in an explicitly social or media-heavy moment.

### Primary
- **Fresh Mint**: The main chat accent. Use it for sent bubbles, primary chat actions, logo fill, checked controls, edit/save controls, and optimistic sending affordances.
- **Lime Highlight**: A supporting gradient stop used with Fresh Mint in auth and onboarding buttons. It should stay rare; do not use it as a page background.

### Secondary
- **Story Blue**: The social action color for story upload, add-story buttons, progress bars, and discovery actions.
- **Story Fuchsia**: A ring color used only inside multi-color story treatments.
- **Story Amber**: A ring color used only inside multi-color story treatments.

### Neutral
- **Shell Mist**: The app's light background surface for start states and broad chat areas.
- **Warm White**: The received-message and soft chip surface.
- **Surface White**: Primary cards, modals, sidebars, dropdowns, and navigation panels.
- **Ink Black**: Primary text and icons.
- **Slate Deep**: High-contrast dark UI in call overlays and title text.
- **Slate Muted**: Secondary text, helper text, placeholders, timestamps, and inactive labels.
- **Soft Border**: Thin separators, input borders, card borders, and panel dividers.
- **Media Black**: The immersive viewer surface for images, video, stories, and calls.
- **Danger Red**: Destructive actions, failed sending, decline call, and validation errors.

### Named Rules

**The Mint Means Chat Rule.** Fresh Mint is the chat system's core accent. Do not spend it on decorative backgrounds when it is needed for sent messages, primary actions, online state, and focus feedback.

**The Social Color Reserve Rule.** Blue, fuchsia, and amber are reserved for story rings, upload progress, and explicitly social discovery. If they appear everywhere, stories stop feeling special.

## 3. Typography

**Display Font:** Poppins, sans-serif
**Body Font:** Poppins, sans-serif
**Label/Supporting Font:** Montserrat, sans-serif

**Character:** Poppins gives the product a soft, rounded, friendly UI voice. Montserrat appears in supporting marketing/card copy and should remain secondary, never competing with the chat interface.

### Hierarchy
- **Display** (700, 1.875rem, 1.2): Empty-state titles, auth headings, and major page starts.
- **Headline** (600, 1.125rem, 1.35): Chat info titles, modal headings, card titles, and section headers.
- **Title** (600, 1rem, 1.4): Conversation names, story names, profile labels, and list item names.
- **Body** (400, 0.875rem, 1.5): Messages, form text, helper copy, modal body copy, and list descriptions. Long prose should stay under 75ch.
- **Supporting** (400, 0.875rem, 1.6): Marketing/support cards and longer explanatory copy.
- **Label** (600, 0.75rem, normal letter spacing): Story labels, timestamps, badges, counts, and compact metadata.

### Named Rules

**The Product Scale Rule.** Use fixed rem sizes for the app. Do not use fluid hero-style type inside chat panels, sidebars, modals, or message surfaces.

**The Label Quietness Rule.** Labels and timestamps are small and steady. Do not uppercase-track every section; it turns the product into a marketing template.

## 4. Elevation

The system uses a hybrid of flat surfaces and small shadows. Chat and navigation are mostly flat with borders; cards, dropdowns, modals, sidebars, attachment menus, and media/call overlays lift above the shell with controlled shadows. Shadows should clarify layering, not add decoration.

### Shadow Vocabulary
- **Card Shadow** (`box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)`): Small cards, auth cards, and lightweight content containers.
- **Dropdown Shadow** (`box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1)`): Menus, attachment panels, search results, and message action popovers.
- **Overlay Shadow** (`box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25)`): Modals, media viewers, story viewers, and call panels.
- **Sidebar Shadow** (`box-shadow: 10px 0 15px -3px rgba(0, 0, 0, 0.3)`): Large side panels when they slide over content.

### Named Rules

**The Layer Only Rule.** A surface earns a shadow only when it overlaps another surface, opens as a transient layer, or needs to separate from a media backdrop.

## 5. Components

### Buttons
- **Shape:** Primary rectangular buttons use gently curved corners (6px). Icon buttons are circular (9999px).
- **Primary:** Mint background with white text for chat actions; story actions use Story Blue when they create or manage stories.
- **Hover / Focus:** Hover should lighten the active color or add a soft slate hover fill. Focus must be visible with a ring, even though the global CSS currently suppresses outlines.
- **Secondary / Ghost:** Ghost icon buttons use transparent or white backgrounds, black/80 or white/80 icons, and hover fills such as slate-100 or white/10.

### Chips
- **Style:** Chips are rounded pills or soft rounded labels with Warm White or green-100 backgrounds and compact text.
- **State:** Selected or owner/status chips use green text on a light green surface; count badges use black/70 on story rings.

### Cards / Containers
- **Corner Style:** Standard product cards use 8px corners. Story/media/call modals use 8px to 16px depending on scale. Avoid 24px+ cards except legacy marketing tiles already using large radii.
- **Background:** Surface White for cards, Warm White for received messages, Shell Mist for empty-state pages, Media Black for immersive viewers.
- **Shadow Strategy:** Use Card Shadow for static cards and Overlay Shadow for modals. Avoid border plus large blur on the same element.
- **Border:** Use Soft Border for dividers, panel edges, input boundaries, and inactive thumbnails.
- **Internal Padding:** Compact app components use 12px to 16px. Larger auth or landing cards use 24px.

### Inputs / Fields
- **Style:** Chat composer input uses a 6px radius, 1px slate border, 12px padding, and 0.875rem body text.
- **Auth Fields:** Auth/profile fields use bottom borders, floating labels, gray icons, and mint focus color.
- **Focus:** Focus should shift border or icon color to Fresh Mint and preserve keyboard visibility.
- **Error / Disabled:** Errors use Danger Red text and red border accents. Disabled buttons reduce opacity and show not-allowed cursor.

### Navigation
- **Style:** The main chat shell uses a narrow icon rail, a conversation/stories column, and a chat panel. Icons should remain simple outline icons from lucide or the existing SVG set.
- **Active / Hover:** Hover states use slate-100 or mint text. Active states should be visible without relying on color alone.
- **Mobile Treatment:** Collapse side panels and keep chat composer fixed at the bottom; do not shrink text with viewport-based type.

### Message Bubbles
- **Sent:** Fresh Mint with white text and an asymmetric sent radius (18px 18px 0 18px).
- **Received:** Warm White with black text and an asymmetric received radius (18px 18px 18px 0).
- **Files:** File bubbles may use square 6px corners when media thumbnails need a stable frame. Leave extra vertical gap before timestamps for image, video, audio, and document previews.
- **State:** Sending uses an inline Send icon with pulsing state text. Failed uses Danger Red with an alert icon. Edited appears beside the timestamp for both text and captions.

### Stories
- **Style:** Story avatars use circular image frames with 2px ring padding.
- **Ring:** Active story ring is a blue/fuchsia/amber gradient. Empty/add story ring is a neutral slate/white gradient.
- **Badges:** Add buttons are small Story Blue circles. Online state uses emerald dots with a white border.

### Media Viewer
- **Style:** The viewer is dark, centered, and not full-browser opaque content; it keeps room for controls, previous/next actions, and thumbnails.
- **Controls:** Viewer icons are circular 36px to 40px buttons with white/80 text and white/10 hover fill.
- **Thumbnails:** Selected thumbnails use a white border; inactive thumbnails use white/15 and opacity.

### Audio Call Panel
- **Style:** Calls use a compact dark panel with centered avatar, call status, timer, and circular controls.
- **Controls:** Accept is emerald, decline/end is red, mute is a white or white/12 circular control. Animations must include reduced-motion alternatives.

## 6. Do's and Don'ts

### Do:
- **Do** keep the authenticated chat app as the design source of truth; the marketing home page is secondary.
- **Do** use Fresh Mint for sent messages, primary chat actions, online/focus feedback, and the logo.
- **Do** reserve stronger blue/fuchsia/amber color for stories and social discovery moments.
- **Do** keep media type layouts honest: image, video, audio, and document messages need different frames and timestamp spacing.
- **Do** show state inline for sending, failed, edited, typing, recording, uploading, calling, and empty conversations.
- **Do** use lucide icons or the existing outline SVG vocabulary for chat controls.
- **Do** provide avatar initials or icon fallbacks instead of empty `src` values.

### Don't:
- **Don't** make the product feel like "a generic SaaS dashboard, a cold enterprise inbox, or an over-decorated social feed."
- **Don't** use heavy gradients as broad app backgrounds; gradients belong to story rings, auth buttons, and small social moments.
- **Don't** use decorative glass panels, giant hero sections, or marketing card grids inside the chat app.
- **Don't** reinvent standard chat controls for flavor. Composer, attachments, calls, media navigation, and message menus should stay familiar.
- **Don't** show empty states that only say nothing exists; they must help users start a chat, find friends, or add a story.
- **Don't** pair a 1px border with a large soft shadow as decoration. Pick border for resting surfaces or shadow for layers.
- **Don't** hide focus visibility. Any future polish should undo global outline suppression where it harms keyboard use.
