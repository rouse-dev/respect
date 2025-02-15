import { useEffect } from "react";
import { useAppContext } from "../../store/AppContext";
import Home from "./Home";
import placeholder_avatar from "../../assets/media/placeholder_avatar.jpg";
import useUserStore from "../../store/userStore";

const HomeContainer = () => {
  const { popupActive } = useAppContext();
  useEffect(() => {
    document.body.style.overflow = popupActive ? "hidden" : "";
  }, [popupActive]);

  return (
    <Home
      useUserStore={useUserStore()}
      placeholder_avatar={placeholder_avatar}
    />
  );
};

export default HomeContainer;
