import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const walletState = atom({
  key: "walletState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
