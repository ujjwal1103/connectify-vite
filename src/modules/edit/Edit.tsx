import { ChevronLeft, Loader } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { TabControl } from '@/components/shared/TabControl'
import Setting from '../settings/Settings'
import EditProfile from './EditProfile'

const tabs = [
  {
    name: 'Edit Profle',
    id: 'editProfile',
  },
  {
    name: 'Settings',
    id: 'settings',
  },
]
const Edit = () => {
  const { user, loading } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as string) ?? 'editProfile'
  const navigate = useNavigate()
  if (loading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    )
  }

  if (!user && !loading) {
    return <div>User not found</div>
  }

  return (
    <div className="relative min-h-dvh bg-[#17171a] flex-1 overflow-y-scroll text-sm scrollbar-none md:text-sm">
      <div className="flex h-14 items-center gap-2 bg-black px-3 md:hidden">
        <button className="block md:hidden" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">
          {tab === 'settings' ? 'Settings' : 'Edit profile'}
        </h1>
      </div>
      <div className="sticky top-0 w-full">
        <div className="mx-auto w-screen rounded-sm md:w-1/2 md:pt-3">
          <div className="overflow-clip md:rounded-md">
            <TabControl
              selectedTab={tab}
              setSelectedTab={(t) => setParams({ tab: t }, { replace: true })}
              tabs={tabs}
              tabId={'settingsTabs'}
              indicatorClasses="md:h-full rounded-md md:top-0 p-2"
            />
          </div>
        </div>
      </div>
      {tab === 'editProfile' && <EditProfile />}
      {tab === 'settings' && <Setting />}
    </div>
  )
}
export default Edit
