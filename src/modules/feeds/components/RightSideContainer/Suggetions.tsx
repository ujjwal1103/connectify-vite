import Suggetion from './suggetion'

// import UserLoading from "../../common/loading/UserLoading";
import { Link } from 'react-router-dom'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import { IUser } from '@/lib/types'
import { faker } from '@faker-js/faker'

const Suggetions = () => {
  const { suggetions, loading } = useGetSuggestedUsers() as any

  return (
    <div className="hidden divide-y-[0.5px] divide-y-reverse divide-solid divide-secondary text-foreground md:block">
      {suggetions?.length > 0 && (
        <div className="flex items-center justify-between py-2 text-xl text-foreground">
          <span>Suggested for you {faker.person.firstName()}</span>
          <Link
            to="/explore"
            className="text-link text-sm text-blue-500 hover:underline hover:underline-offset-2"
          >
            see all
          </Link>
        </div>
      )}
      <div className="rounded bg-background px-2">
        {!loading &&
          suggetions
            ?.slice(0, 10)
            ?.map((u: IUser) => <Suggetion key={u?._id} user={u} />)}
      </div>
    </div>
  )
}
export default Suggetions
