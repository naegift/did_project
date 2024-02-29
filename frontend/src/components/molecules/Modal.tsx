import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { v4 as uuid } from "uuid";
import { ethers } from "ethers";

import Inputs from "../atoms/inputs";
import Button from "../atoms/button";
import { closeBtn } from "../../images/Icon";
import { Product } from "../../pages/View";
import { FACTORY_ABI } from "../../abi/factory";
import { useRecoilValue } from "recoil";
import { walletState } from "../../recoil/walletState";

interface ModalProps {
  onClose: () => void;
  product: Product;
}

const Modal: React.FC<ModalProps> = ({
  onClose,
  product,
}) => {
  const { id } = useParams();
  const [
    receiverInput,
    setReceiverInput,
  ] = useState<string>("");
  const { walletAddress } =
    useRecoilValue(walletState);

  const runEthers = async () => {
    const provider =
      new ethers.providers.Web3Provider(
        window.ethereum
      );
    console.log("provider: ", provider);

    const address = walletAddress;
    console.log(address);

    const signer =
      provider.getSigner(address);
    console.log(signer);

    const FACTORY_CONTRACT =
      "0x568996c47EdF580D0734c7728004d7d51A7df260";
    const UUID = uuid();
    console.log(UUID);

    const contract =
      new ethers.Contract(
        FACTORY_CONTRACT,
        FACTORY_ABI,
        provider
      );

    const buyer = address;
    console.log(buyer);

    const seller = product.seller;
    console.log("seller :", seller);
    // const price = product.price;
    // console.log(price);
    // const priceETH = ethers.utils.parseUnits(price, "ether").toString();
    // console.log(priceETH);

    const receiver = receiverInput;
    const market =
      "0xeF3010D076f62A91A774016E5eBAf58A1BFe1bD6";

    const transaction = {
      to: FACTORY_CONTRACT,
      data: contract.interface.encodeFunctionData(
        "createEscrow",
        [
          buyer,
          seller,
          receiver,
          market,
          ethers.utils
            .parseUnits(
              "0.001",
              "ether"
            )
            .toString(),
          UUID,
        ]
      ),
      value: ethers.utils
        .parseUnits("0.001", "ether")
        .toString(),
      gasLimit: 3000000,
    };
    console.log(transaction);

    await signer.sendTransaction(
      transaction
    );
    console.log(
      "Transaction sign post body: ",
      {
        buyer,
        receiver,
        uuid: UUID,
      }
    );

    const reqBody = {
      buyer,
      receiver,
      uuid: UUID,
    };

    const response = await axios.post(
      `${
        process.env.REACT_APP_API ||
        process.env.REACT_APP_AWS
      }/product/${id}/pay`,
      reqBody
    );
    console.log(response);
  };

  const sendGift = async () => {
    if (receiverInput.trim() !== "") {
      await runEthers();
    } else {
      alert(
        "받는 사람 지갑 주소를 입력해주세요."
      );
    }
  };

  return (
    <>
      {onClose && (
        <>
          <div className="fixed inset-0 bg-black opacity-80"></div>
          <div className="fixed inset-0 flex items-center justify-center text-center">
            <div className="fixed z-10 rounded-xl">
              <div className=" inline-block align-bottom bg-white p-5 rounded-xl text-left overflow-hidden shadow-xl">
                <div className=" absolute right-6 top-3 text-xl">
                  <button
                    onClick={onClose}
                  >
                    <img
                      src={closeBtn}
                      alt=""
                    />
                  </button>
                </div>
                <div className=" px-4 pt-5 pb-4">
                  <div>
                    <div className="mt-3 text-center ">
                      <h3 className="text-2xl py-3 text-gray-900 ">
                        {product.title}{" "}
                        선물 보내기
                      </h3>
                      <p className="py-3">
                        금액 :{" "}
                        {product.price}{" "}
                      </p>

                      <Inputs
                        onChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) =>
                          setReceiverInput(
                            e.target
                              .value
                          )
                        }
                        type="text"
                        size="xlg"
                        placeholder="받는 사람 지갑 주소를 입력해주세요"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 flex justify-center ">
                  <Button
                    onClick={sendGift}
                    variant="sendBtn2"
                    size="lg"
                    label="결제 후 선물보내기"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Modal;
