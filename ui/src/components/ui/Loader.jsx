import { LuLoaderCircle } from "react-icons/lu";

export const Loader = ({ size, className = "", style = {} }) => {
  return (
    <LuLoaderCircle
      size={size}
      className={`${className} animate-spin`}
      style={style}
    />
  );
};
