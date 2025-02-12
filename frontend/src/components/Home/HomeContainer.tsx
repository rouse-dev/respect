import { useEffect } from "react";
import { useAppContext } from "../../store/AppContext";
import userStore from "../../store/userStore";
import Home from "./Home";
import placeholder_avatar from "../../assets/media/placeholder_avatar.jpg";

const HomeContainer = () => {
  const { user, popupActive } = useAppContext();
  useEffect(() => {
    console.log(popupActive);
    document.body.style.overflow = popupActive ? "hidden" : "";
  }, [popupActive]);
  console.log(userStore.username);

  return (
    <Home
      userStore={userStore}
      user={user}
      placeholder_avatar={placeholder_avatar}
    />
  );
};

export default HomeContainer;
