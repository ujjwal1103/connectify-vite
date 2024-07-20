import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import MainContainer from "./components/MainContainer";

const AppLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace={true} />;
  }

  return <MainContainer />;
};

export default AppLayout;
