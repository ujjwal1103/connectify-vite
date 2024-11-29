import {
  Avatar as ShadAvatat,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import noAvatar from "../../assets/Icons/no_avatar.png";

const Avatar = ({
  src,
  name,
  className = "size-8 border border-zinc-400",
  onClick,
}: {
  src?: string;
  name?: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <ShadAvatat className={className} onClick={onClick}>
      <AvatarImage src={src || noAvatar} className="object-cover" />
      <AvatarFallback className="text-sm">
        {name?.substring(0, 2)}
      </AvatarFallback>
    </ShadAvatat>
  );
};

export default Avatar;
