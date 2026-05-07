import { useCallback, useEffect, useState } from 'react';
import { animalsService } from '../services/animals.service';
import { getApiErrorMessage } from '../services/api';
import type { AnimalDetail } from '../types/animal';

export function useAnimal(id?: string) {
  const [animal, setAnimal] = useState<AnimalDetail | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) {
      setAnimal(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await animalsService.getAnimal(id);
      setAnimal(data);
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

    async function loadInitialAnimal() {
      try {
        const data = await animalsService.getAnimal(animalId);

        if (!isActive) {
          return;
        }

        setAnimal(data);
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

    void loadInitialAnimal();

    return () => {
      isActive = false;
    };
  }, [id]);

  return {
    animal,
    error,
    isLoading,
    refetch,
  };
}
