import Profile from "./Profile";
import placeholder_avatar from "../../assets/media/placeholder_avatar.jpg";
import useUserStore from "../../store/userStore";

const ProfileContainer = () => {
  const {LogoutUser} = useUserStore();
  const handleLogout = () => {
    LogoutUser();
  };

  return (
    <Profile
      useUserStore={useUserStore()}
      handleLogout={handleLogout}
      placeholder_avatar={placeholder_avatar}
    />
  );
};

export default ProfileContainer;
