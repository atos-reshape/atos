import { stringify } from 'query-string';
import { DataProvider, fetchUtils } from 'ra-core';
import {
  CreateParams,
  DeleteManyParams,
  DeleteParams,
  GetListParams,
  GetManyParams,
  GetManyReferenceParams,
  GetOneParams,
  UpdateManyParams,
  UpdateParams,
} from 'react-admin';

/**
 * Maps react-admin queries to the REST API.
 *
 * @example
 *
 * getList          => GET http://my.api.url/posts?offset=0&limit=25
 * getOne           => GET http://my.api.url/posts/123
 * getManyReference => GET http://my.api.url/posts?author_id=345
 * getMany          => GET http://my.api.url/posts?id=123&id=456&id=789
 * create           => POST http://my.api.url/posts/123
 * update           => PUT http://my.api.url/posts/123
 * updateMany       => PUT http://my.api.url/posts/123, PUT http://my.api.url/posts/456, PUT http://my.api.url/posts/789
 * delete           => DELETE http://my.api.url/posts/123
 * deleteMany       => DELETE http://my.api.url/posts/123, DELETE http://my.api.url/posts/456, DELETE http://my.api.url/posts/789
 *
 */
const CustomDataProvider = (
  apiUrl: string,
  httpClient = fetchUtils.fetchJson,
): DataProvider => ({
  getList: (resource: string, params: GetListParams) => {
    const { page, perPage } = params.pagination;
    // TODO: implement field, and order in the backend.
    // const { field, order } = params.sort;
    const query = {
      ...fetchUtils.flattenObject(params.filter),
      offset: page - 1,
      limit: perPage,
      // Make sure to append language * to the request.
      ...(resource === 'cards' && { language: '*' }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => {
      if (!headers.has('x-total-count')) {
        throw new Error(
          'The X-Total-Count header is missing in the HTTP Response. The jsonServer Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?',
        );
      }
      return {
        data: json,
        total: parseInt(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          headers.get('x-total-count').split('/').pop(),
          10,
        ),
      };
    });
  },

  getOne: (resource: string, params: GetOneParams) => {
    const query = {
      // Make sure to append language * to the request.
      ...(resource === 'cards' && { language: '*' }),
    };

    return httpClient(
      `${apiUrl}/${resource}/${params.id}?${stringify(query)}`,
    ).then(({ json }) => ({
      data: json,
    }));
  },

  getMany: (resource: string, params: GetManyParams) => {
    const query = {
      id: params.ids,
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => ({ data: json }));
  },

  getManyReference: (resource: string, params: GetManyReferenceParams) => {
    const { page, perPage } = params.pagination;
    // TODO: implement field, and order in the backend.
    // const { field, order } = params.sort;
    const query = {
      ...fetchUtils.flattenObject(params.filter),
      [params.target]: params.id,
      offset: page - 1,
      limit: perPage,
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => {
      if (!headers.has('x-total-count')) {
        throw new Error(
          'The X-Total-Count header is missing in the HTTP Response. The jsonServer Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?',
        );
      }
      return {
        data: json,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        total: parseInt(headers.get('x-total-count').split('/').pop(), 10),
      };
    });
  },

  update: (resource: string, params: UpdateParams) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  updateMany: (resource: string, params: UpdateManyParams) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(params.data),
        }),
      ),
    ).then((responses) => ({ data: responses.map(({ json }) => json.id) })),

  create: (resource: string, params: CreateParams) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    })),

  delete: (resource: string, params: DeleteParams) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
    }).then(({ json }) => ({ data: json })),

  deleteMany: (resource: string, params: DeleteManyParams) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'DELETE',
        }),
      ),
    ).then((responses) => ({ data: responses.map(({ json }) => json.id) })),
});

export default CustomDataProvider;
