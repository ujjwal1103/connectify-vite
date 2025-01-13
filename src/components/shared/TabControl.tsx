import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface Tab {
  name: string
  icon?: any
  id: string
  disabled?: boolean
}

interface TabControlProps {
  selectedTab: string
  setSelectedTab: (id: string) => void
  tabs: Tab[]
  tabId: string
  indicatorClasses?: string
}

export const TabControl = ({
  selectedTab,
  setSelectedTab,
  tabs,
  tabId,
  indicatorClasses = '',
}: TabControlProps) => {
  return (
    <div className="flex w-full">
      {tabs.map((tab: Tab) => {
        return (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={cn(
              'relative flex h-[40px] w-1/2 flex-1 disabled:pointer-events-none disabled:opacity-45 items-center justify-center gap-2 bg-secondary px-3 py-1.5 text-sm font-medium uppercase text-foreground transition hover:text-white/60 focus-visible:outline-2'
            )}
            style={{
              WebkitTapHighlightColor: 'transparent',
            }}
            disabled={tab.disabled}
          >
            {selectedTab === tab.id && (
              <motion.span
                layoutId={tabId}
                className={cn(
                  'absolute inset-0 top-[35px] z-10 h-[5px] rounded-xl w-full bg-foreground mix-blend-exclusion',
                  indicatorClasses
                )}
                // style={{ borderRadius: broderRadius }}
                transition={{ duration: 0.2 }}
              />
            )}
            {tab.icon}
            {tab.name}
          </button>
        )
      })}
    </div>
  )
}
