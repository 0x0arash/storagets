# StorageTS

A type-safe localStorage wrapper for React applications with built-in validation support.

## Features

- 🦾 Type-safe storage operations
- ✨ Built-in validation support
- 🔄 Automatic state synchronization
- 📦 Zero dependencies (except React)
- 🎯 Next.js compatible with "use client" support

## Installation

```bash
npm install @arashgh/storagets
# or
yarn add @arashgh/storagets
# or
pnpm add @arashgh/storagets
```

## Basic Usage

```tsx
import { useStorageTS } from "@arashgh/storagets";

function Counter() {
  const [storage, setStorage] = useStorageTS("my-counter", {
    count: 0,
  });

  return (
    <div>
      <p>Count: {storage.count}</p>
      <button
        onClick={() =>
          setStorage((prev) => ({
            ...prev,
            count: prev.count + 1,
          }))
        }
      >
        Increment
      </button>
    </div>
  );
}
```

## Type-Safe Validation

```tsx
interface UserPreferences {
  theme: "light" | "dark";
  fontSize: number;
}

function Settings() {
  const [preferences, setPreferences] = useStorageTS<UserPreferences>(
    "user-preferences",
    {
      theme: "light",
      fontSize: 16,
    },
    (value) => {
      const v = value as UserPreferences;
      if (v.theme !== "light" && v.theme !== "dark") {
        throw new Error("Invalid theme");
      }
      if (
        typeof v.fontSize !== "number" ||
        v.fontSize < 12 ||
        v.fontSize > 24
      ) {
        throw new Error("Invalid font size");
      }
      return v;
    }
  );

  return (
    <div>
      <select
        value={preferences.theme}
        onChange={(e) =>
          setPreferences((prev) => ({
            ...prev,
            theme: e.target.value as "light" | "dark",
          }))
        }
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

## Using with Zod

```tsx
import { z } from "zod";
import { useStorageTS } from "@arashgh/storagets";

const UserSchema = z.object({
  name: z.string().min(2),
  age: z.number().min(0).max(120),
  preferences: z.object({
    theme: z.enum(["light", "dark"]),
    notifications: z.boolean(),
  }),
});

type User = z.infer<typeof UserSchema>;

function UserProfile() {
  const [user, setUser] = useStorageTS<User>(
    "user-profile",
    {
      name: "",
      age: 0,
      preferences: {
        theme: "light",
        notifications: true,
      },
    },
    (value) => UserSchema.parse(value)
  );

  return (
    <div>
      <input
        type="text"
        value={user.name}
        onChange={(e) =>
          setUser((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
      />
    </div>
  );
}
```

## API Reference

### `useStorageTS<T>`

```tsx
function useStorageTS<T extends Record<string, unknown>>(
  key: string,
  defaultValue: T,
  validatorFn?: (data: unknown) => T
): [
  T,
  (updateOrValue: T | ((prev: T) => T), options?: { merge?: boolean }) => void,
];
```

#### Parameters

- `key`: Storage key for localStorage
- `defaultValue`: Default value if nothing is stored
- `validatorFn`: (Optional) Validation function that throws on invalid data

#### Returns

A tuple containing:

- Current state (`T`)
- Setter function that accepts either:
  - New value of type `T`
  - Update function `(prev: T) => T`
  - Optional `merge` option for partial updates

## Partial Updates

```tsx
const [userData, setUserData] = useStorageTS("user-data", {
  name: "",
  settings: { theme: "light" },
});

// Merge update
setUserData({ settings: { theme: "dark" } }, { merge: true });
```

## TypeScript Support

StorageTS is written in TypeScript and provides full type safety out of the box. It will show type errors for:

- Invalid data structures
- Incorrect property access
- Type mismatches in update functions

## License

MIT

## Author

[Arash Ghorban](https://github.com/0x0arash)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
