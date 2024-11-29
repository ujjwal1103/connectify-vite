import { IUser } from '@/lib/types'
import { useState, useCallback, useEffect } from 'react'

type Follow = 'followers' | 'following'

interface FetchResponse<T> {
  [key: string]: T[]
  pagination: any
}

export function useFollow<T extends IUser>(
  getData: (
    page: number,
    userId: string,
    query: string
  ) => Promise<FetchResponse<T>>,
  userId: string,
  query: string,
  key: Follow
) {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [error, setError] = useState<boolean>(false)
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)

  const fetchData = useCallback(async () => {
    if (page === 1 && !query) {
      setIsLoading(true)
    }

    setError(false) // Clear previous errors
    try {
      const res = await getData(page, userId, query)
      setData((prev: T[]) => (page === 1 ? res[key] : [...prev, ...res[key]]))
      setHasNextPage(res.pagination.hasNext)
    } catch {
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }, [page, query, getData, userId, key])

  useEffect(() => {
    setPage(1) // Reset page to 1 on query or userId change
  }, [query, userId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleLoadMore = () => {
    if (hasNextPage && !isLoading) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  return { data, isLoading, error, handleLoadMore, hasNextPage }
}
