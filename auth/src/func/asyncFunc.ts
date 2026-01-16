export async function asyncFunc<T>(
  fn: () => Promise<T>,
  onError?: (error: unknown) => void,
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    onError?.(error);
    return null;
  }
}
