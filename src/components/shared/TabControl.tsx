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
    <div className="flex w-full border-collapse border-y border-secondary">
      {tabs.map((tab: Tab) => {
        const isSelected = selectedTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={cn(
              '3 relative flex h-[40px] w-1/2 flex-1 border-collapse items-center justify-center gap-2 bg-background py-1.5 text-sm font-medium uppercase text-foreground transition hover:text-white/60 focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-45'
            )}
            style={{
              WebkitTapHighlightColor: 'transparent',
            }}
            disabled={tab.disabled}
          >
            {isSelected && (
              <motion.span
                layoutId={tabId}
                className={cn(
                  'absolute inset-0 top-0 z-10 mx-auto h-[5px] rounded-xl bg-foreground mix-blend-exclusion md:top-9 md:w-full',
                  indicatorClasses
                )}
                // style={{ borderRadius: broderRadius }}
                transition={{ duration: 0.2 }}
              />
            )}
            <span
              data-selected={isSelected ? 'true' : 'false'}
              className=" data-[selected=true]:text-blue-800"
            >
              {tab.icon}
            </span>
            { <span className="hidden sm:inline-block">{tab.name}</span>}
          </button>
        )
      })}
    </div>
  )
}
