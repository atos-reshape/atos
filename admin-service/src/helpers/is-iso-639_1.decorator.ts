import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { getAll639_1 } from 'all-iso-language-codes';

function isValidISO639_1(value: string) {
  return getAll639_1().includes(value);
}

export function IsISO639_1(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsISO639_1',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && isValidISO639_1(value);
        },
      },
    });
  };
}
