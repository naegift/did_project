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
  on(
    event: string,
    listener: (...args: any[]) => void
  ): void;
}

declare global {
  interface Window {
    ethereum: Ethereum;
  }
}

const Header: React.FC = () => {
  const [api, setApi]: any =
    useState(null);
  // const [vcs, setVcs] = useState(null);
  const [did, setDid] = useState("");

  // useEffect(() => {
  //   changeWallet()
  // }, []);

  const changeWallet = () => {
    // When account changes in dapp
    window.ethereum.on(
      "accountsChanged",
      async (...accounts: any[]) => {
        const setAccountRes =
          await api.setCurrentAccount({
            currentAccount: (
              accounts[0] as string[]
            )[0],
          });

        if (isError(setAccountRes)) {
          console.error(
            setAccountRes.error
          );
          return;
        }
      }
    );
  };

  const walletConnect = async () => {
    // Connect the user and get the address of his current account
    const accounts =
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    const address = accounts[0];

    // Enable Masca

    const enableResult: any =
      await enableMasca(address, {
        // snapId:
        //   "npm:@blockchain-lab-um/masca",
        // version: "1.2.0-beta.2",
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
      await mascaApi.getDID();
    console.log(
      "currentDID: ",
      currentDID.data
    );
    setDid(currentDID.data);
  };

  const createVC = async () => {
    if (!api) return;
    const holderAddress =
      "0xC9Ca23774917afa90E7d6C9Ad300b57aCAC5bee8";

    const payload = {
      type: [
        "VerifiableCredential",
        "Drinks",
      ],
      credentialSubject: {
        id: `did:ethr:0xaa36a7:${holderAddress}`,
        category: "Eunjae Chicken",
        image:
          "https://s3.amazonaws.com/",
        shop: "BBQ",
        name: "순살 치킨",
        description:
          "누가 이런 닭대가리를 돈 주고 사 먹어요? 내가.",
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
          // save: true,
          // store: ["snap"],
        },
      });
    console.log(
      "VC creation Reponse, vcs in the data: ",
      res
    );

    const posted = await axios.post(
      "http://localhost:4000/vc",
      {
        credential: JSON.stringify(
          res.data
        ),
      }
    );
    console.log("VC posted: ", posted);

    // VC 조회 ()
    let queried =
      await api.queryCredentials();
    console.log(
      "VCs queried: ",
      queried
    );

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
        queried.data[
          queried.data.length - 1
        ].metadata.id,
        {
          store: ["snap"],
        }
      );
    console.log("Deleting...", deleted);

    queried =
      await api.queryCredentials();
    console.log(
      "Queried again to check deletion: ",
      queried
    );
  };

  const saveVC = async () => {
    const received = await axios.get(
      "http://localhost:4000/vc/17"
    );
    console.log(
      "VC received: ",
      JSON.parse(
        received.data.credential
      )
    );
    const parsed = JSON.parse(
      received.data.credential
    );
    console.log("parsed: ", parsed);
    const reparsed = JSON.parse(
      parsed.credential
    );

    await api.saveCredential(reparsed);
    console.log("VC saved: ", reparsed);

    const queried =
      await api.queryCredentials();
    console.log("queried: ", queried);
  };

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
        <button onClick={saveVC}>
          Save VC test
        </button>
      </div>
    </div>
  );
};

export default Header;
