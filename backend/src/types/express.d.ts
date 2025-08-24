import type { JwtUser } from "./auth";

declare module "express-serve-static-core" {
	interface Request {
		user?: JwtUser;
	}
}
export {};
