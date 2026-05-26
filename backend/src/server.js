import { createServer } from "./app.js";
import { PORT } from "./config/env.js";

const app = createServer();

app.listen(PORT, () => {
  console.log(`Lead management API running on http://localhost:${PORT}`);
});
