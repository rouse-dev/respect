import Profile from "./Profile";
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
    />
  );
};

export default ProfileContainer;
