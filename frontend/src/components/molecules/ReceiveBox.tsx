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
import { cn } from "../../utils/cn";

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
    try {
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

      // const verifyTest =
      //   await mascaApi.verifyData({
      //     credential: targetVc.data,
      //     verbose: true,
      //   });
      // console.log(
      //   "verification at the front",
      //   verifyTest
      // );

      const verifyRes = await axios.patch(
        `${process.env.REACT_APP_API || process.env.REACT_APP_AWS}/gift/${
          receivedItem.id
        }/use`,
        targetVc
      );
      console.log(verifyRes);
      setBtnState("fulfilled");
      setItem("상품 준비중");
    } catch (error) {
      console.error("사용하기에서 오류 발생:", error);
      alert("상품 사용하기에 실패했습니다.");
    }
  };

  const receiveGift = async () => {
    try {
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
      // 수정하기
      const saveVC = await mascaApi.saveCredential(response.data);
      console.log("확인!!!!!", saveVC);

      const successRes = await axios.post(`url/`, { success: saveVC.success });

      if (successRes.data.success) {
        setBtnState("issued");
        setItem("사용 가능");
      } else {
        alert(
          "디지털 바우처 발급을 거절하셨습니다. 선물을 받으시려면 승인이 필요합니다."
        );
      }

      // console.log("VC was handed over", response.data);
    } catch (error) {
      console.error("선물받기에서 오류 발생:", error);
      alert("서명 거부 시 선물받기를 할수없습니다ㅠㅠ ");
    }
  };

  const activeConfirmCheck = () => {
    if (
      window.confirm(
        "선물받기는 한번만 가능합니다. 서명 거부시 선물을 받을 수 없습니다. 네트워크 환경을 확인 후 눌러주세요."
      )
    ) {
      receiveGift();
    } else {
      alert("선물받기가 취소되었습니다.");
    }
  };

  const issuedConfirmCheck = () => {
    if (
      window.confirm(
        "선물을 사용하실 땐 서명이 반드시 필요합니다. 서명 거부시 선물을 사용할 수 없습니다.. 네트워크 환경을 확인 후 눌러주세요."
      )
    ) {
      verify();
    } else {
      alert("선물 사용하기가 취소되었습니다.");
    }
  };

  return (
    <>
      <div
        className={cn(
          "w-full shadow-xl bg-slate-200 rounded-xl py-9 px-7",
          "flex flex-row gap-10 justify-between items-center",
          "note:py-7",
          "tablet:flex-col tablet:flex-wrap tablet:p-5 gap-5"
        )}
      >
        <div className="flex flex-col gap-1 ">
          <p className="text-lg font-extrabold">{receivedItem.title}</p>
          <p>
            선물 받은 날짜 : <DateTime dateString={receivedItem.updatedAt} />
          </p>
          <p>상태 : {item}</p>
          <p className="tablet:hidden">From : {receivedItem.buyer}</p>
        </div>
        {receivedItem.state.length === 6 && (
          <div>
            {btnState === "issued" ? (
              <Button
                onClick={issuedConfirmCheck}
                variant="sendBtn1"
                size="dd"
                label="사용하기"
              />
            ) : btnState === "active" ? (
              <Button
                onClick={activeConfirmCheck}
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
