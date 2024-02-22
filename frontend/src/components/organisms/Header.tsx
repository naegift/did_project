import React from "react";

import Button from "../atoms/button";
import { logo } from "../../images";
import { menuIcon, userIcon } from "../../images/Icon";

const Header: React.FC = () => {
  return (
    <div className="flex flex-row justify-between p-5 border bottom-1">
      <div>
        <img src={logo} alt="" />
      </div>
      <div className="flex flex-row gap-10">
        <Button variant="iconBtn" size="sm" label="">
          <img src={menuIcon} alt="" />
        </Button>
        <Button variant="sendBtn1" size="mdl" label="상품등록하기" />
        <Button variant="iconTextBtn" size="md" label="Login">
          <img src={userIcon} alt="" className="mr-2" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
