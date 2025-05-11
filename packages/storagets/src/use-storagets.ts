"use client";

import { useEffect, useState } from "react";
import { StorageValidator } from "./types";

export const useStorageTS = <T extends Record<string, unknown>>(
  key: string,
  defaultValue: T,
  validatorFn?: StorageValidator<T>
): [T, (updateOrValue: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState<T | null>(null);

  const validator = (value: unknown): T | undefined => {
    if (validatorFn) {
      try {
        const validatedValue = validatorFn(value);
        return validatedValue;
      } catch (error) {
        console.error("Validation failed", error);
        return undefined;
      }
    }
    return value as T;
  };

  const setValue = (
    updateOrValue: T | ((prev: T) => T),
    options?: { merge?: boolean }
  ) => {
    if (typeof window === "undefined") {
      return;
    }

    const value =
      typeof updateOrValue === "function"
        ? updateOrValue(state ?? defaultValue)
        : updateOrValue;

    let finalValue = value;

    if (options?.merge) {
      finalValue = { ...state, ...value };
    }

    const validatedValue = validator(finalValue);
    if (validatedValue !== undefined) {
      setState(validatedValue);
      window.localStorage.setItem(key, JSON.stringify(validatedValue));
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const value = window.localStorage.getItem(key);
    if (value) {
      try {
        const validatedValue = validator(JSON.parse(value));
        if (validatedValue !== undefined) {
          setState(validatedValue);
        }
      } catch (error) {
        console.error("Failed to parse value from localStorage", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [state ?? defaultValue, setValue];
};
