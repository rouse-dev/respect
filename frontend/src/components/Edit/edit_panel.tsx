import { FC, useState } from "react";
import EditPanelSelector from "./edit_panel_selector";
import EditGroups from "./edit_groups";
import EditStudents from "./edit_students";
import EditLessons from "./edit_lessons";
import useUserStore from "../../store/userStore";
import ProfileLink from "../Profile/ProfileLink";
import editMode from "../../types/edit_mode";

const EditPanel: FC = () => {
  const [mode, setMode] = useState<editMode>("Группы");

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-5 text-lg p-3 sm:p-5 text-white">
      <ProfileLink className="w-full sm:w-fit sm:mb-12 sm:ml-auto" useUserStore={useUserStore()} />

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
