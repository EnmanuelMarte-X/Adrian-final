export type Failure<E> = {
	data: null;
	error: E;
};

export type Success<T> = {
	data: T;
	error: null;
};

export type Result<T, E = Error> = Success<T> | Failure<E>;
