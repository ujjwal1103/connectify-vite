import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { makeRequest } from "../../config/api.config";
import { login } from "../../redux/services/authSlice";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthProvider";
import { saveUserAndTokenLocalstorage } from "../../utils/getCurrentUserId";
import { PageLoader } from "../../App";

const Auth = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [loading, setLoading] = useState(true);
  const [usernamePopup, setUsernamePopup] = useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const { login: loginUser } = useAuth();

  const userSignIn = useCallback(
    async (username, password) => {
      setLoading(true);
      try {
        const res = await makeRequest.post("/login", {
          username,
          password,
        });
        saveUserAndTokenLocalstorage(
          res.user,
          res.accessToken,
          res.refreshToken
        );
        loginUser(res?.user);
        dispatch(login({ isAuthenticated: true, user: res?.user }));
        navigator("/");
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch, loginUser, navigator]
  );

  const userSignUp = async () => {
    try {
      const res = await makeRequest.post("/register", {
        username,
        password: user.id,
        email: user.email,
      });
      setLoading(false);
      res && localStorage.setItem("user", JSON.stringify(res));
      navigator("/");
    } catch (error) {
      console.log(error);
    }
  };

  const authenticate = useCallback(async () => {
    try {
      const res = await makeRequest(`/authenticate${location.search}`);

      if (res.isSuccess) {
        if (res.existingUser) {
          userSignIn(res.existingUser.username, res.user.id);
        } else {
          setUser(res.user);
          setLoading(false);
          setUsernamePopup(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [location.search, userSignIn]);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="w-screen h-screen bg-no-repeat bg-cover flex justify-center items-center">
      {usernamePopup && (
        <div className="flex flex-col gap-4">
          <label className="text-gray-50">
            Enter new username to continue
          </label>
          <input
            type="text"
            placeholder="enter yourname"
            value={username}
            className="rounded-md"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={userSignUp}
            className="bg-blue-600 text-white p-2 rounded-md"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;
