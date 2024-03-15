import React from "react";
import { cn } from "../../utils/cn";

const ViewDetail: React.FC = () => {
    return (
        <div
            className={cn(
                "w-2/3 py-10 mx-auto px-48 flex flex-row gap-14 border-t border-b bg-slate-50",
                "note:px-10 note:w-3/4",
                "tablet:px-10 tablet:w-full",
                "mobile:w-full mobile:flex mobile:flex-col mobile:gap-4"
            )}
        >
            <div className=" mobile:font-bold">안내 사항</div>
            <ul className=" flex flex-col gap-1 list-disc mobile:gap-3 mobile:text-sm">
                <li>
                    선물 받으실 계정의 주소를 정확하게 입력한 다음 결제를
                    진행해주세요.
                </li>
                <li>
                    결제 진행 시 네트워크 환경에 따라 시간이 걸릴 수 있습니다.
                </li>
                <li>보내신 선물은 선물함에서 확인이 가능합니다.</li>
                <li>본 상품은 예시 이미지로서 실제 상품과 다를 수 있습니다.</li>
                <li>발송상품의 경우 유효기간 연장 및 환불 대상이 아닙니다</li>
                <li>
                    통신판매중개자로 거래 당사자가 아니므로, 판매자가 등록한
                    상품정보 및 거래 등에 대해 책임을 지지 않습니다.
                </li>
            </ul>
        </div>
    );
};

export default ViewDetail;
