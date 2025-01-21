import { SVGProps } from 'react'


const ReelsFill = (props: SVGProps<SVGSVGElement> & {size: number, absoluteStrokeWidth: boolean}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
      strokeWidth={props.absoluteStrokeWidth ? (Number(props.strokeWidth) * 24) / Number(props.size) : props.strokeWidth}
    >
      <path
        d="M6 9.75H18C19.7949 9.75 21.25 11.2051 21.25 13V18C21.25 19.7949 19.7949 21.25 18 21.25H6C4.20507 21.25 2.75 19.7949 2.75 18V13C2.75 11.2051 4.20507 9.75 6 9.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 7.5H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 5L17 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.1468 12.0098C10.0201 12.0098 9.89545 12.0475 9.7847 12.1192C9.67193 12.1863 9.57674 12.2877 9.50923 12.4127C9.44075 12.5395 9.40337 12.6858 9.40116 12.8357L9.40112 12.84V18.17L9.40116 18.1743C9.40337 18.3241 9.44075 18.4704 9.50923 18.5972C9.57674 18.7223 9.67193 18.8236 9.7847 18.8907C9.89545 18.9625 10.0201 19.0002 10.1468 19.0002C10.2754 19.0002 10.4018 18.9614 10.5137 18.8876C10.5161 18.886 10.5186 18.8843 10.521 18.8826L14.2195 16.2139C14.3316 16.1479 14.4263 16.0474 14.4932 15.9232C14.5623 15.7949 14.599 15.6465 14.599 15.495C14.599 15.3435 14.5623 15.195 14.4932 15.0667C14.4262 14.9424 14.3314 14.8418 14.2191 14.7759L10.5204 12.1269C10.5182 12.1253 10.5159 12.1238 10.5137 12.1223C10.4018 12.0485 10.2754 12.0098 10.1468 12.0098Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default ReelsFill
