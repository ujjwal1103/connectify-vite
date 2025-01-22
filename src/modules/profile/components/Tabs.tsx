import { TabControl } from '@/components/shared/TabControl'
import { useState } from 'react'
import Followers from './Followers'
import Following from './Following'
import { ChevronLeft } from 'lucide-react'

const Tabs = ({ userId, activeTab, onClose, disabledTabs, username }: any) => {
  const [selectedTab, setSelectedTab] = useState(activeTab || 'followers')

  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="z-20 flex items-center gap-2 bg-background p-2 sm:hidden">
        <button onClick={onClose}>
          <ChevronLeft />
        </button>

        <span>{username}</span>
      </div>
      <hr className='border-[#595959]'/>
      <div className="flex items-center">
        <TabControl
          tabId={'bubble'}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          tabs={[
            {
              name: 'Followers',
              id: 'followers',
              disabled: disabledTabs.followers,
            },
            {
              name: 'Following',
              id: 'following',
              disabled: disabledTabs.following,
            },
          ]}
        />
      </div>

      <div
        className="flex h-full overflow-y-scroll scrollbar-none"
        id="scrollfollowers"
      >
        {selectedTab === 'followers' && <Followers userId={userId} />}
        {selectedTab === 'following' && <Following userId={userId} />}
      </div>
    </div>
  )
}

export default Tabs
