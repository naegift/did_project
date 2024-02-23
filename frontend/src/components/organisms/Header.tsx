import React from "react";
import { Link } from "react-router-dom";

import Button from "../atoms/button";
import { logo } from "../../images";
import { menuIcon, userIcon } from "../../images/Icon";

const Header: React.FC = () => {
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

        <Button variant="iconTextBtn" size="md" label="Login">
          <img src={userIcon} alt="" className="mr-2" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
