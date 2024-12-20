
const BubbleNotch = ({ className, style }:any) => {
  return (
    <div>
      {/* <svg
        className={className}
        style={style}
        width="26"
        height="21"
        viewBox="0 0 26 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.5 0.5L0 12.5C9.15531 19.8251 14.8037 21.2348 25.5 20.5C16.5368 14.1328 13.9467 9.73584 13.5 0.5Z"
        />
      </svg> */}
      <svg className={className} style={style} width='3' height='3' xmlns='http://www.w3.org/2000/svg'><path  d='m 0 3 L 1 3 L 3 3 C 2 3 0 1 0 0'/></svg>
    </div>
  );
};

export default BubbleNotch;

