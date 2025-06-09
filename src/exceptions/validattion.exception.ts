import { BadRequestException } from '@nestjs/common'
import mongoose from 'mongoose'
import { ErrorCode } from 'src/constants/error-code.constant'

/**
 * ValidationException used to throw validation errors with a custom error code and message.
 * ErrorCode default is V000 (Common Validation)
 */
export class ValidationException extends BadRequestException {
  constructor(error: ErrorCode = ErrorCode.V000, message?: string) {
    super({ errorCode: error, message })
  }
}

/**
 * ValidateId checks if the provided ID is a valid MongoDB ObjectId.
 * If the ID is invalid, it throws a ValidationException with error code E006.
 * @param {string} id - The ID to validate.
 * @throws {ValidationException} If the ID is invalid.
 */
export const ValidateObjectId = (id: string): void => {
  if (!id || mongoose.Types.ObjectId.isValid(id) === false) {
    throw new ValidationException(ErrorCode.E006, 'The provided ID is invalid')
  }
}
