import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const walletState = atom({
  key: "walletState",
  default: {
    walletAddress: "",
  },
  effects_UNSTABLE: [persistAtom],
});
