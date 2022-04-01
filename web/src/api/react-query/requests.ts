export const executeRequest = async <TResponse = any>(
  path: string,
  requestInit?: RequestInit
): Promise<TResponse> => {
  const response = await fetch(path, requestInit);
  const json = await response
    .json()
    .then((original) => original)
    .catch(() => {
      const error: any = {
        code: response.status,
        message: response.statusText,
        errors: {}
      };

      return error;
    });

  if (!response.ok) {
    return Promise.reject(json);
  }

  return json as TResponse;
};

export const defaultFetch = async <TResponse = any>(
  path: string,
  queryParams?: Record<string, any>
): Promise<TResponse> => {
  return executeRequest<TResponse>(path, queryParams);
};

export const defaultCreate = <TRequest = any, TResponse = TRequest>(
  path: string
) => {
  return async (values: TRequest): Promise<TResponse> => {
    return executeRequest<TResponse>(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    });
  };
};

export const defaultUpdate =
  <TRequest = any, TResponse = TRequest>(
    path: string,
    queryParams?: Record<string, any>
  ) =>
  async (values: TRequest): Promise<TResponse> => {
    return executeRequest<TResponse>(path, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    });
  };

export const defaultDelete =
  <TResponse = any>(path: string) =>
  async (): Promise<TResponse> => {
    return executeRequest<TResponse>(path, {
      method: 'DELETE'
    });
  };
