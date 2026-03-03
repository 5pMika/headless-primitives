# @headless-primitives/core

Headless UI primitives with full WCAG 2.2 AA accessibility support.

## Installation

```bash
pnpm add @headless-primitives/core react react-dom
```

## Usage

```tsx
import { Slot, useSlotId } from '@headless-primitives/core';

// Polymorphic rendering with asChild
<Slot asChild>
  <button>Trigger</button>
</Slot>;

// Auto-generated IDs for ARIA
const id = useSlotId(props.id);
```

## Peer Dependencies

- React ^19
- React DOM ^19
