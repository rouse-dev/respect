import { useState } from "react";
import EditPanelSelector from "./edit_panel_selector";
import EditGroups from "./edit_groups";
import EditStudents from "./edit_students";
import EditLessons from "./edit_lessons";
import { Link } from "react-router-dom";
import { ImUndo2 } from "react-icons/im";
import useUserStore from "../../store/userStore";
import ProfileLink from "../Profile/ProfileLink";

const EditPanel = () => {
  const [mode, setMode] = useState("Группы");

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-5 text-lg p-3 sm:p-5 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:mb-12">
        <Link
          className="order-2 sm:order-1 flex flex-row items-center justify-center gap-2 w-full text-center sm:w-fit px-3 py-2 rounded-lg bg-[--respect-purple-deep]"
          to="/"
        >
          На главную <ImUndo2 />
        </Link>
        <ProfileLink className="order-1 sm:order-2 w-full sm:w-fit" useUserStore={useUserStore()} />
      </div>

      <EditPanelSelector setMode={setMode} />
      <div className="flex flex-row items-start">
        <EditGroups isOpen={mode === "Группы"} />
        <EditStudents isOpen={mode === "Студенты"} />
        <EditLessons isOpen={mode === "Предметы"} />
      </div>
    </div>
  );
};

export default EditPanel;
