export const useRefresh = () => {
  return async (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      fetch('/api/login/openid/refresh').then(async (response) => {
        if (response.ok)
          return response
            .json()
            .then((body: { accessToken: string }) => resolve(body.accessToken));

        if (response.status === 401)
          return window.location.assign('/api/login/openid/azure-ad');

        reject('Incorrect response status');
      });
    });
  };
};
