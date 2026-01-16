export function throwError(exception: any, value: any, message: string) {
  if (!value) {
    throw new exception(message);
  }
}
