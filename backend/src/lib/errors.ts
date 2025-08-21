export abstract class CustomError extends Error {
	abstract statusCode: number;
	abstract serialize(): { message: string };

	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class NotFoundError extends CustomError {
	statusCode = 404;

	constructor() {
		super("Not Found");
		Object.setPrototypeOf(this, new.target.prototype);
	}

	serialize() {
		return { message: this.message };
	}
}

export class BadRequestError extends CustomError {
	statusCode = 400;

	constructor(message: string = "Bad Request") {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
	}

	serialize() {
		return { message: this.message };
	}
}

export class UnauthorizedError extends CustomError {
	statusCode = 401;

	constructor(message: string = "Unauthorized") {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
	}

	serialize() {
		return { message: this.message };
	}
}
