import axios from 'axios';

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data?.message as string | undefined) ||
      (error.response?.data?.error as string | undefined);
    if (message) return message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}
