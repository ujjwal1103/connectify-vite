import Suggetion from './suggetion'

// import UserLoading from "../../common/loading/UserLoading";
import { Link } from 'react-router-dom'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import { IUser } from '@/lib/types'

const Suggetions = () => {
  const { suggestedUsers, loading, remove } = useGetSuggestedUsers() as any

  return (
    <div
      className="hidden w-full rounded-md bg-background-dark p-2 text-foreground shadow-md shadow-card-shadow md:block"
      style={{
        boxShadow: '2px 0px 91px -12px rgba(255,255,255,0.75);',
      }}
    >
      {suggestedUsers?.length > 0 && (
        <div className="mb-2 flex items-center justify-between text-lg text-foreground">
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
          suggestedUsers
            ?.slice(0, 10)
            ?.map((u: IUser) => (
              <Suggetion key={u?._id} user={u} remove={remove} />
            ))}
      </div>
    </div>
  )
}
export default Suggetions
