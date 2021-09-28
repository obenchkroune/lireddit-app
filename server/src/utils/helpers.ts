import Joi from 'joi';
import { FieldError, UsernamePasswordInput } from '../types';

export const validateUserInput = ({
  username,
  password,
}: UsernamePasswordInput): FieldError[] => {
  const schema = Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
  });

  const validate = schema.validate(
    { username, password },
    { abortEarly: false }
  );

  const errors: FieldError[] = [];
  // format errors object
  validate.error?.details.map((error) => {
    errors.push({
      field: error.context?.key!,
      message: error.message,
    });
  });

  return errors;
};
