import { getUsersSuggetions } from '@/api'
import useSuggestionStore from '@/stores/suggestions'
import { useState, useCallback, useEffect } from 'react'

//  suggestedUsers: IUser[]
//   loading: boolean
//   setSuggestions: (suggestions: IUser[]) => void
//   removeSuggestion: (id: string) => void
//   reset: () => void

const fetchUsers = (page: number) =>
  getUsersSuggetions(page, 20).then((res: any) => ({
    data: res.users,
    pagination: res.pagination,
  }))

const useGetSuggestedUsers = () => {
  const {
    suggestedUsers,
    setSuggestions,
    removeSuggestion,
  } = useSuggestionStore()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)

  const fetchItems = useCallback(async () => {
    if (!suggestedUsers.length || page !== 1) {
      page === 1 && setLoading(true)
      const res = await fetchUsers(page)
      setSuggestions([...suggestedUsers, ...res.data])
      setHasNextPage(res.pagination.hasNext)
      setLoading(false)
    }
  }, [page])

  const remove = (id: string) => {
    removeSuggestion(id)
  }

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return { suggestedUsers, loading, setPage, hasNextPage, page, remove }
}

export default useGetSuggestedUsers
