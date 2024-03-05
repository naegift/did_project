import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useWalletAndSuscribe from "../../hooks/useWalletAndSuscribe";
import { useRecoilState } from "recoil";
import Button from "../atoms/button";
import { logo } from "../../images";
import { menuIcon } from "../../images/Icon";
import { walletState } from "../../recoil/walletState";
import { cn } from "../../utils/cn";

const Header: React.FC = () => {
  const { connectWallet } = useWalletAndSuscribe();
  const [sellerWallets, setSellerWallets] = useRecoilState(walletState);
  // const [welcomeMessage, setWelcomeMessage] = useState<string>("");

  // useEffect(() => {
  //   if (sellerWallets.isLoggedIn && sellerWallets.user) {
  //     setWelcomeMessage(`환영합니다, ${sellerWallets.user.name}님`);
  //   } else {
  //     setWelcomeMessage("");
  //   }
  // }, [sellerWallets]);

  const handleLoginButtonClick = async () => {
    if (!sellerWallets.walletAddress) {
      try {
        await connectWallet();
      } catch (error) {
        console.error("로그인 에러:", error);
      }
    }
  };

  return (
    <div className="flex flex-row justify-between p-5 border-b">
      <div>
        <Link to="/">
          <img
            src={logo}
            alt=""
            className=" tablet:w-[120px] mobile:w-[100px]"
          />
        </Link>
      </div>
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
            className="tablet:hidden mobile:hidden"
          />
        )}

        <button className={cn("hidden tablet:inline-block", "mobile:block")}>
          <img src={menuIcon} alt="" className="w-[25px]" />
        </button>
      </div>
    </div>
  );
};

export default Header;
