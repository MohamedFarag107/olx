export const exclude = <T, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  return Object.fromEntries(
    Object.entries(obj as any).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>;
};
