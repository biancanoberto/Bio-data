import { useCallback, useEffect, useState } from 'react';
import { animalsService } from '../services/animals.service';
import { getApiErrorMessage } from '../services/api';
import type { AnimalImage } from '../types/animal';

export function useAnimalImages(id?: string) {
  const [images, setImages] = useState<AnimalImage[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) {
      setImages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await animalsService.listAnimalImages(id);
      setImages(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const animalId = id;
    let isActive = true;

    async function loadInitialImages() {
      try {
        const data = await animalsService.listAnimalImages(animalId);

        if (!isActive) {
          return;
        }

        setImages(data);
        setError(null);
      } catch (requestError) {
        if (isActive) {
          setError(getApiErrorMessage(requestError));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialImages();

    return () => {
      isActive = false;
    };
  }, [id]);

  return {
    error,
    images,
    isLoading,
    refetch,
  };
}
