import {
  deleteNotificationById,
  getAllFollowRequest,
  getAllNotification,
} from '@/api'

import { makeRequest } from '@/config/api.config'
import { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import FollowRequests from './FollowRequests'
import { GroupNotification, INotification } from './types'
import { Notification } from './Notification'
import { LIKE_POST, NEW_COMMENT, NEW_REQUEST } from '@/constants/Events'
import useSocketEvents from '@/hooks/useSocketEvent'
import { useSocket } from '@/context/SocketContext'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const dateOptions = {
  sameDay: '[Today]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: '[Last] dddd',
  sameElse: 'DD/MM/YYYY',
}

const Notifications = () => {
  const [showFollowRequests, setShowFollowRequest] = useState<boolean>(false)
  const { socket } = useSocket()

  const queryClient = useQueryClient()

  const {data, isLoading} = useQuery({
    queryKey:['NOTIFICATIONS'],
    queryFn: getAllNotification,
    _optimisticResults:'optimistic',
  })

  const {data:fData} = useQuery({
    queryKey:['FOLLOW_REQUESTS'],
    queryFn: getAllFollowRequest,
    _optimisticResults:'optimistic',
  })
  
  const notifications = data?.data ?? []
  const followRequests = fData?.followRequest ?? []

  const invalidateQueries = ()=>{
    queryClient.invalidateQueries({queryKey:['NOTIFICATIONS']})
    queryClient.invalidateQueries({queryKey:['FOLLOW_REQUESTS']})
  }

  const handleAccept = async (requestId: string, accept: boolean) => {
    if (accept) {
      await makeRequest.patch(`/accept/${requestId}`)
    } else {
      await makeRequest.patch(`/accept/${requestId}?reject=true`)
    }
    invalidateQueries()
  }

  const deleteNotification = async (id: string, groupId: string) => {
    // const newNotications = notifications
    //   .map((g: GroupNotification) => {
    //     if (g._id === groupId) {
    //       console.log(g.notifications, {
    //         ...g,
    //         notifications: g.notifications.filter((n: any) => n._id !== id),
    //       })
    //       return {
    //         ...g,
    //         notifications: g.notifications.filter((n: any) => n._id !== id),
    //       }
    //     } else {
    //       return g
    //     }
    //   })
    //   .filter((n) => n.notifications.length > 0)
    await deleteNotificationById(id)
    invalidateQueries()
  }

  const handleRequest = () => {
    invalidateQueries()
  }

  const eventHandlers = {
    [NEW_REQUEST]: handleRequest,
    [LIKE_POST]: handleRequest,
    [NEW_COMMENT]: handleRequest,
  }

  useSocketEvents(socket, eventHandlers)

  return (
    <div className="flex h-dvh w-screen flex-1 flex-col overflow-x-hidden overflow-y-scroll bg-background text-primary drop-shadow-xl scrollbar-none md:w-96 md:rounded-r-xl md:border-l-[1px] md:border-r-[1px] md:border-border">
      {!showFollowRequests && (
        <>
          <div className="flex w-full justify-between p-2">
            <h1 className="flex items-center gap-4 text-2xl font-semibold">
              Notifications
            </h1>
          </div>
          {!!followRequests.length && (
            <div className="w-full px-2">
              <button
                onClick={() => setShowFollowRequest(true)}
                className="dark:text-white"
              >
                Follow Requests ({followRequests.length})
              </button>
            </div>
          )}
          <ul className="flex h-full w-full flex-col gap-2 text-white">
            {notifications.length <= 0 && isLoading && (
              <div>Loading notifications</div>
            )}
            {notifications.length <= 0 && !isLoading && (
              <div className='p-2 text-center text-2xl'>No Notification</div>
            )}
            {notifications?.map((date) => {
              return (
                <div key={date._id}>
                  {date.notifications.length > 0 && (
                    <div className="px-2 pt-2">
                      <span>{moment(date._id).calendar(dateOptions)}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 p-2">
                    {date?.notifications.map((noti: INotification) => {
                      return (
                        <Notification
                          key={noti._id}
                          notification={noti}
                          handleAccept={handleAccept}
                          deleteNotification={(id: string) =>
                            deleteNotification(id, date._id)
                          }
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </ul>
        </>
      )}
      {showFollowRequests && (
        <FollowRequests
          requests={followRequests}
          onClose={() => setShowFollowRequest(false)}
          handleAccept={handleAccept}
        />
      )}
    </div>
  )
}

export default Notifications
