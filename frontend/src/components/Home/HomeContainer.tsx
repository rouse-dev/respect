import Home from "./Home";
import useUserStore from "../../store/userStore";

const HomeContainer = () => {
  return (
    <Home
      useUserStore={useUserStore()}
    />
  );
};

export default HomeContainer;
