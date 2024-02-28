import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useWalletAndSuscribe from "../../hooks/useWalletAndSuscribe";
import { useRecoilState } from "recoil";
import Button from "../atoms/button";
import { logo } from "../../images";
import { menuIcon, userIcon } from "../../images/Icon";
import { walletState } from "../../recoil/walletState";

const Header: React.FC = () => {
  const { connectWallet } = useWalletAndSuscribe();
  const [sellerWallets] = useRecoilState(walletState);
  // const [welcomeMessage, setWelcomeMessage] = useState<string>("");

  // useEffect(() => {
  //   if (sellerWallets.isLoggedIn && sellerWallets.user) {
  //     setWelcomeMessage(`환영합니다, ${sellerWallets.user.name}님`);
  //   } else {
  //     setWelcomeMessage("");
  //   }
  // }, [sellerWallets]);

  const handleLoginButtonClick = async () => {
    if (!sellerWallets.isLoggedIn) {
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
          <img src={logo} alt="" />
        </Link>
      </div>
      <div className="flex flex-row gap-10">
        <Button variant="iconBtn" size="sm" label="">
          <img src={menuIcon} alt="" />
        </Button>
        <Link to="/product">
          <Button variant="sendBtn2" size="mdl" label="상품등록하기" />
        </Link>

        {sellerWallets.isLoggedIn ? (
          <div className="flex items-center">
            <span className="mr-2">환영합니다</span>
            <img src={userIcon} alt="" className="mr-2" />
          </div>
        ) : (
          <Button
            variant="iconTextBtn"
            size="md"
            label="Login"
            onClick={handleLoginButtonClick}
          >
            <img src={userIcon} alt="" className="mr-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
