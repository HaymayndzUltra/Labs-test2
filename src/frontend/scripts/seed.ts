// Example seed script describing how module fixtures could be pushed to an API.
// In a real environment this would call backend endpoints with authenticated requests.
// Here we simply log the payload to demonstrate schema usage.
import { fixtures } from "../src/data/fixtures";

const payload = Object.entries(fixtures).map(([moduleId, fixture]) => ({
  moduleId,
  kpis: fixture.kpis,
  tables: Object.keys(fixture.tables),
  charts: Object.keys(fixture.charts)
}));

console.log(JSON.stringify({ seeds: payload }, null, 2));
