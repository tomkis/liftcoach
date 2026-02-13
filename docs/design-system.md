# Design System

All shared UI primitives live in `mobile/ui/ds/`. The philosophy is **separate specialized components over prop-heavy generic components** (e.g. `PrimaryButton` + `OutlineButton`, not `Button variant="outline"`).

## Theme Tokens (`mobile/theme/theme.ts`)

Single source of truth for colors, fonts, spacing, opacity, shadows, border radii, and font sizes. Legacy flat colors have been removed — all colors live directly under `colors`.

Key token groups:

- **spacing** — xs(4) through xxxxl(40)
- **opacity** — overlay, inputText, placeholder, inputBorder, disabled
- **shadow** — card and modal presets

## Component Categories

### Buttons (`ds/buttons/`)

| Component | Purpose |
|-----------|---------|
| `PrimaryButton` | Gold bg, dark text, uppercase |
| `OutlineButton` | Gold border, gold text |

All accept `{ title, onPress, style?, disabled? }`.

### Typography (`ds/typography/`)

| Component | Style |
|-----------|-------|
| `ScreenHeading` | SairaBold 34px uppercase, auto-shrinks on small devices |
| `SectionHeading` | SairaBold 18px uppercase, mb 10 |
| `CardTitle` | SairaCondensedBold 20px uppercase |
| `BodyText` | SairaRegular 14px, lh 24, mb 8 |
| `CaptionText` | SairaRegular 16px center, 70% opacity |

All accept `{ children, style? }`.

### Modals (`ds/modals/`)

| Component | Purpose |
|-----------|---------|
| `ModalShell` | Overlay + content container + title |
| `ConfirmationModal` | ModalShell + confirm/cancel buttons |
| `ScrollableModal` | ModalShell + ScrollView + close button |

### Layout (`ds/layout/`)

| Component | Purpose |
|-----------|---------|
| `ScreenContainer` | Safe area + flex 1 + dark bg + padding 20h |
| `KeyboardScreen` | TouchableWithoutFeedback + KeyboardAvoidingView |
| `ThreeBlockScreen` | Top/middle/bottom sections, keyboard-aware |
| `HorizontalButtonRow` | Row, gap 12, push to bottom |
| `VerticalButtonStack` | Column, gap 20, push to bottom |

### Surfaces (`ds/surfaces/`)

| Component | Purpose |
|-----------|---------|
| `AccentCard` | Card + gold accent bar + optional subtitle |

### Inputs (`ds/inputs/`)

| Component | Purpose |
|-----------|---------|
| `NumericalInput` | Styled numeric TextInput |

### Controls (`ds/controls/`)

| Component | Purpose |
|-----------|---------|
| `Checkbox` | 20x20 box + checkmark + label |
| `SegmentedControl` | Two-option toggle, gold selection |

## Import Convention

Import from the category barrel file:

```ts
import { PrimaryButton } from '@/mobile/ui/ds/buttons'
import { ScreenHeading, BodyText } from '@/mobile/ui/ds/typography'
import { ModalShell } from '@/mobile/ui/ds/modals'
```
