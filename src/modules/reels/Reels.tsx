// import {
//   ChevronLeft,
//   ChevronRight,
//   Heart,
//   MoreHorizontal,
//   PauseIcon,
//   PlayIcon,
//   Send,
// } from 'lucide-react'
// import { useCallback, useEffect, useRef, useState } from 'react'
// import {
//   AnimatePresence,
//   AnimationPlaybackControls,
//   motion,
//   useAnimate,
// } from 'framer-motion'
// import { users } from './data'
// import Avatar from '@/components/shared/Avatar'

// const urls = users

// const initialIndex = 0

// // interface Props {}
// const InstagramStories = () => {
//   const [animationDirection, setAnimationDirection] = useState<
//     'left' | 'right'
//   >('right')
//   const [activeSlide, setActiveSlide] = useState(initialIndex)
//   const [preIndex, setPreIndex] = useState(initialIndex - 1)
//   const [prePrevIndex, setPrePrevIndex] = useState(initialIndex - 2)
//   const [nextIndex, setNextIndex] = useState(initialIndex + 1)
//   const [nextNextIndex, setNextNextIndex] = useState(initialIndex + 2)

//   const [activeIndex, setActiveIndex] = useState(0)

//   const handleClickNext = () => {
//     const isLastIndexOfCurrentStory =
//       activeIndex === urls[activeSlide].stories.length - 1
//     if (isLastIndexOfCurrentStory) {
//       if (activeSlide < urls.length - 1) {
//         setActiveIndex(0)
//         setActiveSlide((prev) => prev + 1)
//         setPreIndex((prev) => prev + 1)
//         setPrePrevIndex((prev) => prev + 1)
//         setNextIndex((prev) => prev + 1)
//         setNextNextIndex((prev) => prev + 1)
//         setAnimationDirection('right')
//       }
//     } else {
//       setActiveIndex((prev) => prev + 1)
//     }
//   }

//   const handleClickPrev = () => {
//     const isFirstIndexOfCurrentStory = activeIndex === 0
//     if (isFirstIndexOfCurrentStory) {
//       if (activeSlide > 0) {
//         setActiveIndex(urls[activeSlide-1].stories.length - 1)
//         setActiveSlide((prev) => prev - 1)
//         setPreIndex((prev) => prev - 1)
//         setPrePrevIndex((prev) => prev - 1)
//         setNextIndex((prev) => prev - 1)
//         setNextNextIndex((prev) => prev - 1)
//         setAnimationDirection('left')
//       }
//     } else {
//       setActiveIndex((prev) => prev - 1)
//     }
//   }

//   const lastIndex = urls.length - 1

//   return (
//     <div className="relative flex h-dvh items-center justify-between gap-10 overflow-x-hidden overflow-y-hidden">
//       <AnimatePresence initial={false}>
//         <LeftSlides
//           dir={animationDirection}
//           key={`${preIndex}-${prePrevIndex}`}
//           hide={activeSlide === 0}
//           preIndex={preIndex}
//           prePrevIndex={prePrevIndex}
//           lastIndex={lastIndex}
//         />
//       </AnimatePresence>
//       <AnimatePresence initial={false}>
//         <ActiveSlide
//           activeSlide={activeSlide}
//           dir={animationDirection}
//           activeIndex={activeIndex}
//           handleClickNext={handleClickNext}
//         />
//       </AnimatePresence>
//       <AnimatePresence initial={false}>
//         <RightSlides
//           hide={activeSlide === lastIndex}
//           key={`${nextIndex}-${nextNextIndex}`}
//           dir={animationDirection}
//           nextIndex={nextIndex}
//           nextNextIndex={nextNextIndex}
//           lastIndex={lastIndex}
//         />
//       </AnimatePresence>
//       <Navigation
//         activeSlide={activeSlide}
//         handleClickPrev={handleClickPrev}
//         handleClickNext={handleClickNext}
//         activeIndex={activeIndex}
//         lastIndex={lastIndex}
//       />
//     </div>
//   )
// }
// const Reels = InstagramStories
// export default Reels

// type LeftSlidesProps = {
//   hide: boolean
//   dir: 'right' | 'left'
//   key: string
//   preIndex: number
//   prePrevIndex: number
//   lastIndex: number
// }

// const LeftSlides = ({ hide, dir, prePrevIndex, preIndex }: LeftSlidesProps) => {
//   if (hide) {
//     return null
//   }

