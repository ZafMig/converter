import { createEffect } from 'effector';
import { apiHistory } from '@/api/ApiHistory.ts';
import type { AxiosError } from 'axios'; // Добавляем импорт типа

interface DataParams {
  id: string;
  page?: number;
}

interface DataResponse {
  items: Array<{
    id: string;
    name: string;
  }>;
  total: number;
}

// Расширяем стандартную AxiosError
interface CustomAxiosError extends AxiosError {
  isOffline?: boolean;
}
createEffect<DataParams, DataResponse, CustomAxiosError>(
  async (params) => {
    try {
      const response = await apiHistory.get<DataResponse>('/data', { params });
      return response.data;
    } catch (error: unknown) { // Явно указываем тип unknown
      // Типизируем ошибку
      const axiosError = error as CustomAxiosError;

      if (axiosError.isOffline) {
        const cachedData = localStorage.getItem('cachedData');
        if (cachedData) {
          return JSON.parse(cachedData) as DataResponse;
        }
      }
      throw axiosError;
    }
  }
);
