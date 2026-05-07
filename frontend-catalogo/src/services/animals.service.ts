import { api } from './api';
import type {
  AnimalDetail,
  AnimalImage,
  AnimalListItem,
  CreateAnimalPayload,
  UpdateAnimalPayload,
  UploadAnimalImagePayload,
} from '../types/animal';

export const animalsService = {
  async listAnimals() {
    const response = await api.get<AnimalListItem[]>('/animals');
    return response.data;
  },

  async getAnimal(id: string) {
    const response = await api.get<AnimalDetail>(`/animals/${id}`);
    return response.data;
  },

  async createAnimal(payload: CreateAnimalPayload) {
    const response = await api.post<AnimalDetail>('/animals', payload);
    return response.data;
  },

  async updateAnimal(id: string, payload: UpdateAnimalPayload) {
    const response = await api.patch<AnimalDetail>(`/animals/${id}`, payload);
    return response.data;
  },

  async deleteAnimal(id: string) {
    await api.delete(`/animals/${id}`);
  },

  async listAnimalImages(id: string) {
    const response = await api.get<AnimalImage[]>(`/animals/${id}/images`);
    return response.data;
  },

  async uploadAnimalImage(id: string, payload: UploadAnimalImagePayload) {
    const formData = new FormData();
    formData.append('file', payload.file);

    if (payload.altText) {
      formData.append('altText', payload.altText);
    }

    if (typeof payload.isCover === 'boolean') {
      formData.append('isCover', String(payload.isCover));
    }

    const response = await api.post<AnimalImage>(
      `/animals/${id}/images`,
      formData,
    );

    return response.data;
  },
};
