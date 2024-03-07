import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../atoms/button";
import { cn } from "../../utils/cn";
import { logo } from "../../images";

interface HeaderProps {
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
  menu: boolean;
}

const Menu: React.FC<HeaderProps> = ({ setMenu, menu }) => {
  const closeMenu = () => {
    setMenu(false);
  };

  const linkClick = () => {
    setMenu(false);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      if (menu) {
        setMenu(false);
      }
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [menu, setMenu]);
  return (
    <div
      className={cn(
        "h-auto relative z-[10]",
        "w-full fixed top-0 right-0 bg-slate-50 rounded-sm",
        "mobile:text-base mobile:w-full mobile:px-10"
      )}
    >
      <span
        onClick={closeMenu}
        className="block h-[50px] p-5 text-right text-xl cursor-pointer"
      >
        X
      </span>
      <div className="mobile:pr-16">
        <Link to="/" onClick={linkClick}>
          <img src={logo} alt="" className="mx-auto mobile:w-[150px] " />
        </Link>
      </div>
      <div
        className="flex flex-row py-10 gap-6 justify-center items-center mobile:flex-col mobile:pr-16 "
        onClick={linkClick}
      >
        <Link to="/product">
          <Button variant="sendBtn2" size="mdl" label="상품등록하기" />
        </Link>
        <Link to="/store">
          <Button variant="sendBtn2" size="mdl" label="SELLER" />
        </Link>

        <Link to="/gift">
          <Button variant="sendBtn2" size="mdl" label="선물함" />
        </Link>
      </div>
    </div>
  );
};

export default Menu;
