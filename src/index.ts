import { Elysia } from "elysia";
import { api } from "./api";
import cors from "@elysiajs/cors";
import { logger } from "@tqman/nice-logger";

const app = new Elysia().use(cors()).use(logger()).use(api).listen(3000);

console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`);
