import { useFilterStore } from '../state/filterStore';
import { StatusChip } from './StatusChip';

export const ActiveFilterSummary = () => {
  const filters = useFilterStore((state) => state.filters);
  return (
    <div className="card-surface flex flex-wrap items-center gap-3">
      <StatusChip tone="info" label={`Range: ${filters.dateRange.toUpperCase()}`} />
      <StatusChip tone="neutral" label={`Segment: ${filters.segment}`} />
      <StatusChip tone="neutral" label={`Region: ${filters.region}`} />
      <StatusChip tone="neutral" label={`Vertical filter: ${filters.vertical}`} />
    </div>
  );
};
