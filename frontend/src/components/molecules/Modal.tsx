import React from "react";
import Inputs from "../atoms/inputs";
import Button from "../atoms/button";
import { closeBtn } from "../../images/Icon";

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <>
      {onClose && (
        <>
          <div className="fixed inset-0 bg-black opacity-80"></div>
          <div className="fixed inset-0 flex items-center justify-center text-center">
            <div className="fixed z-10 rounded-xl">
              <div className=" inline-block align-bottom bg-white p-5 rounded-xl text-left overflow-hidden shadow-xl">
                <div className=" absolute right-6 top-3 text-xl">
                  <button onClick={onClose}>
                    <img src={closeBtn} alt="" />
                  </button>
                </div>
                <div className=" px-4 pt-5 pb-4">
                  <div>
                    <div className="mt-3 text-center ">
                      <h3 className="text-2xl py-3 text-gray-900 ">
                        선물보내기
                      </h3>

                      <Inputs
                        size="xlg"
                        placeholder="받는 사람 지갑 주소를 입력해주세요"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 flex justify-center ">
                  <Button
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
