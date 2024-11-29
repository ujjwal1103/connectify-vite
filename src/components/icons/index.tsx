import Google from './Google'
import Save from './Save'

const CommentIcon = ({ size, color = 'currentColor', ...rest }: any) => (
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
)

export { CommentIcon, Google, Save }
