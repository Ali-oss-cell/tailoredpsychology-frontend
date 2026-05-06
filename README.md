# Next.js template

This is a Next.js template with shadcn/ui.

## API base env helper

Booking availability calls use `NEXT_PUBLIC_API_BASE_URL`.

Create `frontend/.env.local`:

```bash
# Local backend (recommended for development)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

Production example:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.clink.example.com/api
```

Notes:

- The frontend reads this in `src/patient/booking/api.ts`.
- If missing, it falls back to `http://localhost:3001/api`.
- After changing `.env.local`, restart `npm run dev`.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
