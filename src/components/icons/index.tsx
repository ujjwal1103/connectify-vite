import {
  BsArrowRight as ArrowRight,
  BsEnvelopeAtFill as EnvelopeAtFill,
  BsEyeFill as EyeFill,
  BsLockFill as LockFill,
  BsPersonFill as PersonFill,
  BsHeart as Heart,
  BsHeartFill as HeartFill,
  BsSearch as Search,
  BsPlus as Plus,
  BsSend as Send,
  BsFillEyeSlashFill as FillEyeSlashFill,
  BsChat as Chat,
  BsHouseDoor as HouseDoor,
  BsPersonCircle as PersonCircle,
  BsPlusSquare as PlusSquare,
  BsEmojiWink as EmojiWink,
  BsThreeDots as ThreeDots,
  BsImageFill as ImageFill,
  BsEmojiSmile as EmojiSmile,
  BsCamera as Camera,
  BsBookmark as BookMark,
  BsBookmarkFill as BookMarkFill,
} from "react-icons/bs";
import {
  AiOutlineLoading as OutlineLoading,
  AiOutlineClose as OutlineClose,
  AiOutlineLoading3Quarters as OutlineLoading3Quarters,
} from "react-icons/ai";
import { MdDarkMode as DarkMode } from "react-icons/md";
import { BiZoomIn as ZoomIn } from "react-icons/bi";
import {
  FaAngleLeft as AngleLeft,
  FaEllipsisV as EllipsisV,
  FaCog as Cog,
  FaQuestionCircle as QuestionCircle,
  FaPhone as Phone,
  FaSignOutAlt as SignOutAlt,
} from "react-icons/fa";
import { PiDotsNine as DotsNine } from "react-icons/pi";
import Google from "./Google";
import {
  IoChevronForwardCircle as ChevronForwardCircle,
  IoChevronBackCircle as ChevronBackCircle,
} from "react-icons/io5";
import {
  RiCheckDoubleLine as DoubleCheckIcon,
  RiCheckLine as Check,
} from "react-icons/ri";

import { IoIosLock as PasswordLock, IoMdList as MdList } from "react-icons/io";
import {
  RiMessengerLine as MessengerLine,
  RiCheckboxBlankLine as CheckBoxBlankLine,
} from "react-icons/ri";
import { FiEdit as Edit } from "react-icons/fi";
import {
  IoChevronForward as ChevronForward,
  IoChevronBack as ChevronBack,
} from "react-icons/io5";
import {
  FaRegCircleDot as CircleDot,
  FaRegCircle as Circle,
} from "react-icons/fa6";
import { AiOutlineMenuFold as OutlineMenuFold } from "react-icons/ai";
import {
  MdOutlineAudioFile as AudioFileIcon,
  MdVideoLibrary as VideoLibrary,
  MdOutlineVideoFile as VideoFileIcon,
  MdHeadset as HeadSet,
  MdLibraryMusic as MusicLibrary,
  MdOutlineAlternateEmail as UsernameIcon,
} from "react-icons/md";

import { FaPlay, FaPause } from "react-icons/fa";
import { LuImagePlus as ImagePlus } from "react-icons/lu";
import { MdOutlineMail as Mail } from "react-icons/md";
import Save from "./Save";

const CommentIcon = ({ size, color = "currentColor", ...rest }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Comment"
    className="size-5"
    fill={color}
    // height={size}
    viewBox="0 0 24 24"
    // width={size}
    {...rest}
  >
    <title>Comment</title>
    <path
      d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
  </svg>
);

export {
  AngleLeft,
  ArrowRight,
  HeadSet,
  BookMark,
  BookMarkFill,
  Camera,
  Chat,
  CircleDot,
  Circle,
  ChevronBackCircle,
  ChevronForwardCircle,
  ChevronBack,
  ChevronForward,
  Cog,
  CommentIcon,
  Check,
  DarkMode,
  DotsNine,
  DoubleCheckIcon,
  EllipsisV,
  EmojiSmile,
  EmojiWink,
  EnvelopeAtFill,
  EyeFill,
  Edit,
  FillEyeSlashFill,
  Google,
  Heart,
  HeartFill,
  HouseDoor,
  ImageFill,
  LockFill,
  MdList,
  MessengerLine,
  OutlineClose,
  OutlineLoading,
  OutlineLoading3Quarters,
  OutlineMenuFold,
  PasswordLock,
  PersonCircle,
  PersonFill,
  Phone,
  Plus,
  PlusSquare,
  QuestionCircle,
  Save,
  Search,
  Send,
  SignOutAlt,
  ThreeDots,
  CheckBoxBlankLine,
  ZoomIn,
  AudioFileIcon,
  VideoFileIcon,
  VideoLibrary,
  MusicLibrary,
  FaPause,
  FaPlay,
  ImagePlus,
  Mail,
  UsernameIcon,
};
