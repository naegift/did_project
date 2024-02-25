import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Button from "../atoms/button";
import { logo } from "../../images";
import {
  menuIcon,
  userIcon,
} from "../../images/Icon";
import {
  enableMasca,
  isError,
} from "@blockchain-lab-um/masca-connector";
import axios from "axios";

interface Ethereum {
  request: ({
    method,
  }: {
    method: string;
  }) => Promise<any>;
}

declare global {
  interface Window {
    ethereum: Ethereum;
  }
}

const Header: React.FC = () => {
  const [api, setApi] = useState(null);
  // const [vcs, setVcs] = useState(null);
  const [did, setDid] = useState("");

  // useEffect(() => {
  //   runMasca();
  // }, []);

  const walletConnect = async () => {
    // Connect the user and get the address of his current account
    const accounts =
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    const address = accounts[0];

    // Enable Masca
    const enableResult =
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
    setApi(mascaApi);
    const currentDID =
      await api.getDID();
    console.log(
      "currentDID: ",
      currentDID.data
    );
    setDid(currentDID.data);
  };

  const createVC = async () => {
    if (!api) return;
    const receiverAddress =
      "0xC9Ca23774917afa90E7d6C9Ad300b57aCAC5bee8";

    const payload = {
      type: [
        "VerifiableCredential",
        "Food",
      ],
      credentialSubject: {
        id: `did:ethr:0xaa36a7:${receiverAddress}`,
        category: "Chicken",
        image:
          "https://s3.amazonaws.com/",
        shop: "BBQ",
        name: "황금올리브",
        description:
          "신선한 올리브유에서 튀긴 건강한 치킨",
      },
      credentialSchema: {
        id: "https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json",
        type: "JsonSchemaValidator2018",
      },
      // expirationDate: new Date(),
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        {
          id: "https://example.com/schemas/test-credential/1.0/ld-context.json",
          type: "http://www.w3.org/ns/json-ld#context",
          name: "test-credential",
          version: "1.0",
          description:
            "테스트 Credential 컨텍스트",
          properties: {
            accomplishmentType:
              "https://example.com/schemas/test-credential/1.0/accomplishmentType",
            expirationDate:
              "https://example.com/schemas/test-credential/1.0/expirationDate",
          },
        },
      ],
    };

    // VC 생성
    const res =
      await api.createCredential({
        minimalUnsignedCredential:
          payload,
        proofFormat:
          "EthereumEip712Signature2021",
        options: {
          save: true,
          store: ["snap"],
        },
      });
    console.log(
      "VC creation Reponse, vcs in the data: ",
      res
    );
    // setVcs(res.data);

    // axios.post('http://localhost:4000/')

    // VC 조회 ()
    let saved =
      await api.queryCredentials();
    console.log("VCs queried: ", saved);

    const vp =
      await api.createPresentation({
        vcs: [res.data],
        proofFormat:
          "EthereumEip712Signature2021",
      });
    console.log("vp: ", vp);

    const document =
      await api.resolveDID(did);
    console.log(
      "DID Document is being checked to get public key, saved for verification: ",
      document
    );

    // VC 검증
    const vpRes = await api.verifyData({
      presentation: vp.data,
      // verbose: true,
    });
    // console.log(res.data);
    // console.log(vp.data);
    console.log(
      "Verification response: ",
      vpRes
    );

    // VC 삭제
    const deleted =
      await api.deleteCredential(
        saved.data[
          saved.data.length - 1
        ].metadata.id,
        {
          store: ["snap"],
        }
      );
    console.log("Deleting...", deleted);

    saved =
      await api.queryCredentials();
    console.log(
      "Queried again to check deletion: ",
      saved
    );
  };

  // const saveVC = async () => {
  //   api.saveCredential();
  // };

  return (
    <div className="flex flex-row justify-between p-5 border-b">
      <div>
        <Link to="/">
          <img src={logo} alt="" />
        </Link>
      </div>
      <div className="flex flex-row gap-10">
        <Button
          variant="iconBtn"
          size="sm"
          label=""
        >
          <img src={menuIcon} alt="" />
        </Button>
        <Link to="/product">
          <Button
            variant="sendBtn2"
            size="mdl"
            label="상품등록하기"
          />
        </Link>

        <Button
          onClick={walletConnect}
          variant="iconTextBtn"
          size="md"
          label="Login"
        >
          <img
            src={userIcon}
            alt=""
            className="mr-2"
          />
        </Button>
        <button onClick={createVC}>
          Create VC test
        </button>
        {/* <button>Save VC test</button> */}
      </div>
    </div>
  );
};

export default Header;
