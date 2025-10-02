import { JwtUser } from "@shared/contract";

declare module "express-serve-static-core" {
	interface Request {
		user?: JwtUser;
	}
}
