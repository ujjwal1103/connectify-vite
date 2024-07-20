import { cn } from "@/lib/utils";

const MenuItemModal = ({ onClose, menuOptions }: any) => {
    return (
      <div className="md:w-80 md:text-sm text-sm bg-popover shadow-lg  rounded-xl">
        <header className="p-3 text-center text-forground">
          <h1 className=" md:text-xl text-lg">Change Profile Photo</h1>
        </header>
        <ul className="flex flex-col text-forground">
          {menuOptions?.map((option: any) => {
            return (
              <li
                className={cn(
                  "text-center p-2 border-t cursor-pointer border-[#46454596]",
                  {
                    "text-red-600": option.destructive,
                  }
                )}
                onClick={option.onClick}
              >
                {option.label}
              </li>
            );
          })}
          <li
            className="text-center p-2 border-t border-[#46454596] cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </li>
        </ul>
      </div>
    );
  };


  export default MenuItemModal;