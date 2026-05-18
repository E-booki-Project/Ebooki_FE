import { useContext } from "react";
import { UserContext } from "./UserContext";

export const useUserInfo = () => useContext(UserContext);
