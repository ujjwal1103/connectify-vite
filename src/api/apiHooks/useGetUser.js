import React, { useCallback, useEffect, useState } from "react";
import { getCurrentUser } from "..";
import { useProfileSlice } from "../../redux/services/profileSlice";

const useGetUser = () => {
  const {user, setUser} = useProfileSlice()
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const getUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.user);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return { user, setUser, isLoading, isError };
};

export default useGetUser;
