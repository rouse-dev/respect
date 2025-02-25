import { useEffect } from "react";
import Home from "./Home";
import useUserStore from "../../store/userStore";
import { useAppContext } from "../../store/AppContext";

const HomeContainer = () => {
  const { popupActive } = useAppContext();
  useEffect(() => {
    console.log(popupActive)
    document.body.style.setProperty('overflow', popupActive ? "hidden" : "");
  }, [popupActive]);

  return (
    <Home
      useUserStore={useUserStore()}
    />
  );
};

export default HomeContainer;
