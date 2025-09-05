import { DrizzleQueryError } from 'drizzle-orm';
import { DatabaseError } from 'pg';

const OPSTATUS = {
  SUCCESS: 'SUCCESS',
  // integrity violations
  FOREIGN_KEY_VIOLATION: '23503',
  UNIQUE_VIOLATION: '23505',
  CHECK_VIOLATION: '23514',
  NOT_NULL_VIOLATION: '23502',
  INVALID_ON_CONFLICT_SPECIFICATION: '42P10',

  // transaction failure
  INVALID_TRANSACTION_STATE: '25000',

  // connection failure
  CONNECTION_DOES_NOT_EXIST: '8003',
  CONNECTION_FAILURE: '8006',

  // other
  UNKNOWN_FAILURE: '-1',
};

class PGForeignKeyException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForeignKeyException';
  }
}

class PGUniqueViolationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UniqueViolationException';
  }
}

class PGCheckViolationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CheckViolationException';
  }
}

class PGNotNullViolationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotNullViolationException';
  }
}

class PGInvalidTransactionStateException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTransactionStateException';
  }
}

class PGConnectionDoesNotExistException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConnectionDoesNotExistException';
  }
}

class PGConnectionFailureException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConnectionFailureException';
  }
}

class PGUnknownFailureException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnknownFailureException';
  }
}

class PGInvalidOnConflictSpecificationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOnConflictSpecificationException';
  }
}

export type PGException =
  | PGForeignKeyException
  | PGUniqueViolationException
  | PGCheckViolationException
  | PGNotNullViolationException
  | PGInvalidTransactionStateException
  | PGConnectionDoesNotExistException
  | PGConnectionFailureException
  | PGUnknownFailureException
  | PGInvalidOnConflictSpecificationException;

export const convertToPGError = (error: unknown): PGException => {
  // if error has not originated from pg driver, no useful information can be extracted
  if (
    !(error instanceof DrizzleQueryError) ||
    !(error.cause instanceof DatabaseError) ||
    !error.cause.code
  ) {
    return new PGUnknownFailureException('Unknown error occurred');
  }

  const errorCode = error.cause.code;

  switch (errorCode) {
    case OPSTATUS.FOREIGN_KEY_VIOLATION:
      return new PGForeignKeyException(error.message);
    case OPSTATUS.UNIQUE_VIOLATION:
      return new PGUniqueViolationException(error.message);
    case OPSTATUS.CHECK_VIOLATION:
      return new PGCheckViolationException(error.message);
    case OPSTATUS.NOT_NULL_VIOLATION:
      return new PGNotNullViolationException(error.message);
    case OPSTATUS.INVALID_TRANSACTION_STATE:
      return new PGInvalidTransactionStateException(error.message);
    case OPSTATUS.CONNECTION_DOES_NOT_EXIST:
      return new PGConnectionDoesNotExistException(error.message);
    case OPSTATUS.CONNECTION_FAILURE:
      return new PGConnectionFailureException(error.message);
    case OPSTATUS.INVALID_ON_CONFLICT_SPECIFICATION:
      return new PGInvalidOnConflictSpecificationException(error.message);
    default:
      console.log('Unhandled error code:', errorCode, error);
      return new PGUnknownFailureException('Unknown error occurred');
  }
};

export async function safeQuery<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    throw convertToPGError(e);
  }
}
