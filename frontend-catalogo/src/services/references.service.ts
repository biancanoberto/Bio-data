import { api } from './api';
import type { ConservationStatusReference, ReferenceItem } from '../types/animal';

export const referencesService = {
  async listCategories() {
    const response = await api.get<ReferenceItem[]>('/categories');
    return response.data;
  },

  async listBiomes() {
    const response = await api.get<ReferenceItem[]>('/biomes');
    return response.data;
  },

  async listConservationStatuses() {
    const response = await api.get<ConservationStatusReference[]>(
      '/conservation-statuses',
    );
    return response.data;
  },
};
