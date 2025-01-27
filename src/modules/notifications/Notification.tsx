import Avatar from '@/components/shared/Avatar'
import { INotification, NotificationType } from './types'
import { NotificationText } from './NotificationText'
import FollowButton from '@/components/shared/FollowButton'
import { XIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { tranformUrl } from '@/lib/utils'
import FollowRequestButtons from './FollowRequestButtons'

type NotificationProps = {
  notification: INotification
  handleAccept: (requestId: string, accept: boolean) => void
  deleteNotification: (noticationId: string) => void
}
export const Notification = ({
  notification,
  handleAccept,
  deleteNotification,
}: NotificationProps) => {
  switch (notification.type) {
    case NotificationType.FOLLOW_REQUEST_ACCEPTED: {
      return (
        <li className="group flex items-center justify-between gap-4 rounded-md">
          <Avatar
            src={notification.user?.avatar?.url}
            className={'size-8 rounded-full object-cover'}
          />
          <NotificationText
            text={notification.text}
            username={notification.user.username}
            date={notification.createdAt}
          />

          <div className="translate-x-8 transition-transform group-hover:translate-x-0">
            <FollowButton
              isFollow={!!notification.user.isFollow}
              userId={notification.user._id}
              showRemoveFollowerBtn={false}
              isRequested={false}
              isPrivate={false}
            />
          </div>

          <button
            className="translate-x-8  rounded hover:bg-secondary  transition-transform group-hover:translate-x-0"
            onClick={() => deleteNotification(notification._id)}
          >
            <XIcon size={16} />
          </button>
        </li>
      )
    }
    case NotificationType.FOLLOWING: {
      return (
        <li className="group flex items-center justify-between gap-4 rounded-md dark:text-gray-50">
          <Avatar
            src={notification.user.avatar?.url}
            className={'size-8 rounded-full object-cover'}
          />
          <NotificationText
            text={notification.text}
            username={notification.user.username}
            date={notification.createdAt}
          />
          <div className="translate-x-8 transition-transform group-hover:translate-x-0">
            <FollowButton
              isFollow={!!notification.user.isFollow}
              userId={notification.user._id}
              showRemoveFollowerBtn={false}
              isRequested={!!notification.user.isRequested}
              isPrivate={!!notification.user.isPrivate}
            />
          </div>
          <button
            className="translate-x-8  rounded hover:bg-secondary  transition-transform group-hover:translate-x-0"
            onClick={() => deleteNotification(notification._id)}
          >
            <XIcon size={16} />
          </button>
        </li>
      )
    }
    case NotificationType.LIKE_POST: {
      return (
        <li className="group flex w-full items-center justify-between gap-4 rounded-md">
          <Avatar
            src={notification.user.avatar?.url}
            className={'size-8 rounded-full object-cover'}
          />
          <NotificationText
            text={notification.text}
            username={notification.user.username}
            date={notification.createdAt}
          />

          <div className="translate-x-8 cursor-pointer transition-transform group-hover:translate-x-0">
            <Link to={`/p/${notification?.postId?._id}`}>
              <img
                src={
                  tranformUrl(notification?.postId?.images[0]?.url, 50) ??
                  undefined
                }
                alt={notification.postId?.images[0]?.url}
                className={'size-10 rounded object-cover'}
              />
            </Link>
          </div>

          <button
            className="translate-x-8  rounded hover:bg-secondary transition-transform group-hover:translate-x-0"
            onClick={() => deleteNotification(notification?._id)}
          >
            <XIcon size={16} />
          </button>
        </li>
      )
    }
    case NotificationType.LIKE_COMMENT: {
      return (
        <li className="group flex w-full items-center justify-between gap-4 rounded-md">
          <Avatar
            src={notification.user.avatar?.url}
            className={'size-8 rounded-full object-cover'}
          />
          <NotificationText
            text={notification.text}
            username={notification.user.username}
            date={notification.createdAt}
          />

          <div className="translate-x-8 cursor-pointer transition-transform group-hover:translate-x-0">
            <Link to={`/p/${notification?.postId?._id}`}>
              <img
                src={
                  tranformUrl(notification?.postId?.images[0]?.url, 50) ??
                  undefined
                }
                alt={notification?.postId?.images[0]?.url}
                className={'size-10 rounded object-cover'}
              />
            </Link>
          </div>

          <button
            className="translate-x-8  rounded hover:bg-secondary  transition-transform group-hover:translate-x-0"
            onClick={() => deleteNotification(notification._id)}
          >
            <XIcon size={16} />
          </button>
        </li>
      )
    }
    case NotificationType.NEW_COMMENT: {
      return (
        <li className="group flex items-center justify-between gap-4 rounded-md dark:text-gray-50">
          <Avatar
            src={notification.user.avatar?.url}
            className={'size-8 rounded-full object-cover'}
          />
          <NotificationText
            text={notification?.text}
            username={notification?.user?.username}
            date={notification?.createdAt}
          />
          <div className="translate-x-8 cursor-pointer transition-transform group-hover:translate-x-0">
            <Link to={`/p/${notification?.postId?._id}`}>
              <img
                src={
                  tranformUrl(notification?.postId?.images[0]?.url, 50) ??
                  undefined
                }
                alt={notification.postId?.images[0]?.url}
                className={'size-10 rounded object-cover'}
              />
            </Link>
          </div>

          <button
            className="translate-x-8  rounded hover:bg-secondary  transition-transform group-hover:translate-x-0"
            onClick={() => deleteNotification(notification._id)}
          >
            <XIcon size={16} />
          </button>
        </li>
      )
    }
    default: {
      return (
        <li className="group flex items-center justify-between gap-4 rounded-md">
          <Avatar
            src={notification.user.avatar?.url}
            className={'size-8 rounded-full object-cover'}
          />
          <NotificationText
            text={notification.text}
            username={notification.user.username}
            date={notification.createdAt}
          />
          <div className="translate-x-8 transition-transform group-hover:translate-x-0">
            <FollowRequestButtons
              handleAccept={handleAccept}
              requestId={notification.requestId!}
            />
          </div>

          <button
            className="translate-x-8  rounded hover:bg-secondary  transition-transform group-hover:translate-x-0"
            onClick={() => deleteNotification(notification._id)}
          >
            <XIcon size={16} />
          </button>
        </li>
      )
    }
  }
}
