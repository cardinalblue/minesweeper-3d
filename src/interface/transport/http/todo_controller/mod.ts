import { Router } from "oak";

const router = new Router({
  prefix: "/todo",
});

router.get("/", (ctx) => {
  ctx.response.body = "Todo List!";
});

export { router };
