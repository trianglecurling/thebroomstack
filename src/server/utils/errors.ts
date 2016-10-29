export class HttpError extends Error {
	constructor(private status: number, message: string) {
		super(message);
	}
	public getStatusCode() {
		return this.status;
	}
}

export class NotFoundError extends HttpError {
	constructor(private resourceName: string) {
		super(404, `Resource not found: ${resourceName}`);
	}
}

export class NotAuthorizedError extends HttpError {
	constructor() {
		super(401, `Unauthorized.`);
	}
}

export class ForbiddenError extends HttpError {
	constructor() {
		super(403, `Forbidden`);
	}
}
