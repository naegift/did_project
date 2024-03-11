import { atom } from "recoil";
import { PushAPI } from "@pushprotocol/restapi";

export const pushAPIState = atom<PushAPI | null>({
  key: "pushAPIState", // 고유한 키
  default: null, // 기본값
});
