import { useMemo } from 'react';
import { formatDistanceToNow, subDays } from 'date-fns';
import { RangeOption, rangeOptions } from '../utils/range-options';

export function useLiveDateRange(rangeId: RangeOption['id']) {
  const option = useMemo(() => rangeOptions.find((range) => range.id === rangeId) ?? rangeOptions[0], [rangeId]);
  const now = new Date();
  const start = subDays(now, option.days - 1);
  return {
    label: option.label,
    description: `${formatDistanceToNow(start, { addSuffix: true })} – now`
  };
}
