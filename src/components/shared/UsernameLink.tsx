import { getCurrentUsername } from "@/lib/localStorage";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type UsernameLinkProps = {
  children: ReactNode;
  username?: String;
  onClick?: VoidFunction;
  className?: string;
};

const UsernameLink = ({
  children,
  username,
  onClick,
  className = "",
}: UsernameLinkProps) => {
  const currentUsername = getCurrentUsername();

  const path =
    username === currentUsername ? "/profile" : `/u/${username}`;
  return (
    <Link to={path} className={className} onClick={onClick}>
      {children}
    </Link>
  );
};

export default UsernameLink;
