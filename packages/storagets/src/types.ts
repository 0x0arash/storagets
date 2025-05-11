export type StorageValidator<T extends Record<string, unknown>> = (
  data: unknown
) => T;
