import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  QueryCredentialsRequestResult,
  enableMasca,
  isError,
} from "@blockchain-lab-um/masca-connector";
import { useRecoilValue } from "recoil";
import { walletState } from "../../recoil/walletState";

import { Product } from "../../pages/Gift";
import Button from "../atoms/button";
import DateTime from "./DateTime";
import { runEthers } from "../../utils/ethers";

interface GiftListData {
  receivedItem: Product;
}

const ReceiveBox: React.FC<GiftListData> = ({ receivedItem }) => {
  const { walletAddress: address } = useRecoilValue(walletState);

  const [btnState, setBtnState] = useState<string>("active");
  const [item, setItem] = useState<string>("선물받기 버튼을 눌러주세요");

  const states: {
    [key: string]: string;
  } = {
    issued: "사용 가능",
    active: "선물받기 버튼을 눌러주세요",
    fulfilled: "상품 준비중",
    productUsed: "사용 완료",
    executed: "사용 완료",
  };

  useEffect(() => {
    if (receivedItem.state in states) {
      setItem(states[receivedItem.state]);
      setBtnState(receivedItem.state);
    } else {
      console.error(`state: ${receivedItem.state}`);
    }
  }, [receivedItem.state]);

  const verify = async () => {
    const enableResult: any = await enableMasca(address, {
      snapId: "npm:@blockchain-lab-um/masca",
      version: "1.2.0-beta.2",
    });

    const mascaApi = await enableResult.data.getMascaApi();
    await mascaApi.setCurrentAccount({
      account: address,
    });

    console.log("api was fed an account address: ", mascaApi);

    const queried = await mascaApi.queryCredentials();
    console.log(queried);

    const targetVc = await queried?.data?.find(
      (element: QueryCredentialsRequestResult) =>
        element?.data?.credentialSubject?.voucher?.giftID === receivedItem.id
    );

    const verifyRes = await axios.patch(
      `${process.env.REACT_APP_API || process.env.REACT_APP_AWS}/gift/${
        receivedItem.id
      }/use`,
      targetVc
    );
    console.log(verifyRes);
    setBtnState("fulfilled");
    setItem("상품 준비중");
  };

  const receiveGift = async () => {
    const enableResult: any = await enableMasca(address, {
      snapId: "npm:@blockchain-lab-um/masca",
      version: "1.2.0-beta.2",
    });

    const mascaApi = await enableResult.data.getMascaApi();
    await mascaApi.setCurrentAccount({
      account: address,
    });

    console.log("api was fed an account address: ", mascaApi);

    const { message, signature } = await runEthers(
      receivedItem.title,
      receivedItem.content,
      receivedItem.price
    );
    const response = await axios.patch(
      `${process.env.REACT_APP_API || process.env.REACT_APP_AWS}/gift/${
        receivedItem.id
      }/receive`,
      {
        signature,
        title: message.title,
        content: message.content,
        price: message.price,
      }
    );
    await mascaApi.saveCredential(response.data);
    console.log("VC was handed over", response.data);
    setBtnState("issued");
    setItem("사용 가능");
  };

  return (
    <>
      <div className="shadow-xl bg-slate-200 rounded-xl p-7 flex flex-row gap-10 justify-between items-center">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-extrabold">{receivedItem.title}</p>
          <p>
            선물 받은 날짜 : <DateTime dateString={receivedItem.updatedAt} />
          </p>
          <p>상태 : {item}</p>
          <p>From : {receivedItem.buyer}</p>
        </div>
        {receivedItem.state.length === 6 && (
          <div>
            {btnState === "issued" ? (
              <Button
                onClick={verify}
                variant="sendBtn1"
                size="dd"
                label="사용하기"
              />
            ) : btnState === "active" ? (
              <Button
                onClick={receiveGift}
                variant="basicBtn"
                size="dd"
                label="선물받기"
              />
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};

export default ReceiveBox;
