const CropHeaderButtons = ({
  onResetAndClose,
  onCropImage,
}: {
  onResetAndClose: () => void;
  onCropImage: (val: boolean) => void;
}) => {
  return (
    <div className="w-full">
      <div className="bg-[#000000]  w-full  flex justify-between p-2 rounded-lg rounded-b-none">
        <button onClick={onResetAndClose} className=" text-white ">
          Back
        </button>

        <button onClick={() => onCropImage(false)} className=" text-white ">
          Next
        </button>
      </div>
    </div>
  );
};

export default CropHeaderButtons;
