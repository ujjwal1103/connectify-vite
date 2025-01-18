import React, {
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

export const DEFAULT_INITIAL_CHANNEL_PAGE_SIZE = 25;
export const DEFAULT_NEXT_CHANNEL_PAGE_SIZE = 100;
export const DEFAULT_JUMP_TO_PAGE_SIZE = 100;
export const DEFAULT_THREAD_PAGE_SIZE = 50;
export const DEFAULT_LOAD_PAGE_SCROLL_THRESHOLD = 250;
export const DEFAULT_UPLOAD_SIZE_LIMIT_BYTES = 100 * 1024 * 1024; // 100 MB

export const deprecationAndReplacementWarning = <
  P extends Record<string, unknown>[][]
>(
  pairs: P,
  component: string
) => {
  pairs.forEach((data) => {
    const [[oldName, oldValue], [newName, newValue]] = [
      Object.entries(data[0])[0],
      Object.entries(data[1])[0],
    ];

    if (
      (typeof oldValue !== "undefined" && typeof newValue === "undefined") ||
      (typeof oldValue !== "undefined" && typeof newValue !== "undefined")
    ) {
      console.warn(
        `[Deprecation notice (${component})]: prefer using prop ${newName} instead of ${oldName}`
      );
    }
  });
};

export type PaginatorProps = {
  /** callback to load the next page */
  loadNextPage: () => void;
  /** indicates if there is a next page to load */
  hasNextPage?: boolean;
  /** indicates if there is a previous page to load */
  hasPreviousPage?: boolean;
  /** indicates whether a loading request is in progress */
  isLoading?: boolean;
  /** The loading indicator to use */
  LoadingIndicator?: any;
  /** callback to load the previous page */
  loadPreviousPage?: () => void;
  /**
   * @desc indicates if there's currently any refreshing taking place
   * @deprecated Use loading prop instead of refreshing. Planned for removal: https://github.com/GetStream/stream-chat-react/issues/1804
   */
  refreshing?: boolean;
  /** display the items in opposite order */
  reverse?: boolean;
  /** Offset from when to start the loadNextPage call */
  threshold?: number;
};
const mousewheelListener = (event: Event) => {
  if (event instanceof WheelEvent && event.deltaY === 1) {
    event.preventDefault();
  }
};

export type InfiniteScrollProps = PaginatorProps & {
  className?: string;
  element?: React.ElementType;
  /**
   * @desc Flag signalling whether more pages with older items can be loaded
   * @deprecated Use hasPreviousPage prop instead. Planned for removal: https://github.com/GetStream/stream-chat-react/issues/1804
   */
  hasMore?: boolean;
  /**
   * @desc Flag signalling whether more pages with newer items can be loaded
   * @deprecated Use hasNextPage prop instead. Planned for removal: https://github.com/GetStream/stream-chat-react/issues/1804
   */
  hasMoreNewer?: boolean;
  /** Element to be rendered at the top of the thread message list. By default, Message and ThreadStart components */
  head?: React.ReactNode;
  initialLoad?: boolean;
  isLoading?: boolean;
  listenToScroll?: (
    offset: number,
    reverseOffset: number,
    threshold: number
  ) => void;
  loader?: React.ReactNode;
  /**
   * @desc Function that loads previous page with older items
   * @deprecated Use loadPreviousPage prop instead. Planned for removal: https://github.com/GetStream/stream-chat-react/issues/1804
   */
  loadMore?: () => void;
  /**
   * @desc Function that loads next page with newer items
   * @deprecated Use loadNextPage prop instead. Planned for removal: https://github.com/GetStream/stream-chat-react/issues/1804
   */
  loadMoreNewer?: () => void;
  useCapture?: boolean;
};

export const InfiniteScroll = (
  props: PropsWithChildren<InfiniteScrollProps>
) => {
  const {
    children,
    element = "div",
    hasMore,
    hasMoreNewer,
    hasNextPage,
    hasPreviousPage,
    head,
    initialLoad = true,
    isLoading,
    listenToScroll,
    loader,
    loadMore,
    loadMoreNewer,
    loadNextPage,
    loadPreviousPage,
    threshold = DEFAULT_LOAD_PAGE_SCROLL_THRESHOLD,
    useCapture = false,
    ...elementProps
  } = props;

  const loadNextPageFn = loadNextPage || loadMoreNewer;
  const loadPreviousPageFn = loadPreviousPage || loadMore;
  const hasNextPageFlag = hasNextPage || hasMoreNewer;
  const hasPreviousPageFlag = hasPreviousPage || hasMore;

  const scrollComponent = useRef<HTMLElement>();

  const scrollListenerRef = useRef<() => void>();
  scrollListenerRef.current = () => {
    const element = scrollComponent.current;

    if (!element || element.offsetParent === null) {
      return;
    }

    const parentElement = element.parentElement!;

    const offset =
      element.scrollHeight -
      parentElement.scrollTop -
      parentElement.clientHeight;
    const reverseOffset = parentElement.scrollTop;

    if (listenToScroll) {
      listenToScroll(offset, reverseOffset, threshold);
    }

    if (isLoading) return;
    if (
      reverseOffset < Number(threshold) &&
      typeof loadPreviousPageFn === "function" &&
      hasPreviousPageFlag
    ) {
      loadPreviousPageFn();
    }

    if (
      offset < Number(threshold) &&
      typeof loadNextPageFn === "function" &&
      hasNextPageFlag
    ) {
      loadNextPageFn();
    }
  };

  useEffect(() => {
    deprecationAndReplacementWarning(
      [
        [{ hasMoreNewer }, { hasNextPage }],
        [{ loadMoreNewer }, { loadNextPage }],
        [{ hasMore }, { hasPreviousPage }],
        [{ loadMore }, { loadPreviousPage }],
      ],
      "InfiniteScroll"
    );
  }, []);

  useLayoutEffect(() => {
    const scrollElement = scrollComponent.current?.parentNode;
    if (!scrollElement) return;

    const scrollListener = () => scrollListenerRef.current?.();

    scrollElement.addEventListener("scroll", scrollListener, useCapture);
    scrollElement.addEventListener("resize", scrollListener, useCapture);
    scrollListener();

    return () => {
      scrollElement.removeEventListener("scroll", scrollListener, useCapture);
      scrollElement.removeEventListener("resize", scrollListener, useCapture);
    };
  }, [initialLoad, useCapture]);

  useEffect(() => {
    const scrollElement = scrollComponent.current?.parentNode;
    if (scrollElement) {
      scrollElement.addEventListener("wheel", mousewheelListener, {
        passive: false,
      });
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener(
          "wheel",
          mousewheelListener,
          useCapture
        );
      }
    };
  }, [useCapture]);

  const attributes = {
    ...elementProps,
    ref: (element: HTMLElement) => {
      scrollComponent.current = element;
    },
  };

  const childrenArray = [loader, children];

  if (head) {
    childrenArray.unshift(head);
  }

  return React.createElement(element, attributes, childrenArray);
};
