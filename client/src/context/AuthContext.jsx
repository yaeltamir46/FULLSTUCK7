import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../api/authApi";

const TOKEN_KEY = "craftify_token";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return null;
    }

    const response = await getCurrentUser(token);
    const currentUser = response.data.user;

    setUser(currentUser);
    return currentUser;
  }, [token]);

  useEffect(() => {
    async function restoreSession() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await refreshUser();
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, [token, refreshUser, logout]);

  async function login(email, password) {
    const response = await loginUser({ email, password });
    const { user: loggedInUser, token: receivedToken } =
      response.data;

    localStorage.setItem(TOKEN_KEY, receivedToken);
    setToken(receivedToken);
    setUser(loggedInUser);

    return loggedInUser;
  }

  async function register(userData) {
    const response = await registerUser(userData);
    const { user: registeredUser, token: receivedToken } =
      response.data;

    localStorage.setItem(TOKEN_KEY, receivedToken);
    setToken(receivedToken);
    setUser(registeredUser);

    return registeredUser;
  }

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === "admin",
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, token, isLoading, refreshUser, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}