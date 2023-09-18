import { atom } from "recoil";

export const userDetailAtom = atom({
  key: "userDetailState",
  default: {
    name: "",
    email: "",
  },
});