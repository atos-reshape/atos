import { Response, Request } from 'express';

export type PaginatedResult<T = unknown> = [T[], number];
type Relation = 'first' | 'next' | 'prev' | 'last';

/**
 * Pagination link creator.
 *
 * For instance, if you have 1015 resources, calling GET /data?page=4&perPage=100 will return:
 * </data?page=1&perPage=100>; rel="first",
 * </data?page=11&perPage=100>; rel="last",
 * </data?page=5&perPage=100>; rel="next",
 * </data?page=3&perPage=100>; rel="prev"
 *
 * @param resourceUrl - The resource url.
 * @param limit - The amount of items on each page.
 * @param offset - The offset of the first item.
 * @param total - The total amount of items.
 */
export function getLink(
  resourceUrl: string,
  limit: number,
  offset: number,
  total: number,
): string {
  const getLine = (page: number, relation: Relation) => {
    return `<${resourceUrl}?page=${page}&perPage=${limit}>; rel="${relation}",`;
  };

  let link = '';

  // First page
  link += getLine(1, 'first');

  // Last page
  const lastPage = Math.ceil(total / limit);
  link += getLine(lastPage, 'last');

  // Next page
  if (offset + limit < total) {
    link += getLine(offset + 1, 'next');
  }

  // Previous page
  if (offset > 0) {
    link += getLine(offset - 1, 'prev');
  }

  // Remove last character from link
  return link.slice(0, -1);
}

/**
 * Pagination helper.
 *
 * @param request - The request object.
 * @param response - The response object.
 * @param data - The data to paginate.
 * @param limit - The limit of the pagination.
 * @param offset - The offset of the pagination.
 */
export function paginate<T = unknown>(
  request: Request,
  response: Response,
  [items, total]: PaginatedResult<T>,
  limit: number,
  offset: number,
) {
  response.setHeader('Link', getLink(request.path, limit, offset, total));
  response.setHeader('total-count', String(total));
  return items;
}
