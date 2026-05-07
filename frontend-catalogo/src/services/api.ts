import axios, { AxiosError } from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
};

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const responseMessage = axiosError.response?.data?.message;

    if (Array.isArray(responseMessage)) {
      return responseMessage.join(' ');
    }

    if (responseMessage) {
      return responseMessage;
    }

    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }

    if (axiosError.code === 'ECONNABORTED') {
      return 'A API demorou para responder. Tente novamente.';
    }

    if (!axiosError.response) {
      return 'Nao foi possivel conectar com a API.';
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado.';
}
