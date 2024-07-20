import { getSentRequest } from "@/api";
import Avatar from "@/components/shared/Avatar";
import UsernameLink from "@/components/shared/UsernameLink";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const SentRequests: React.FC = () => {
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSentFollowRequests = useCallback(async () => {
    setLoading(true);
    const res = await getSentRequest();
    console.log(res.isSuccess);
    if (res.isSuccess) {
      setSentRequests(res.sentRequests);
    } else {
      setError("Failed to fetch sent requests.");
    }
    setLoading(false);
  }, []);

  const handleCancelRequest = async (requestId: string) => {
    const res = { isSuccess: true };
    if (res.isSuccess) {
      setSentRequests(
        sentRequests.filter((request) => request._id !== requestId)
      );
    } else {
      setError("Failed to cancel request.");
    }
  };

  useEffect(() => {
    fetchSentFollowRequests();
  }, [fetchSentFollowRequests]);

  if (loading) return <div className="p-2">Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-4"
    >
      <h2 className="text-xl font-semibold mb-4">Sent Follow Requests</h2>
      {sentRequests.length === 0 ? (
        <p>No sent requests found.</p>
      ) : (
        <ul className="space-y-4">
          {sentRequests.map((request) => (
            <li
              key={request._id}
              className="flex items-center p-4 group gap-3 rounded-lg bg-secondary"
            >
              <UsernameLink
                username={request.username}
                className="flex items-center gap-3"
              >
                <div>
                  <Avatar src={request?.avatar?.url} className="size-10" />
                </div>
                <div>
                  <p className="font-medium">
                    {request.name} (@{request.username})
                  </p>
                </div>
              </UsernameLink>
              <button
                className="bg-red-500 ml-auto group-hover:bg-red-700  px-2 py-1.5 rounded-lg  transition"
                onClick={() => handleCancelRequest(request._id)}
              >
                <Trash></Trash>
              </button>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default SentRequests;
