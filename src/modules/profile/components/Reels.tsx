import SuggetionsSlider from "@/components/shared/suggetionsSliders/SuggetionsSlider"
import { EmptyPost } from "./EmptyPost"


const Reels = () => {
  return (
    <div className="py-10">
    <EmptyPost />
    <div className="max-w-[1000px] mx-auto">
      <SuggetionsSlider />
    </div>


    
  </div>
  )
}

export default Reels