export function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

export function getConservationTone(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes('criticamente') || normalized.includes('perigo')) {
    return 'bg-red-100 text-red-700 border-red-200';
  }

  if (normalized.includes('ameac') || normalized.includes('amea')) {
    return 'bg-orange-100 text-orange-700 border-orange-200';
  }

  if (normalized.includes('vulner')) {
    return 'bg-amber-100 text-amber-800 border-amber-200';
  }

  return 'bg-emerald-100 text-emerald-700 border-emerald-200';
}
