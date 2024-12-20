import { Status } from '@/lib/types'
import { useCallback, useEffect, useState } from 'react'

const useGetQuery = ({
  fn,
  deps = [],
  onSuccess = () => {},
  onError = () => {},
}: any) => {
  const [status, setStatus] = useState<Status>('idel')
  const [data, setData] = useState(null)

  const queryFn = useCallback(async () => {
    try {
      const res = await fn()
      if (res) {
        setData(res)
        onSuccess(res)
        setStatus('success')
      }
    } catch (error: any) {
      onError(error)
      setStatus('error')
    }
  }, deps)

  useEffect(() => {
    queryFn()
  }, [queryFn])

  const refech = () => {
    queryFn()
  }

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  return { data, status, refech, setData, isLoading, isSuccess }
}

export { useGetQuery }
