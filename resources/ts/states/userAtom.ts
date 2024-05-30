import { atom } from "recoil";
import { User } from "../types/user";

export const userAtom = atom<User | null>({
    key: "userAtom",
    default: null,
});
