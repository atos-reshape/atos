import { removeBomFromBuffer } from './remove-bom.helper';

describe('RemoveBom', () => {
  describe('removeBomFromBuffer', () => {
    it('should return the buffer without bom', () => {
      const buffer = Buffer.from('\uFEFFtest');
      const result = removeBomFromBuffer(buffer);
      expect(result).toEqual(Buffer.from('test'));
    });

    it('should return the buffer without bom', () => {
      const buffer = Buffer.from('test');
      const result = removeBomFromBuffer(buffer);
      expect(result).toEqual(buffer);
    });
  });
});
