import {
  deleteNotificationById,
  getAllFollowRequest,
  getAllNotification,
} from "@/api";
import { AngleLeft } from "@/components/icons";
import Avatar from "@/components/shared/Avatar";
import FollowButton from "@/components/shared/FollowButton";
import UsernameLink from "@/components/shared/UsernameLink";
import { makeRequest } from "@/config/api.config";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { tranformUrl } from "@/lib/utils";
import { Trash2 } from "lucide-react";

const Notification = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [request, setRequest] = useState<any[]>([]);
  const [showFollowRequests, setShowFollowRequest] = useState<boolean>(false);

  const getAllNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = (await getAllNotification()) as any;

      if (res.isSuccess) {
        console.log(res.data);
        setNotifications(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllNotifications();
  }, [getAllNotifications]);

  const getAllFollowRequestForUser = useCallback(async () => {
    const res = (await getAllFollowRequest()) as any;
    setRequest(res?.followRequest || []);
  }, []);

  useEffect(() => {
    getAllFollowRequestForUser();
  }, [getAllFollowRequestForUser]);

  const handleAccept = async (requestId: string, accept: boolean) => {
    if (accept) {
      await makeRequest.patch(`/accept/${requestId}`);
      getAllFollowRequestForUser();
      getAllNotifications();
      return;
    }
  };

  const deleteNotification = async (id: string, groupId: string) => {
    console.log(id, groupId);

    const newNotications = notifications
      .map((g) => {
        if (g._id === groupId) {
          console.log(g.notifications, {
            ...g,
            notifications: g.notifications.filter((n: any) => n._id !== id),
          });
          return {
            ...g,
            notifications: g.notifications.filter((n: any) => n._id !== id),
          };
        } else {
          return g;
        }
      })
      .filter((n) => n.notifications.length > 0);

    setNotifications(newNotications);

    const res = await deleteNotificationById(id);
    console.log(res);
  };

  return (
    <div className="h-dvh scrollbar-none w-full bg-background  text-primary border-r-[1px] border-l-[1px] flex overflow-y-scroll  border-border  drop-shadow-xl flex-1 flex-col rounded-r-xl">
      {!showFollowRequests && (
        <>
          <div className="p-2 w-full flex justify-between">
            <h1 className="text-2xl font-semibold  flex items-center gap-4">
              Notifications
            </h1>
          </div>
          {!!request.length && (
            <div className="w-full px-2">
              <button
                onClick={() => setShowFollowRequest(true)}
                className="dark:text-white"
              >
                Follow Requests ({request.length})
              </button>
            </div>
          )}
          <ul className=" w-full h-full flex flex-col gap-2 text-white">
            {notifications.length <= 0 && loading && (
              <div>Loading notifications</div>
            )}
            {notifications.length <= 0 && !loading && (
              <div>No Notification</div>
            )}
            {notifications?.map((date) => {
              return (
                <div key={date._id}>
                  {date.notifications.length > 0 && (
                    <div className="px-2 pt-2">
                      <span>
                        {moment(date._id).calendar({
                          sameDay: "[Today]",
                          nextWeek: "dddd",
                          lastDay: "[Yesterday]",
                          lastWeek: "[Last] dddd",
                          sameElse: "DD/MM/YYYY",
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 p-2">
                    {date?.notifications.map((noti: any) => {
                      return (
                        <Noti
                          key={noti._id}
                          n={noti}
                          handleAccept={handleAccept}
                          deleteNotification={(id: string) =>
                            deleteNotification(id, date._id)
                          }
                          groupId={date._id}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </ul>
        </>
      )}
      {showFollowRequests && (
        <>
          <div className="w-full p-2 pb-2 flex justify-between">
            <h1 className="text-2xl font-semibold dark:text-gray-50 flex items-center gap-4">
              <button
                className="text-2xl"
                onClick={() => setShowFollowRequest(false)}
              >
                <AngleLeft />
              </button>
              Follow Request
            </h1>
          </div>
          <ul className=" flex flex-col gap-2 ">
            {request?.map((n: any) => (
              <>
                <li className="flex p-2 items-center gap-4">
                  <Avatar
                    src={n.requestedBy?.avatar?.url}
                    className={"size-9 rounded-full"}
                  />
                  <UsernameLink
                    onClick={() => {}}
                    className="flex-1"
                    username={n.requestedBy.username}
                  >
                    {n.requestedBy.username}
                  </UsernameLink>
                  <div className="flex gap-3">
                    <button
                      className="text-sm bg-blue-600 hover:bg-blue-700 px-2 rounded-xl text-sky-100 py-1"
                      onClick={() => handleAccept(n._id, true)}
                    >
                      Accept
                    </button>
                    <button
                      className="text-sm text-red-600 border border-transparent hover:text-red-500 hover:border-red-600 bg-zinc-950 px-2 rounded-xl  py-1"
                      onClick={() => handleAccept(n._id, false)}
                    >
                      Decline
                    </button>
                  </div>
                </li>
              </>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Notification;

const Noti = ({ n, handleAccept, deleteNotification }: any) => {
  switch (n.type) {
    case "FOLLOW_REQUEST_ACCEPTED": {
      return (
        <li
          key={n.postId}
          className="flex justify-between gap-4 items-center rounded-md"
        >
          <Avatar
            src={n.user?.avatar?.url}
            className={"size-8 rounded-full object-cover"}
          />
          <NotificationText
            text={n.text}
            username={n.user.username}
            date={n.createdAt}
          />

          <FollowButton
            isFollow={n.user.isFollow}
            userId={n.user._id}
            callBack={(data: any) => {
              console.log(data);
            }}
            showRemoveFollowerBtn={false}
            isRequested={false}
            isPrivate={false}
          />

          <button onClick={deleteNotification}>delete</button>
        </li>
      );
    }
    case "FOLLOWING": {
      return (
        <li
          key={n.postId}
          className=" dark:text-gray-50 group flex justify-between gap-4 items-center rounded-md"
        >
          <Avatar
            src={n.user.avatar?.url}
            className={"size-8 rounded-full object-cover"}
          />
          <NotificationText
            text={n.text}
            username={n.user.username}
            date={n.createdAt}
          />
          <div className="translate-x-10 group-hover:translate-x-0 transition-transform">
            <FollowButton
              isFollow={n.user.isFollow}
              userId={n.user._id}
              callBack={function () {
                throw new Error("Function not implemented.");
              }}
              showRemoveFollowerBtn={false}
              isRequested={false}
              isPrivate={false}
            />
          </div>

          <button
            className="translate-x-10 group-hover:translate-x-0 transition-transform"
            onClick={() => deleteNotification(n._id)}
          >
            <Trash2 />
          </button>
        </li>
      );
    }
    case "LIKE_POST": {
      return (
        <li
          key={n.postId}
          className=" flex group justify-between w-full gap-4 items-center rounded-md"
        >
          <Avatar
            src={n.user.avatar?.url}
            className={"size-8 rounded-full object-cover"}
          />
          <NotificationText
            text={n.text}
            username={n.user.username}
            date={n.createdAt}
          />

          <div className="cursor-pointer translate-x-10 group-hover:translate-x-0 transition-transform">
            <img
              key={n?.postId?.images}
              src={tranformUrl(n?.postId?.images[0]?.url, 50) ?? undefined}
              alt={n.postId?.images[0]?.url}
              className={"size-10 object-cover rounded"}
            />
          </div>

          <button
            className="translate-x-10 group-hover:translate-x-0 transition-transform"
            onClick={() => deleteNotification(n._id)}
          >
            <Trash2 />
          </button>
        </li>
      );
    }
    case "COMMENT_POST": {
      return (
        <li
          key={n.postId}
          className=" dark:text-gray-50 group flex justify-between gap-4 items-center rounded-md"
        >
          <Avatar
            src={n.user.avatar?.url}
            className={"size-8 rounded-full object-cover"}
          />
          <NotificationText
            text={n.text}
            username={n.user.username}
            date={n.createdAt}
          />

          <button
            className="translate-x-10 group-hover:translate-x-0 transition-transform"
            onClick={() => deleteNotification(n._id)}
          >
            <Trash2 />
          </button>
        </li>
      );
    }
    default: {
      return (
        <li
          key={n.postId}
          className=" dark:text-gray-50 group flex justify-between gap-4 items-center rounded-md"
        >
          <Avatar
            src={n.user.avatar?.url}
            className={"size-8 rounded-full object-cover"}
          />
          <NotificationText
            text={n.text}
            username={n.user.username}
            date={n.createdAt}
          />
          <div className="translate-x-10 group-hover:translate-x-0 transition-transform">
            <div className="flex gap-3">
              <button
                className="text-sm bg-blue-600 hover:bg-blue-700 px-2 rounded-xl text-sky-100 py-1"
                onClick={() => handleAccept(n._id, true)}
              >
                Accept
              </button>
              <button
                className="text-sm text-red-600 border border-transparent hover:text-red-500 hover:border-red-600 bg-zinc-950 px-2 rounded-xl  py-1"
                onClick={() => handleAccept(n._id, false)}
              >
                Decline
              </button>
            </div>
          </div>

          <button
            className="translate-x-10 group-hover:translate-x-0 transition-transform"
            onClick={() => deleteNotification(n._id)}
          >
            <Trash2 />
          </button>
        </li>
      );
    }
  }
};

function NotificationText({ text, username, date }: any) {
  return (
    <div className="flex-1">
      <p className=" text-sm leading-tight">
        <UsernameLink username={username}>{username}</UsernameLink>
        <span> {text}</span>
      </p>
      <p className="text-txs">{moment(date).calendar()}</p>
    </div>
  );
}
