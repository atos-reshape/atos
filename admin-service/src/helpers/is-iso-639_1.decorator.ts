import { registerDecorator, ValidationOptions } from 'class-validator';
import { getAll639_1 } from 'all-iso-language-codes';
import { ALL_TRANSLATIONS } from '../card/constants';

export function isValidISO639_1(value: string) {
  return [ALL_TRANSLATIONS, ...getAll639_1()].includes(value);
}

export function IsISO639_1(
  validationOptions: ValidationOptions = {
    message: 'The language is not a valid ISO 639-1 language code.',
  },
): PropertyDecorator {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsISO639_1',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && isValidISO639_1(value);
        },
      },
    });
  };
}
