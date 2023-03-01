import { Application } from "./deps/oak.ts";
import { router as rootRouter } from "./src/interface/transport/http/root_controller/mod.ts";
import { router as gameRouter } from "./src/interface/transport/http/game_controller/mod.ts";
import { router as gameSocketRouter } from "./src/interface/transport/socket/game_socket/mod.ts";

const app = new Application();

app.use(rootRouter.routes());
app.use(gameRouter.routes());
app.use(gameSocketRouter.routes());

await app.listen({ port: 8000 });
