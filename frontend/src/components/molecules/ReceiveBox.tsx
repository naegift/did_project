import React from "react";
import { Product } from "../../pages/Gift";
import Button from "../atoms/button";
import DateTime from "./DateTime";
import axios from "axios";
import { runEthers } from "../../utils/ethers";
import {
  QueryCredentialsRequestResult,
  enableMasca,
  isError,
} from "@blockchain-lab-um/masca-connector";

interface GiftListData {
  receivedItem: Product;
}

const ReceiveBox: React.FC<
  GiftListData
> = ({ receivedItem }) => {
  const verify = async () => {
    const accounts =
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    const address = accounts[0];

    // Enable Masca

    const enableResult: any =
      await enableMasca(address, {
        snapId:
          "npm:@blockchain-lab-um/masca",
        version: "1.2.0-beta.2",
      });

    // // Check if there was an error and handle it accordingly
    // if (isError(enableResult)) {
    //     // Error message is available under error
    //     console.error(enableResult.error);
    // }

    // Now get the Masca API object
    const mascaApi =
      await enableResult.data.getMascaApi();

    await mascaApi.setCurrentAccount({
      account: address,
    });

    console.log(
      "api was fed an account address: ",
      mascaApi
    );

    const queried =
      await mascaApi.queryCredentials();
    console.log(queried);

    const targetVc =
      await queried?.data?.find(
        (
          element: QueryCredentialsRequestResult
        ) =>
          element?.data
            ?.credentialSubject?.voucher
            ?.giftID === receivedItem.id
      );

    const verifyRes = await axios.patch(
      `${
        process.env.REACT_APP_API ||
        process.env.REACT_APP_AWS
      }/gift/${receivedItem.id}/use`,
      targetVc
    );
    console.log(verifyRes);
  };

  const receiveGift = async () => {
    const accounts =
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    const address = accounts[0];

    // Enable Masca

    const enableResult: any =
      await enableMasca(address, {
        snapId:
          "npm:@blockchain-lab-um/masca",
        version: "1.2.0-beta.2",
      });

    // // Check if there was an error and handle it accordingly
    // if (isError(enableResult)) {
    //     // Error message is available under error
    //     console.error(enableResult.error);
    // }

    // Now get the Masca API object
    const mascaApi =
      await enableResult.data.getMascaApi();

    await mascaApi.setCurrentAccount({
      account: address,
    });

    console.log(
      "api was fed an account address: ",
      mascaApi
    );

    const { signature } =
      await runEthers(
        "test",
        "test",
        "test"
      );
    const response = await axios.patch(
      `${
        process.env.REACT_APP_API ||
        process.env.REACT_APP_AWS
      }/gift/${
        receivedItem.id
      }/receive`,
      {
        signature,
      }
    );
    await mascaApi.saveCredential(
      response.data
    );
    console.log(
      "VC was handed over",
      response.data
    );
    const queried =
      await mascaApi.queryCredentials();
    console.log(queried);
  };
  return (
    <>
      <div className="shadow-xl bg-slate-200 rounded-xl p-7 flex flex-row gap-10 items-center">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-extrabold">
            {receivedItem.title}
          </p>
          <p>
            선물 받은 날짜 :{" "}
            <DateTime
              dateString={
                receivedItem.updatedAt
              }
            />
          </p>
          <p>
            상태 :{" "}
            {receivedItem.state !==
            "active"
              ? "사용 완료"
              : "사용 가능"}
          </p>
          <p>
            From : {receivedItem.buyer}
          </p>
        </div>
        <div>
          <Button
            onClick={receiveGift}
            variant="basicBtn"
            size="dd"
            label="선물받기"
          />
          <Button
            onClick={verify}
            variant="basicBtn"
            size="dd"
            label="선물 사용하기"
          />
        </div>
      </div>
    </>
  );
};

export default ReceiveBox;
