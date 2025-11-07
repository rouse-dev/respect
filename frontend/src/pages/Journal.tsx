import Students from "../components/Students/Students";
import Sort from "../components/Sorting/Sort";
import JournalContainer from "../components/Journal/JournalContainer";
import { FC } from "react";

const Journal: FC = () => {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-5 text-lg p-3 sm:p-5 text-white">
      <JournalContainer />
      <Sort />
      <Students />
    </div>
  );
};

export default Journal;
