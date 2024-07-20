import { getCommentsByPostId, getPostById } from "@/api";
import Avatar from "@/components/shared/Avatar";
import { ImageSlider } from "@/components/shared/ImageSlider/ImageSlider";
import { IPost } from "@/lib/types";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostActions from "../feeds/components/post/PostActions";
import CommentInput from "../feeds/components/post/CommentInput";
import Comments from "@/components/shared/comments/Comments";
import { motion } from "framer-motion";
import { IComment } from "@/interface/interfaces";
import Caption from "../feeds/components/post/Caption";

const Post = () => {
  const { postId } = useParams();
  const [loadingPost, setLoadingPost] = useState(true);
  const [post, setPost] = useState<IPost | null>(null);
  const [error, setError] = useState<boolean>(false);

  const fetchPost = async () => {
    try {
      const res = (await getPostById(postId!)) as any;
      if (res.isSuccess) {
        setPost(res?.post);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoadingPost(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  if (loadingPost && !error) {
    return (
      <div className="flex-1 min-h-full flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 min-h-full flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-1">
      <div className="flex-1 w-1/2">
        <div className="pl-5 pt-5">
          <ImageSlider images={post?.images} aspect={true} readOnly={true} />
        </div>
        <div className="px-4 py-3 h-full ">
          <div className="flex gap-2">
            <div className="flex -space-x-1 ">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="inline-block size-5 rounded-full ring-1 ring-background"
              />
              <img
                alt=""
                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="inline-block size-5 rounded-full ring-1 ring-background"
              />
              <img
                alt=""
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                className="inline-block size-5 rounded-full ring-1 ring-background"
              />
              <img
                alt=""
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="inline-block size-5 rounded-full ring-1 ring-background"
              />
            </div>
            <div>Liked by grace and others</div>
          </div>
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, nulla.
          </div>
        </div>
      </div>
      <div className="flex-1 flex h-dvh flex-col w-1/2">
        <div className="flex-1 flex flex-col h-dvh justify-between">
          <div className="flex  justify-center gap-3 flex-col px-5 py-3">
            <div className="flex items-center gap-3">
              <Avatar src={post?.user?.avatar?.url} className="w-12 h-12" />
              <div className="flex flex-col font-sm">
                <span className="font-semibold">{post?.user?.username}</span>
                <span>{post?.user?.name}</span>
              </div>
            </div>

            {post?.caption && (
              <Caption
                caption={post?.caption}
                user={post?.user}
                showUser={false}
              />
            )}
          </div>
          <CommentComponent post={post} postId={postId} setPost={setPost} />
        </div>
      </div>
    </div>
  );
};

export default Post;

const CommentComponent = ({ post, postId, setPost }: any) => {
  const [reply, setReply] = useState<any>({
    isReply: false,
    commentId: null,
    repliedTo: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<IComment[]>([]);

  const getComments = useCallback(async () => {
    const res = (await getCommentsByPostId(postId as string)) as any;
    setComments(res.comments);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className="flex-1 flex  flex-col overflow-hidden h-full">
      <div className="flex-1  text-sm overflow-y-scroll scrollbar-none ">
        {comments.length > 0 ? (
          <Comments
            postId={postId!}
            setReply={setReply}
            comments={comments}
            isLoading={isLoading}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            No comments found
          </div>
        )}
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        // variants={fadeInUp}
        className="px-3 py-2 bg-zinc-950 w-full flex flex-col"
      >
        <div className="mb-3">
          <PostActions
            post={post!}
            showCommentButton={false}
            onLike={(liked: boolean) => {
              setPost((prev: any) => {
                const p = { ...prev, isLiked: liked } as IPost;
                return p;
              });
            }}
            onBookmark={(bookmark: boolean) => {
              setPost((prev: any) => {
                return {
                  ...prev,
                  isBookmarked: bookmark,
                } as IPost;
              });
            }}
          />
        </div>

        <div className="">
          <CommentInput
            postId={post?._id!}
            onComment={function (): void {
              getComments();
            }}
            setReply={setReply}
            reply={reply}
          />
        </div>
      </motion.div>
    </div>
  );
};
