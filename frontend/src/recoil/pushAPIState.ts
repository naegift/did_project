import { atom } from "recoil";
import { PushAPI } from "@pushprotocol/restapi";

export const pushAPIState = atom<PushAPI | null>({
  key: "pushAPIState",
  default: null,
});
