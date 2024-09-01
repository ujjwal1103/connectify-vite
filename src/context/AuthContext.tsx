  import { getCurrentUser } from "@/api";
  import ConnectifyIcon from "@/components/icons/Connectify";
  import PageLoading from "@/components/shared/Loading/PageLoading";
  import useResetStore from "@/hooks/useResetStore";
  import { saveUserAndTokenLocalstorage } from "@/lib/localStorage";
  import { IUser } from "@/lib/types";
  import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
    useCallback,
    useMemo,
  } from "react";
  import { useNavigate } from "react-router-dom";
  import { toast } from "react-toastify";

  interface AuthContextType {
    user: IUser | null;
    login: (res: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
    getUser: () => void;
    updateUser: (user: IUser) => void;
  }
  const toastOptions = {
    icon: <ConnectifyIcon size={34} />,
    closeOnClick: true,
    closeButton: true,
    autoClose: 2000,
    hideProgressBar: false,
  };
  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };

  export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const reset = useResetStore();
    const navigator = useNavigate();

    const getUser = useCallback(async () => {
      try {
        const res = await getCurrentUser();
        if (res.user) {
          setUser(res.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }, []);

    const checkAuthentication = useCallback(async () => {
      setLoading(true);
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          const res = await getCurrentUser();
          if (res.isSuccess && res.user) {
            setUser(res.user);
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      checkAuthentication();
    }, [checkAuthentication]);

    const login = async (res: any): Promise<void> => {
      saveUserAndTokenLocalstorage(res.user, res.accessToken, res.refreshToken);
      await getUser();
      toast.success("Welcome Back!!", toastOptions);
      navigator("/", { replace: true });
    };

    const logout = (): void => {
      reset();
      localStorage.clear();
      setUser(null);
    };

    const updateUser = (data: IUser) => {
      setUser((prev) => (prev ? { ...prev, ...data } : data));
    };

    const value = useMemo(
      () => ({
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        getUser,
        updateUser,
      }),
      [user, loading, getUser]
    );

    return (
      <AuthContext.Provider value={value}>
        {!loading && children}
        {loading && <PageLoading/>}
      </AuthContext.Provider>
    );
  };
