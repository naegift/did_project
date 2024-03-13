import React, { useState } from "react";
import { Link } from "react-router-dom";
import useWalletAndSuscribe from "../../hooks/useWalletAndSuscribe";
import { useRecoilState } from "recoil";
import Button from "../atoms/button";
import { logo } from "../../images";
import { menuIcon } from "../../images/Icon";
import { walletState } from "../../recoil/walletState";
import { cn } from "../../utils/cn";
import Notification from "./Notification";
import Menu from "../molecules/Menu";

const Header: React.FC = () => {
  const { connectWallet, notificationData } = useWalletAndSuscribe();
  const [sellerWallets] = useRecoilState(walletState);
  const [menu, setMenu] = useState(false);

  const handleLoginButtonClick = async () => {
    if (!sellerWallets.walletAddress) {
      try {
        await connectWallet();
      } catch (error) {
        console.error("로그인 에러:", error);
      }
    }
  };
  const menuOpen = () => {
    setMenu(!menu);
  };

  return (
    <div
      className={cn(
        "flex flex-row justify-between p-5 border-b items-center ",
        "fixed top-0 right-0 w-full bg-white z-[10] h-[97px]"
      )}
    >
      <Notification notificationData={notificationData} />
      <div>
        <Link to="/">
          <img
            src={logo}
            alt=""
            className=" tablet:w-[120px] mobile:w-[150px]"
          />
        </Link>
      </div>
      {menu && <Menu menu={menu} setMenu={setMenu} />}
      <div className="flex flex-row gap-10 items-center">
        <Link to="/product" className="tablet:hidden mobile:hidden">
          <Button variant="sendBtn2" size="mdl" label="상품등록하기" />
        </Link>
        <Link to="/store" className="tablet:hidden mobile:hidden">
          <Button variant="sendBtn2" size="mdl" label="SELLER" />
        </Link>

        <Link to="/gift" className="tablet:hidden mobile:hidden">
          <Button variant="sendBtn2" size="mdl" label="선물함" />
        </Link>

        {sellerWallets.walletAddress ? (
          <div className="flex items-center tablet:hidden mobile:hidden">
            <span className="mr-2">환영합니다</span>
          </div>
        ) : (
          <Button
            variant="iconTextBtn"
            size="md"
            label="Connect"
            onClick={handleLoginButtonClick}
          />
        )}

        <div
          className={cn(
            "hidden cursor-pointer tablet:inline-block",
            "mobile:block"
          )}
          onClick={menuOpen}
        >
          <img src={menuIcon} alt="" className="w-[25px]" />
        </div>
      </div>
    </div>
  );
};

export default Header;
