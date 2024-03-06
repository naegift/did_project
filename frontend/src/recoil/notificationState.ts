import { atom } from "recoil";

export const notificationState = atom({
  key: "notificationState", // 고유한 키
  default: [], // 기본값은 빈 배열
});
