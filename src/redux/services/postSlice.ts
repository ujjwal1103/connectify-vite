import { createSlice } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IPost } from "@/lib/types";
import { RootState } from "../store";
import { IBookmark } from "@/interface/interfaces";

interface PostSlice {
  post: IPost | object;
  posts: IPost[];
  loadingPost: boolean;
  error: string | null;
  hasNext: boolean;
  page: number;
  uploadingPost: UploadPost;
  savedPost: IBookmark[];
}

interface UploadPost {
  isUploading: boolean;
  post: IPost | null;
}

const initialState: PostSlice = {
  post: {},
  posts: [],
  loadingPost: true,
  error: null,
  hasNext: false,
  page: 1,
  uploadingPost: {
    isUploading: false,
    post: null,
  },
  savedPost: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      const { data, pagination } = action.payload;
      state.loadingPost = false;
      state.error = null;
      state.hasNext = pagination.hasNext;

      const uniqueNewPosts = data.filter(
        (newPost: IPost) =>
          !state.posts.some((existingPost) => existingPost._id === newPost._id)
      );

      if (state.page === 1) {
        state.posts = uniqueNewPosts;
        return;
      }
      state.posts = [...state.posts, ...uniqueNewPosts];
    },
    setSavedPosts: (state, action) => {
      const newPosts = action.payload;

      const uniqueNewPosts = newPosts.filter(
        (newPost: IPost) =>
          !state.savedPost.some(
            (existingPost) => existingPost._id === newPost._id
          )
      );

      if (state.page === 1) {
        state.savedPost = uniqueNewPosts;
        return;
      }
      state.savedPost = [...state.savedPost, ...uniqueNewPosts];
    },
    addPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
      state.loadingPost = false;
    },
    setError: (state, action) => {
      state.loadingPost = false;
      state.error = action.payload;
    },
    setPost: (state, action) => {
      state.post = action.payload;
    },
    setLoading: (state, action) => {
      state.loadingPost = action.payload;
    },
    deletePost: (state, action) => {
      const postId = action.payload;
      state.posts = state.posts.filter((post) => post._id !== postId);
    },

    setPage: (state, action) => {
      state.page = action.payload;
    },
    setHasNext: (state, action) => {
      state.hasNext = action.payload;
    },
    updateLike: (state, action) => {
      const { postId, like } = action.payload;
      const likePostIndex = state.posts.findIndex(
        (post) => post._id === postId
      );

      if (likePostIndex !== -1) {
        let post = state.posts[likePostIndex];
        state.posts[likePostIndex] = {
          ...post,
          isLiked: like,
          like: like ? post.like + 1 : post.like - 1,
        };
      }
    },
    updatePost: (state, action) => {
      const post = action.payload;
      const postIndex = state.posts.findIndex((p) => p._id === post._id);
      console.log(postIndex, "postIndex");
      if (postIndex !== -1) {
        state.posts[postIndex] = post;
      }
    },
    setUploadingPost: (state, action) => {
      state.uploadingPost.isUploading = action.payload.loading;
      state.uploadingPost.post = action.payload.post;
    },
    reset: () => {
      return initialState;
    },
  },
});

export const {
  setPosts,
  addPost,
  setError,
  setPost,
  deletePost,
  setPage,
  setLoading,
  reset,
  setHasNext,
  updateLike,
  setUploadingPost,
} = postSlice.actions;

export default postSlice.reducer;

export const usePostSlice = () => {
  const postState = useSelector((state: RootState) => state.post);
  const dispatch = useDispatch();
  const actions = postSlice.actions;

  const addPost = useCallback(
    (post: IPost) => {
      dispatch(actions.addPost(post));
      // const u = { ...user, posts: user!.posts + 1 };
      // setUser(u as IUser);
    },
    [dispatch]
  );
  const setPosts = useCallback(
    (data: any) => {
      dispatch(actions.setPosts(data));
    },
    [dispatch]
  );

  const updatePost = useCallback(
    (post: IPost) => {
      dispatch(actions.updatePost(post));
    },
    [dispatch]
  );

  const setUploadingPost = useCallback((data: UploadPost) => {
    dispatch(actions.setUploadingPost(data));
  }, []);

  const setPage = useCallback((page: number) => {
    dispatch(actions.setPage(page));
  }, []);

  const deletePost = useCallback(
    (postId: string) => {
      dispatch(actions.deletePost(postId));
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch(actions.reset());
  }, [dispatch]);

  return {
    ...postState,
    addPost,
    setUploadingPost,
    updatePost,
    setPage,
    setPosts,
    deletePost,
    reset,
  };
};
