export interface HightlightEventDetail {
  detail: string
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface WindowEventMap {
    hightlight: CustomEvent<HightlightEventDetail>
  }
}
export const hightlightandscrollTo = new EventTarget()
