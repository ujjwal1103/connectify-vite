const VideoCropper = ({
  aspectRatio,
  src,
}: {
  aspectRatio: number;
  src: string;
}) => {
  return (
    <div
      className={
        "w-500 h-500 object-cover aspect-video flex items-center justify-center "
      }
    >
      <video
        className={"w-500 h-500 object-cover aspect-video "}
        style={{ height: aspectRatio == 1 / 1 ? "500px" : "333px" }}
      >
        <source src={src} />
      </video>
    </div>
  );
};

export default VideoCropper;
