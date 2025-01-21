export interface ExpandEventDetail {
  detail: string // Assuming the event's detail is the comment ID (a string)
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface WindowEventMap {
    expand: CustomEvent<ExpandEventDetail> // Define the custom event in the global event map
  }
}
export const commentExpand = new EventTarget()
