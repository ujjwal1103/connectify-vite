import { getUsersSuggetions } from "@/api";
import { useSuggetionsSlice } from "@/redux/services/suggetionSlice";
import { useState, useCallback, useEffect } from "react";

const fetchUsers = (page: number) =>
  getUsersSuggetions(page, 20).then((res: any) => ({
    data: res.users,
    pagination: res.pagination,
  }));

const useGetSuggestedUsers = () => {
  const { suggestedusers: suggetions, setSuggetions } = useSuggetionsSlice();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!suggetions.length || page !== 1) {
      page === 1 && setLoading(true);
      const res = await fetchUsers(page);
      setSuggetions([...suggetions, ...res.data]);
      setHasNextPage(res.pagination.hasNext);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { suggetions, loading, setPage, hasNextPage, page };
};

export default useGetSuggestedUsers;
