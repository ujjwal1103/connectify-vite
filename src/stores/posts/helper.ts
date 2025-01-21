

import { IPost } from '@/lib/types';

export const deduplicatePosts = (newPosts: IPost[], existingPosts: IPost[]) =>
  newPosts.filter(
    (newPost) =>
      !existingPosts.some((existingPost) => existingPost._id === newPost._id)
  );

