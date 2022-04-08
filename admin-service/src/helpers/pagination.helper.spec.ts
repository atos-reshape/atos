import { getLink } from './pagination.helper';

describe('PaginationHelper', () => {
  describe('getLink', () => {
    it('should return the link', () => {
      /**
       * For instance, if you have 1015 resources, calling GET /data?page=4&per_page=100 will return:
       * </data?page=1&perPage=100>; rel="first",
       * </data?page=11&perPage=100>; rel="last",
       * </data?page=5&perPage=100>; rel="next",
       * </data?page=3&perPage=100>; rel="prev"
       */
      const link = getLink('/data', 100, 4, 1015);

      expect(link).toBe(
        '</data?page=1&perPage=100>; rel="first",' +
          '</data?page=11&perPage=100>; rel="last",' +
          '</data?page=5&perPage=100>; rel="next",' +
          '</data?page=3&perPage=100>; rel="prev"',
      );
    });
  });
});
