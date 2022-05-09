import { createContext, ReactElement, useEffect, useState } from 'react';
import { useRefresh } from '../../../../api/requests/tokens';
import { AtosLoadingScreen } from '../../../../components/AtosLoadingScreen/AtosLoadingScreen';

const AuthContext = createContext<string | null>(null);

interface AuthState {
  token: string | null;
  loading: boolean;
}

const AuthProvider = ({
  children
}: {
  children: JSX.Element;
}): ReactElement => {
  const getAccessToken = useRefresh();
  const [authState, setState] = useState<AuthState>({
    token: null,
    loading: true
  });

  useEffect(() => {
    getAccessToken().then((token) => {
      localStorage.setItem('accessToken', token);
      setState({ loading: false, token });
    });
  }, []);

  if (authState?.loading) return <AtosLoadingScreen />;

  return (
    <AuthContext.Provider value={authState.token}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
