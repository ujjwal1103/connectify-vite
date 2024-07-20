const Save = ({ size, fill, className }: any) => {
  if (fill) {
    return (
      <svg
        aria-label="Save"
        className={className}
        color="rgb(0, 0, 0)"
        fill="rgb(0, 0, 0)"
        height={size}
        role="img"
        viewBox="0 0 24 24"
        width={size}
      >
        <title>Save</title>
        <polygon
          fill="none"
          points="20 21 12 13.44 4 21 4 3 20 3 20 21"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          strokeWidth="2"
        ></polygon>
      </svg>
    );
  }
  return (
    <svg
      aria-label="Remove"
      className={className}
      color="rgb(0, 0, 0)"
      fill="rgb(0, 0, 0)"
      height={size}
      role="img"
      viewBox="0 0 24 24"
      width={size}
    >
      <title>Remove</title>
      <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
    </svg>
  );
};

export default Save;