//   return (
//     <motion.div
//       key={`${preIndex}-${prePrevIndex}`}
//       initial={{
//         opacity: 0,
//         x: dir === 'right' ? 50 : -50,
//       }}
//       animate={{ opacity: 1, x: 0 }}
//       // exit={{ opacity: 0, x: dir === 'right' ? 50 : -50 }}
//       transition={{ duration: 0.5 }}
//       className="absolute left-0 hidden h-dvh w-[30%] items-center justify-end gap-10 md:flex"
//     >
//       {prePrevIndex >= 0 && (
//         <Slide
//           variants={{
//             inital: { scale: 1 },
//             animate: { scale: 1 },
//           }}
//           index={prePrevIndex}
//         />
//       )}
//       <AnimatePresence>
//         {preIndex >= 0 && (
//           <Slide
//             variants={{
//               inital: { scale: 1 },
//               animate: {
//                 scale: dir === 'right' ? [1.5, 1] : [1, 1],
//               },
//               // exit: { scale: [1, 1.5] },
//             }}
//             index={preIndex}
//           />
//         )}
//       </AnimatePresence>
//     </motion.div>
//   )
// }
// type RightSlidesProps = {
//   hide: boolean
//   dir: 'right' | 'left'
//   key: string
//   nextIndex: number
//   nextNextIndex: number
//   lastIndex: number
// }
// const RightSlides = ({
//   hide,
//   dir,
//   nextIndex,
//   nextNextIndex,
//   lastIndex,
// }: RightSlidesProps) => {
//   if (hide) {
//     return null
//   }

//   return (
//     <motion.div
//       initial={{ x: dir === 'right' ? 50 : -50 }}
//       animate={{ x: 0 }}
//       transition={{ duration: 0.5 }}
//       key={`${nextIndex}-${nextNextIndex}`}
//       className="absolute right-0 hidden h-dvh w-[30%] items-center gap-10 md:flex"
//     >
//       <Slide
//         index={nextIndex}
//         variants={{
//           animate: { scale: dir === 'left' ? [1.5, 1] : [1, 1] },
//         }}
//       />
//       {nextNextIndex <= lastIndex && (
//         <Slide
//           index={nextNextIndex}
//           variants={{
//             inital: { scale: 1 },
//             animate: { scale: 1 },
//           }}
//         />
//       )}
//     </motion.div>
//   )
// }

// type SlideProps = {
//   index: number
//   variants: any
// }

// const Slide = ({ index, variants }: SlideProps) => {
//   return (
//     <motion.div
//       key={index}
//       variants={variants}
//       initial={'inital'}
//       animate={'animate'}
//       transition={{ duration: 0.4 }}
//       className="relative aspect-16/9 h-[40%] w-[40%] flex-shrink-0 overflow-clip rounded-md bg-black"
//     >
//       <img
//         src={urls[index].stories[0].content}
//         className="h-full w-full bg-black object-cover opacity-65"
//       />
//       <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center gap-2 bg-black/70">
//         <div>
//           <Avatar
//             src={urls[index].stories[0].content}
//             className="size-16 shadow-xl"
//           />
//         </div>
//         <span>{urls[index].name}</span>
//       </div>
//     </motion.div>
//   )
// }

// type NavigationProps = {
//   activeSlide: number
//   handleClickPrev: () => void
//   handleClickNext: () => void
//   lastIndex: number
//   activeIndex: number
// }

// const Navigation = ({
//   activeSlide,
//   handleClickNext,
//   handleClickPrev,
//   lastIndex,
//   activeIndex,
// }: NavigationProps) => {
//   return (
//     <div className="absolute inset-0 flex h-dvh w-full justify-center gap-96">
//       <div className="flex h-full w-10 items-center">
//         {(activeSlide !== 0 || activeIndex !== 0) && (
//           <button
//             onClick={handleClickPrev}
//             className="rounded-full bg-white/70"
//           >
//             <ChevronLeft color="black" />
//           </button>
//         )}
//       </div>

//       <div className="flex h-full w-10 items-center justify-end">
//         {(activeSlide < lastIndex ||
//           activeIndex !== urls[activeIndex].stories.length - 1) && (
//           <button
//             onClick={handleClickNext}
//             className="rounded-full bg-white/70"
//           >
//             <ChevronRight color="black" />
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }

// type ActiveSlideProps = {
//   activeSlide: number
//   activeIndex: number
//   dir: 'left' | 'right'
//   handleClickNext: () => void
// }

// const ActiveSlide = ({
//   activeSlide,
//   dir,
//   activeIndex,
//   handleClickNext,
// }: ActiveSlideProps) => {
//   const stories = urls[activeSlide].stories
//   const story = stories[activeIndex].content
//   const [isPaused, setIsPaused] = useState(false)

