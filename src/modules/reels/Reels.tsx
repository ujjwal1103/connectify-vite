import { useEffect, useState } from 'react'
import ImageGallary from '../gallery/ImageGallary'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'

const t = [
  {
    id: 29861079,
    width: 3703,
    height: 5708,
    url: 'https://www.pexels.com/photo/photographer-capturing-view-on-a-ferry-ride-29861079/',
    photographer: 'Oktay Köseoğlu',
    photographer_url: 'https://www.pexels.com/@oktay-koseoglu-42034955',
    photographer_id: 42034955,
    avg_color: '#5A574E',
    src: {
      original:
        'https://images.pexels.com/photos/29861079/pexels-photo-29861079.jpeg',
      large2x:
        'https://images.pexels.com/photos/29861079/pexels-photo-29861079.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/29861079/pexels-photo-29861079.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/29861079/pexels-photo-29861079.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/29861079/pexels-photo-29861079.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/29861079/pexels-photo-29861079.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/29861079/pexels-photo-29861079.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/29861079/pexels-photo-29861079.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: 'A person takes a photo while sitting on a ferry with scenic views outside.',
  },
  {
    id: 3354675,
    width: 2979,
    height: 3973,
    url: 'https://www.pexels.com/photo/human-hands-illustrations-3354675/',
    photographer: 'Matheus Viana',
    photographer_url: 'https://www.pexels.com/@prismattco',
    photographer_id: 1246688,
    avg_color: '#797776',
    src: {
      original:
        'https://images.pexels.com/photos/3354675/pexels-photo-3354675.jpeg',
      large2x:
        'https://images.pexels.com/photos/3354675/pexels-photo-3354675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/3354675/pexels-photo-3354675.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/3354675/pexels-photo-3354675.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/3354675/pexels-photo-3354675.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/3354675/pexels-photo-3354675.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/3354675/pexels-photo-3354675.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/3354675/pexels-photo-3354675.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: 'Two hands reaching across a stark black and white divide, symbolizing connection and unity.',
  },
  {
    id: 29855578,
    width: 4000,
    height: 6000,
    url: 'https://www.pexels.com/photo/portrait-of-young-adult-with-blonde-hair-and-septum-piercing-29855578/',
    photographer: '_visualbruno',
    photographer_url: 'https://www.pexels.com/@_visualbruno-1157201511',
    photographer_id: 1157201511,
    avg_color: '#B1A99E',
    src: {
      original:
        'https://images.pexels.com/photos/29855578/pexels-photo-29855578.jpeg',
      large2x:
        'https://images.pexels.com/photos/29855578/pexels-photo-29855578.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/29855578/pexels-photo-29855578.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/29855578/pexels-photo-29855578.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/29855578/pexels-photo-29855578.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/29855578/pexels-photo-29855578.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/29855578/pexels-photo-29855578.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/29855578/pexels-photo-29855578.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: 'Contemporary portrait of a young adult with blonde hair and septum piercing, wearing a white top.',
  },
  {
    id: 29860838,
    width: 7007,
    height: 10000,
    url: 'https://www.pexels.com/photo/elegant-portrait-with-hanging-sunflowers-29860838/',
    photographer: 'Helin Gezer',
    photographer_url: 'https://www.pexels.com/@helin-gezer-903013644',
    photographer_id: 903013644,
    avg_color: '#958262',
    src: {
      original:
        'https://images.pexels.com/photos/29860838/pexels-photo-29860838.jpeg',
      large2x:
        'https://images.pexels.com/photos/29860838/pexels-photo-29860838.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/29860838/pexels-photo-29860838.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/29860838/pexels-photo-29860838.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/29860838/pexels-photo-29860838.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/29860838/pexels-photo-29860838.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/29860838/pexels-photo-29860838.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/29860838/pexels-photo-29860838.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: 'Stylish portrait of a person surrounded by hanging sunflowers in a unique artistic setup.',
  },
  {
    id: 1853354,
    width: 2730,
    height: 4096,
    url: 'https://www.pexels.com/photo/man-standing-on-a-rock-near-snow-covered-land-1853354/',
    photographer: 'Tobias Bjørkli',
    photographer_url: 'https://www.pexels.com/@tobiasbjorkli',
    photographer_id: 706370,
    avg_color: '#185B6B',
    src: {
      original:
        'https://images.pexels.com/photos/1853354/pexels-photo-1853354.jpeg',
      large2x:
        'https://images.pexels.com/photos/1853354/pexels-photo-1853354.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/1853354/pexels-photo-1853354.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/1853354/pexels-photo-1853354.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/1853354/pexels-photo-1853354.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/1853354/pexels-photo-1853354.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/1853354/pexels-photo-1853354.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/1853354/pexels-photo-1853354.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: 'A lone figure stands on a snowy slope, gazing at the vibrant Northern Lights under a starry sky.',
  },
  {
    id: 616376,
    width: 4000,
    height: 6016,
    url: 'https://www.pexels.com/photo/women-s-blue-tank-top-and-black-pants-616376/',
    photographer: 'Marx Ilagan',
    photographer_url: 'https://www.pexels.com/@marx-ilagan',
    photographer_id: 89229,
    avg_color: '#8A9455',
    src: {
      original:
        'https://images.pexels.com/photos/616376/pexels-photo-616376.jpeg',
      large2x:
        'https://images.pexels.com/photos/616376/pexels-photo-616376.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/616376/pexels-photo-616376.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/616376/pexels-photo-616376.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/616376/pexels-photo-616376.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/616376/pexels-photo-616376.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/616376/pexels-photo-616376.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/616376/pexels-photo-616376.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: 'A stylish young woman stands confidently in a lush Dubai park under the sun.',
  },
  {
    id: 1020016,
    width: 3931,
    height: 4914,
    url: 'https://www.pexels.com/photo/two-person-carrying-black-inflatable-pool-float-on-brown-wooden-bridge-near-waterfalls-1020016/',
    photographer: 'Oliver Sjöström',
    photographer_url: 'https://www.pexels.com/@ollivves',
    photographer_id: 333270,
    avg_color: '#50594D',
    src: {
      original:
        'https://images.pexels.com/photos/1020016/pexels-photo-1020016.jpeg',
      large2x:
        'https://images.pexels.com/photos/1020016/pexels-photo-1020016.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/1020016/pexels-photo-1020016.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/1020016/pexels-photo-1020016.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/1020016/pexels-photo-1020016.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/1020016/pexels-photo-1020016.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/1020016/pexels-photo-1020016.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/1020016/pexels-photo-1020016.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: 'A couple in swimwear with float tubes exploring a lush waterfall in Bali, Indonesia.',
  },
  {
    id: 29857613,
    width: 1903,
    height: 3380,
    url: 'https://www.pexels.com/photo/stylish-woman-in-black-and-white-city-scene-29857613/',
    photographer: 'Anıl Sarıca',
    photographer_url: 'https://www.pexels.com/@anil-sarica-419904898',
    photographer_id: 419904898,
    avg_color: '#888888',
    src: {
      original:
        'https://images.pexels.com/photos/29857613/pexels-photo-29857613.jpeg',
      large2x:
        'https://images.pexels.com/photos/29857613/pexels-photo-29857613.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/29857613/pexels-photo-29857613.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/29857613/pexels-photo-29857613.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/29857613/pexels-photo-29857613.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/29857613/pexels-photo-29857613.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/29857613/pexels-photo-29857613.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/29857613/pexels-photo-29857613.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: 'Elegant woman in a suit and hat walks in a historic urban street in black and white.',
  },
  {
    id: 29858279,
    width: 3262,
    height: 4077,
    url: 'https://www.pexels.com/photo/emotional-portrait-of-violinist-in-deep-concentration-29858279/',
    photographer: 'ORBABZ',
    photographer_url: 'https://www.pexels.com/@orbabz-1963304473',
    photographer_id: 1963304473,
    avg_color: '#3C2C1D',
    src: {
      original:
        'https://images.pexels.com/photos/29858279/pexels-photo-29858279.jpeg',
      large2x:
        'https://images.pexels.com/photos/29858279/pexels-photo-29858279.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/29858279/pexels-photo-29858279.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/29858279/pexels-photo-29858279.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/29858279/pexels-photo-29858279.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/29858279/pexels-photo-29858279.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/29858279/pexels-photo-29858279.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/29858279/pexels-photo-29858279.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: '',
  },
  {
    id: 2659475,
    width: 1860,
    height: 2500,
    url: 'https://www.pexels.com/photo/photo-of-person-standing-on-a-famous-temple-2659475/',
    photographer: 'Stijn Dijkstra',
    photographer_url: 'https://www.pexels.com/@stijn-dijkstra-1306815',
    photographer_id: 1306815,
    avg_color: '#A18889',
    src: {
      original:
        'https://images.pexels.com/photos/2659475/pexels-photo-2659475.jpeg',
      large2x:
        'https://images.pexels.com/photos/2659475/pexels-photo-2659475.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/2659475/pexels-photo-2659475.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/2659475/pexels-photo-2659475.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/2659475/pexels-photo-2659475.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/2659475/pexels-photo-2659475.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/2659475/pexels-photo-2659475.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/2659475/pexels-photo-2659475.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: "Serene sunrise view of a person standing at Lempuyang Temple's gateway, Bali, Indonesia.",
  },
  {
    id: 29846888,
    width: 4624,
    height: 6159,
    url: 'https://www.pexels.com/photo/portrait-of-woman-by-water-in-denim-jacket-29846888/',
    photographer: 'Vurzie  Kim',
    photographer_url: 'https://www.pexels.com/@vurzie-kim-325095862',
    photographer_id: 325095862,
    avg_color: '#3E433D',
    src: {
      original:
        'https://images.pexels.com/photos/29846888/pexels-photo-29846888.jpeg',
      large2x:
        'https://images.pexels.com/photos/29846888/pexels-photo-29846888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/29846888/pexels-photo-29846888.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/29846888/pexels-photo-29846888.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/29846888/pexels-photo-29846888.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/29846888/pexels-photo-29846888.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/29846888/pexels-photo-29846888.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/29846888/pexels-photo-29846888.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: 'Sunshine ',
  },
  {
    id: 29822696,
    width: 2687,
    height: 3358,
    url: 'https://www.pexels.com/photo/stylish-man-posing-in-sunglasses-against-textured-wall-29822696/',
    photographer: 'Vurzie  Kim',
    photographer_url: 'https://www.pexels.com/@vurzie-kim-325095862',
    photographer_id: 325095862,
    avg_color: '#4A483C',
    src: {
      original:
        'https://images.pexels.com/photos/29822696/pexels-photo-29822696.jpeg',
      large2x:
        'https://images.pexels.com/photos/29822696/pexels-photo-29822696.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large:
        'https://images.pexels.com/photos/29822696/pexels-photo-29822696.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      medium:
        'https://images.pexels.com/photos/29822696/pexels-photo-29822696.jpeg?auto=compress&cs=tinysrgb&h=350',
      small:
        'https://images.pexels.com/photos/29822696/pexels-photo-29822696.jpeg?auto=compress&cs=tinysrgb&h=130',
      portrait:
        'https://images.pexels.com/photos/29822696/pexels-photo-29822696.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
      landscape:
        'https://images.pexels.com/photos/29822696/pexels-photo-29822696.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tiny: 'https://images.pexels.com/photos/29822696/pexels-photo-29822696.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
    },
    liked: false,
    alt: 'Block X',
  },
]

const variants = {
  initial: {
    x: '100%', // Start off-screen to the right
  },
  animate: {
    x: 0, // Slide into view
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
  exit: {
    x: '100%', // Slide out to the left
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}
const Reels = () => {
  const [show, setShow] = useState(false)
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div className="flex h-full w-full items-center justify-center bg-green-950">
        <Button onClick={() => setShow(true)}>Click</Button>
        <AnimatePresence>
          {show && (
            <motion.div
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute flex h-full w-full items-center justify-center bg-emerald-700"
            >
              <Button onClick={() => setShow(false)}>Click</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Reels
