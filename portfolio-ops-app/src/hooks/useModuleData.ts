import { useQuery } from '@tanstack/react-query';
import { fixtures, ModuleFixture } from '../data/fixtures';

const fetchModule = async (moduleId: string): Promise<ModuleFixture> => {
  const module = fixtures.find((fixture) => fixture.id === moduleId);
  await new Promise((resolve) => setTimeout(resolve, 240));
  if (!module) {
    throw new Error(`Module ${moduleId} not found`);
  }
  return module;
};

export const useModuleData = (moduleId: string) =>
  useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => fetchModule(moduleId)
  });
