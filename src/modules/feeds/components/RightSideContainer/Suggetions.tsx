import Suggetion from './suggetion'

// import UserLoading from "../../common/loading/UserLoading";
import { Link } from 'react-router-dom'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import { IUser } from '@/lib/types'

const Suggetions = () => {
  const { suggetions, loading } = useGetSuggestedUsers() as any

  return (
    <div className="hidden w-full rounded-md p-2 bg-background-dark shadow-md shadow-black text-foreground md:block"
    style={{
      boxShadow: 'box-shadow: 2px 0px 91px -12px rgba(255,255,255,0.75);'
    }}
    >
      {suggetions?.length > 0 && (
        <div className="flex items-center mb-2 justify-between text-lg text-foreground">
          <span>Suggested for you</span>
          <Link
            to="/explore"
            className="text-link text-sm text-blue-500 hover:underline hover:underline-offset-2"
          >
            See all
          </Link>
        </div>
      )}
      <div className="rounded px-2">
        {!loading &&
          suggetions
            ?.slice(0, 10)
            ?.map((u: IUser) => <Suggetion key={u?._id} user={u} />)}
      </div>
    </div>
  )
}
export default Suggetions
