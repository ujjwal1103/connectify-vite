export const LoadingPosts: React.FC = () => (
  <div className="">
    <div className="grid w-full grid-cols-3 gap-px gap-y-px">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="aspect-1 w-full animate-pulse bg-secondary"
        ></div>
      ))}
    </div>
  </div>
)
