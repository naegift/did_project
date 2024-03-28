import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  QueryCredentialsRequestResult,
  enableMasca,
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

const states: {
  [key: string]: string;
} = {
  issued: "VC Issued",
  active: "Claimable",
  fulfilled: "Preparing the product",
  productUsed: "Used",
  executed: "Settled",
};

const ReceiveBox: React.FC<GiftListData> = ({ receivedItem }) => {
  const { walletAddress: address } = useRecoilValue(walletState);
  const [btnState, setBtnState] = useState<string>("active");
  const [item, setItem] = useState<string>(`Please Press 'Receive Gift'`);
  const [loading, setLoading] = useState<boolean>(false);
  const protocol = window.location.href.split("//")[0] + "//";
  useEffect(() => {
    console.log(btnState);
  }, [btnState]);

  useEffect(() => {
    if (receivedItem.state in states) {
      setItem(states[receivedItem.state]);
      setBtnState(receivedItem.state);
    } else {
      console.error(`state: ${receivedItem.state}`);
    }
  }, [receivedItem]);

  const confirm = async () => {
    try {
      setLoading(true);
      const confirmUrl = `${process.env.REACT_APP_API}/gift/${receivedItem.id}/confirm`;
      const confirmRes = await axios.patch(confirmUrl);
      console.log("confirmed result: ", confirmRes);
      if (confirmRes.data.success) {
        setBtnState("executed");
        setItem("Gift delivered, transaction completed.");
      } else alert("Failed to confirm receipt.");
    } catch (error) {
      console.error("수령하기에서 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    try {
      setLoading(true);
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
          element?.data?.credentialSubject?.giftID === receivedItem.id
      );

      const verifyTest = await mascaApi.verifyData({
        credential: targetVc.data,
        verbose: true,
      });
      console.log("verification at the front", verifyTest);

      const verifyRes = await axios.patch(
        `${process.env.REACT_APP_API}/gift/${receivedItem.id}/use`,
        targetVc
      );
      console.log("verified result: ", verifyRes);

      if (verifyRes.data.success) {
        setBtnState("fulfilled");
        setItem("The seller is preparing the product.");
      } else {
        alert("Validation logic server error.");
      }
    } catch (error) {
      console.error("사용하기에서 오류 발생:", error);
      alert("Failed to use the product.");
    } finally {
      setLoading(false);
    }
  };

  const receiveGift = async () => {
    try {
      setLoading(true);
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
        `${process.env.REACT_APP_API}/gift/${receivedItem.id}/receive`,
        {
          signature,
          title: message.title,
          content: message.content,
          price: message.price,
        }
      );
      // 수정하기
      const saveVC = await mascaApi.saveCredential(response.data);
      console.log("VC saved: ", saveVC);

      const issueVcUrl = `${process.env.REACT_APP_API}/gift/${receivedItem.id}/issue`;
      const successRes = await axios.post(issueVcUrl, {
        success: saveVC.success,
      });

      if (successRes.data.success) {
        setBtnState("issued");
        setItem(`You can use the gift. Please press 'Use Gift'.`);
      } else {
        alert(
          "You have declined the issuance of the digital voucher. Approval is required to receive the gift."
        );
      }
    } catch (error) {
      console.error("선물받기에서 오류 발생:", error);
      // alert("서명 거부 시 선물받기를 할수없습니다ㅠㅠ ");
    } finally {
      setLoading(false);
    }
  };

  const activeConfirmCheck = () => {
    if (
      window.confirm(
        "Receiving a gift is only possible once. You cannot receive the gift if you refuse to sign. Please check your network environment before pressing."
      )
    ) {
      receiveGift();
    } else {
      alert("VC Issuance has been cancelled.");
    }
  };

  const issuedConfirmCheck = () => {
    if (
      window.confirm(
        "A signature is required when using a gift. You cannot use the gift if you refuse to sign. Please check your network environment before pressing."
      )
    ) {
      verify();
    } else {
      alert("VC Verification has been cancelled.");
    }
  };

  const fulfilledConfirmCheck = () => {
    if (
      window.confirm(
        "Once confirmed, it cannot be cancelled. Would you like to confirm receipt?"
      )
    ) {
      confirm();
    } else alert("The confirmation of receipt has been cancelled.");
  };

  return (
    <>
      <div
        className={cn(
          "w-full shadow-xl bg-slate-200 rounded-xl py-9 px-7",
          "flex flex-row gap-10 justify-between items-center",
          "note:py-8 note:px-5",
          "tablet:flex-col tablet:flex-wrap tablet:p-5 gap-5"
        )}
      >
        <div className="flex flex-col gap-1 ">
          <p className="text-lg font-extrabold">{receivedItem.title}</p>
          <p>
            Date received : <DateTime dateString={receivedItem.updatedAt} />
          </p>
          <p>State : {item}</p>
          <p className="tablet:hidden">From : {receivedItem.buyer}</p>
        </div>
        {(receivedItem.state === "issued" ||
          receivedItem.state === "active" ||
          receivedItem.state === "fulfilled") && (
          <div>
            {loading ? (
              <div
                className={cn(
                  "flex justify-center items-center gap-4 ",
                  "w-[85px] h-[85px] text-[16px] rounded-xl bg-white"
                )}
              >
                <svg
                  className="animate-spin h-8 w-8 text-[#ff4400]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              <div>
                {btnState === "issued" ? (
                  <Button
                    onClick={issuedConfirmCheck}
                    variant="sendBtn1"
                    size="dd"
                    label="Use Gift"
                  />
                ) : btnState === "active" ? (
                  <Button
                    onClick={activeConfirmCheck}
                    variant="basicBtn"
                    size="dd"
                    label="Receive Gift"
                  />
                ) : btnState === "fulfilled" ? (
                  <Button
                    onClick={fulfilledConfirmCheck}
                    variant="sendBtn1"
                    size="dd"
                    label="Confirm Receipt"
                  />
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ReceiveBox;
