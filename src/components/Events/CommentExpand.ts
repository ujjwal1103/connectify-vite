export interface ExpandEventDetail {
  detail: string // Assuming the event's detail is the comment ID (a string)
}

declare global {
  interface WindowEventMap {
    expand: CustomEvent<ExpandEventDetail> // Define the custom event in the global event map
  }
}
export const commentExpand = new EventTarget()
