import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUIStore } from "@shared/state/uiStore";

export const useUrlSync = () => {
  const filters = useUIStore((state) => state.filters);
  const setFilters = useUIStore((state) => state.setFilters);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const next: Partial<typeof filters> = {};
    const module = params.get("module");
    if (module) next.module = module as typeof filters.module;
    const environment = params.get("env");
    if (environment) next.environment = environment as typeof filters.environment;
    const from = params.get("from");
    const to = params.get("to");
    if (from && to) {
      next.dateRange = { from, to };
    }
    const segment = params.get("segment");
    if (segment) next.segment = segment;
    if (Object.keys(next).length) {
      setFilters(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("module", filters.module);
    params.set("env", filters.environment);
    params.set("from", filters.dateRange.from);
    params.set("to", filters.dateRange.to);
    params.set("segment", filters.segment);
    const serialized = params.toString();
    if (serialized !== location.search.replace(/^[?]/, "")) {
      navigate({ search: serialized }, { replace: true });
    }
  }, [filters, location.search, navigate]);
};
