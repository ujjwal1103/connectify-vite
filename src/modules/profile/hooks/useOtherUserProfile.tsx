import { getUserByUsername } from '@/api'
import { IUser } from '@/lib/types'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

const useOtherUserProfile = () => {
  const { username } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const initialTab = query.get('tab') || 'posts'
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserDetails = useCallback(async () => {
    try {
      const res = (await getUserByUsername(username!)) as any
      if (res.user) {
        console.log(res)
        setUser(res.user)
      }
      setLoading(false)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [username])

  useEffect(() => {
    fetchUserDetails()
  }, [fetchUserDetails])
  return {
    loading,
    user,
    navigate,
    initialTab,
    username,
    refetch: fetchUserDetails,
  }
}

export default useOtherUserProfile
