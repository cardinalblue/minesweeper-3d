import { Application } from "oak";
import { router as rootRouter } from "./src/interface/transport/http/root_controller/mod.ts";
import { router as todoRouter } from "./src/interface/transport/http/todo_controller/mod.ts";

const app = new Application();

app.use(rootRouter.routes());
app.use(todoRouter.routes());

await app.listen({ port: 8000 });
