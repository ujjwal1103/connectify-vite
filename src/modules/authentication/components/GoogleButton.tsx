import { Google } from "@/components/icons";
import getGoogleUrl from "@/config/getGoogleUri";


export function GoogleButton() {
  return (
    <div className="flex rounded-full justify-center  ">
      <a href={getGoogleUrl()} className="text-white p-3 ">
        <Google
          className={
            "text-xl bg-white rounded-full  hover:shadow-2xl hover:shadow-slate-950"
          }
        />
      </a>
    </div>
  );
}
