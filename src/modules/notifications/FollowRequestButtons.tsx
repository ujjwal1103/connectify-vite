interface Props {
  handleAccept: (requestId: string, accept: boolean) => void
  requestId: string
}

const FollowRequestButtons = ({ handleAccept, requestId }: Props) => {
  return (
    <div className="flex gap-3">
      <button
        className="rounded-md bg-blue-600 px-2 py-1 text-sm text-sky-100 hover:bg-blue-700"
        onClick={() => handleAccept(requestId, true)}
      >
        Accept
      </button>
      <button
        className="rounded-md border border-transparent bg-zinc-950 px-2 py-1 text-sm text-red-600 hover:border-red-600 hover:text-red-500"
        onClick={() => handleAccept(requestId, false)}
      >
        Decline
      </button>
    </div>
  )
}

export default FollowRequestButtons
