import { useEffect } from "react";
import { useAppContext } from "../../store/AppContext";
import Home from "./Home";
import useUserStore from "../../store/userStore";

const HomeContainer = () => {
  const { popupActive } = useAppContext();
  useEffect(() => {
    document.body.style.overflow = popupActive ? "hidden" : "";
  }, [popupActive]);

  return (
    <Home
      useUserStore={useUserStore()}
    />
  );
};

export default HomeContainer;
