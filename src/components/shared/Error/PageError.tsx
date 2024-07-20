interface Props {
  message?: string;
}

const PageError = ({ message = "Something went Wrong" }: Props) => {
  return (
    <div className="flex-1 min-h-full flex items-center justify-center">
      <div className="border border-red-600 text-red-800 bg-red-300 py-5 px-10">
        {message}
      </div>
    </div>
  );
};

export default PageError;
