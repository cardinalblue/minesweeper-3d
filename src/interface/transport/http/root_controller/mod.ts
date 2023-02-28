import { Router } from "oak";

const router = new Router({
  prefix: "/",
});

router.get("/", (ctx) => {
  ctx.response.body = "Hello World!";
});

export { router };
