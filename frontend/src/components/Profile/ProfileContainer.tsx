import { useState } from "react";
import Profile from "./Profile";
import userStore from "../../store/userStore";
import placeholder_avatar from "../../assets/media/placeholder_avatar.jpg";

const ProfileContainer = () => {
  const [user, setUser] = useState({
    username: "",
    avatar: "",
  });
  const handleLogout = () => {
    userStore.logoutUser();
  };

  return (
    <Profile
      user={user}
      handleLogout={handleLogout}
      placeholder_avatar={placeholder_avatar}
    />
  );
};

export default ProfileContainer;