//   useEffect(() => {
//     setIsPaused(false)
//   }, [activeIndex, activeSlide])

//   return (
//     <motion.div
//       key={activeSlide}
//       className="absolute left-1/2 top-1/2 z-[100] aspect-16/9 w-screen flex-grow-0 -translate-x-1/2 overflow-clip rounded-md md:h-[90%] md:w-96"
//       initial={{
//         opacity: 0,
//         scale: 0.4,
//         y: '-50%',
//         x: dir === 'right' ? '0%' : '-100%',
//       }}
//       animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
//       transition={{ duration: 0.5 }}
//     >
//       <img
//         src={story}
//         className="z-100 h-full w-full bg-slate-50 object-cover"
//       />
//       <div className="absolute top-5 flex w-full flex-col gap-1 px-3">
//         <div className="flex w-full gap-1">
//           {stories.map((story, index) => {
//             return (
//               <Progress
//                 handleClickNext={handleClickNext}
//                 activeIndex={activeIndex}
//                 key={`${story.id}-${activeIndex}-${activeSlide}`}
//                 index={index}
//                 isPaused={isPaused}
//                 setIsPaused={setIsPaused}
//               />
//             )
//           })}
//         </div>

//         <div className="flex pt-2">
//           <div className="flex items-center gap-2">
//             <Avatar
//               src={urls[activeSlide].stories[activeIndex].content}
//               className="shadow-md"
//             />

//             <span className="font-semibold text-white">Ujjwal Lade</span>
//           </div>

//           <div className="ml-auto flex items-center">
//             <span className="text-gray-200">2h</span>
//             <button
//               onClick={() => {
//                 setIsPaused(!isPaused)
//               }}
//               className="p-2"
//             >
//               {isPaused ? (
//                 <PlayIcon fill="white" stroke="0" />
//               ) : (
//                 <PauseIcon fill="white" stroke="0" />
//               )}
//             </button>
//             <button
//               onClick={() => {
//                 setIsPaused(!isPaused)
//               }}
//               className="p-2"
//             >
//               <MoreHorizontal />
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="absolute bottom-5 flex w-full flex-col gap-1 px-3">
//         <MessageInput />
//       </div>
//     </motion.div>
//   )
// }

// type ProgressProps = {
//   key: string
//   activeIndex: number
//   handleClickNext: () => void
//   index: number
//   isPaused: boolean
//   setIsPaused: (isPaused: boolean) => void
// }

// const Progress = ({
//   key,
//   activeIndex,
//   handleClickNext,
//   index,
//   isPaused,
// }: ProgressProps) => {
//   const [scope, animate] = useAnimate()
//   const animeControl = useRef<AnimationPlaybackControls>()

//   const toggleAnimation = useCallback(() => {
//     if (isPaused) {
//       animeControl.current?.pause()
//     } else {
//       animeControl.current?.play()
//     }
//   }, [isPaused])

//   useEffect(() => {
//     toggleAnimation()
//   }, [toggleAnimation])

//   useEffect(() => {
//     if (activeIndex !== index) {
//       if (activeIndex < index) {
//         scope.current.style.backgroundColor = ' #9ca3af '
//       } else {
//         scope.current.style.backgroundColor = 'white'
//       }
//       return
//     }

//     const control = animate(
//       scope.current,
//       {
//         width: [0, '100%'],
//       },
//       {
//         duration: 1,
//         ease: 'linear',
//         // onComplete: () => {
//         //   handleClickNext()
//         // },
//       }
//     )

//     animeControl.current = control

//     return () => {
//       if (animeControl.current) {
//         animeControl.current.stop()
//       }
//     }
//   }, [activeIndex])

//   return (
//     <motion.div
//       key={key}
//       className="h-0.5 w-full flex-1 transform rounded-full bg-gray-400"
//     >
//       <motion.div ref={scope} className="h-full rounded-full bg-white" />
//     </motion.div>
//   )
// }

// const MessageInput = () => {
//   return (
//     <div className="flex w-full items-center gap-2">
//       <input
//         type="text"
//         className="w-full rounded-full border border-white bg-transparent p-3 focus-visible:outline-none"
//         placeholder="Reply to ujjwal_lade"
//       />
//       <Heart />
//       <Send />
//     </div>
//   )
// }

import StoryRing from '@/components/ui/dynamicCircle'

const Reels = () => {
  return (
    <div className="flex h-dvh items-center justify-center">
      <StoryRing
        user={{
          userName: '',
          stories: [],
        }}
      />
    </div>
  )
}

export default Reels
