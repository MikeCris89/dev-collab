export abstract class CustomError extends Error {
	abstract statusCode: number;
	abstract serialize(): { message: string; code?: string };

	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class NotFoundError extends CustomError {
	statusCode = 404;

	constructor(message = "Not Found") {
		super(message);
	}

	serialize() {
		return { message: this.message, code: "NOT_FOUND" };
	}
}

export class BadRequestError extends CustomError {
	statusCode = 400;

	constructor(message = "Bad Request") {
		super(message);
	}

	serialize() {
		return { message: this.message, code: "BAD_REQUEST" };
	}
}

export class UnauthorizedError extends CustomError {
	statusCode = 401;

	constructor(message = "Unauthorized") {
		super(message);
	}

	serialize() {
		return { message: this.message, code: "UNAUTHORIZED" };
	}
}
