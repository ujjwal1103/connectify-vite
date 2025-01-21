import { IPost } from "@/lib/types";
import { IBookmark } from "@/interface/interfaces";

export interface UploadPost {
  isUploading: boolean;
  image: string | null;
}

export interface PostState {
  post: IPost | object;
  posts: IPost[];
  loadingPost: boolean;
  error: string | null;
  hasNext: boolean;
  page: number;
  uploadingPost: UploadPost;
  savedPost: IBookmark[];
}

export interface PostActions {
  setPosts: (data: { data: IPost[]; pagination: { hasNext: boolean } }) => void;
  setSavedPosts: (data: IPost[]) => void;
  fetchSelfPosts: () => Promise<void>;
  fetchUserPosts: (userId: string) => Promise<void>;
  addPost: (post: IPost) => void;
  setError: (error: string) => void;
  setPost: (post: IPost | object) => void;
  setLoading: (loading: boolean) => void;
  deletePost: (postId: string) => void;
  setPage: (page: number) => void;
  setHasNext: (hasNext: boolean) => void;
  updateLike: (postId: string, like: boolean) => void;
  updatePost: (post: IPost) => void;
  setUploadingPost: (data: UploadPost) => void;
  reset: () => void;
}
