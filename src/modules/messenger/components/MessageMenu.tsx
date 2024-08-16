import { Menu } from '@/components/shared/SidePannel/SidePannel'

function MessageMenu({ buttonRef, options, setOptions }: any) {
  return (
    <Menu
      triggerRef={buttonRef}
      width={20}
      open={options}
      onClose={() => {
        setOptions(false)
      }}
    >
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[100] mt-2 w-44 rounded-box bg-zinc-900 p-2 shadow"
      >
        <li className="flex flex-row flex-nowrap items-center justify-evenly text-sm">
          <span
            className="p-2"
            onClick={() => {
              setOptions(false)
              console.log('first')
            }}
          >
            🙂
          </span>
          <span
            className="p-2"
            onClick={() => {
              setOptions(false)
              console.log('first')
            }}
          >
            😊
          </span>
          <span
            className="p-2"
            onClick={() => {
              setOptions(false)
              console.log('first')
            }}
          >
            😇
          </span>
          <span
            className="p-2"
            onClick={() => {
              setOptions(false)
              console.log('first')
            }}
          >
            😘
          </span>
          <span
            className="p-2"
            onClick={() => {
              setOptions(false)
              console.log('first')
            }}
          >
            👍
          </span>
        </li>
        <li className="text-sm">
          <span>Profile</span>
        </li>
        <li
          className="text-sm"
          onClick={() => {
            // setIsSelectMessages(true);
          }}
        >
          <span>Select Messages</span>
        </li>
        <li className="text-sm">
          <span>Clear Chat</span>
        </li>
        <li className="text-sm">
          <span>Delete Chat</span>
        </li>
      </ul>
    </Menu>
  )
}

export default MessageMenu
