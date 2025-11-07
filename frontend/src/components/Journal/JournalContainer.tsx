
import useUserStore from "../../store/userStore";
import Journal from "./Journal";

const JournalContainer = () => {
  return (
    <Journal
      useUserStore={useUserStore()}
    />
  );
};

export default JournalContainer;
