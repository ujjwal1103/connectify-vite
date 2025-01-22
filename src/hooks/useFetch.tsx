import useFeedStore from '@/stores/Feeds'
import { useCallback, useEffect, useState } from 'react'

interface Pagination {
  hasNext: boolean
}

interface FetchResponse<T> {
  data: T[]
  pagination: Pagination
}

const useFetch = <T,>(
  fetchFunction: (
    page: number,
    params?: Record<string, any>
  ) => Promise<FetchResponse<T>>,
  params?: Record<string, any>,
  deps?: any[]
) => {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)

  const fetchItems = useCallback(async () => {
    page === 1 && setLoading(true)
    const res = await fetchFunction(page, params)
    setItems((prevItems) => [...prevItems, ...res.data])
    setHasNextPage(res.pagination.hasNext)
    setLoading(false)
  }, [page, fetchFunction, deps])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return {
    items,
    page,
    hasNextPage,
    setPage,
    fetchItems,
    loading,
  }
}

export default useFetch

const useFetchFeeds = <T,>(
  fetchFunction: (
    page: number,
    params?: Record<string, any>
  ) => Promise<FetchResponse<T>>,
  params?: Record<string, any>,
  deps?: any[]
) => {
  const { feeds, setFeeds, page, setPage, isLoading, setError, hasNextPage } = useFeedStore()

  const fetchItems = useCallback(async () => {
    try {
      const res = (await fetchFunction(page, params)) as any
      setFeeds(res)
    } catch (error) {
      setError(error)
    }
  }, [page, fetchFunction, deps])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return {
    isLoading,
    feeds,
    setPage,
    page,
    hasNextPage
  }
}

export { useFetchFeeds }
