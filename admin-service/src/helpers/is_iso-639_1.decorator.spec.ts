import { IsISO639_1, isValidISO639_1 } from './is-iso-639_1.decorator';
import { Validator } from 'class-validator';

describe('isISO639_1 decorator test', () => {
  describe('isValidISO639_1', () => {
    it('should return true if it is a valid ISO639_1 code', () => {
      expect(isValidISO639_1('en')).toBe(true);
      expect(isValidISO639_1('nl')).toBe(true);
    });
  });

  const validator = new Validator();

  describe('decorator with inline validation', () => {
    class MyClass {
      @IsISO639_1()
      language: string;
    }

    it('it should not return an error when it is a valid ISO639_1 string', () => {
      expect.assertions(1);
      const model = new MyClass();
      model.language = 'en';
      return validator.validate(model).then((errors) => {
        expect(errors.length).toEqual(0);
      });
    });

    it('it should return an error when it is not a valid ISO639_1 string', () => {
      expect.assertions(1);
      const model = new MyClass();
      model.language = 'hello';
      return validator.validate(model).then((errors) => {
        expect(errors.length).toEqual(1);
      });
    });
  });
});
