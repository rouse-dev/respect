import placeholder_avatar from "../assets/media/placeholder_avatar.png";
import RemovePopup from "../components/remove_popup";
import AddPopup from "../components/add_popup";
import { Link } from "react-router-dom";
import HistoryPopup from "../components/history_popup";
import Group from "../components/group";
import Students from "../components/Students";
import { useAppContext } from "../store/AppContext";
import Sort from "../components/Sorting/Sort";
import userStore from "../store/userStore";
import Add from "../components/add/add";
import { useEffect } from "react";

const Home = () => {
  const { user, currentStudent, setCurrentStudent, popupActive } = useAppContext();

  useEffect(() => {
    document.body.style.overflow = (popupActive ? 'hidden' : '');
  }, [popupActive]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-5 text-lg p-3 sm:p-5 text-white">
      <AddPopup />
      <RemovePopup />
      <HistoryPopup
        student={currentStudent}
        setCurrentStudent={setCurrentStudent}
      />

      <div className="flex flex-col sm:flex-row gap-5 justify-between mb-6 sm:mb-12">
        <div className="flex justify-center items-center gap-3 order-2 sm:order-1">
          <Add />
          <Group />
        </div>
        <Link className="flex flex-row order-1 sm:order-2 justify-center items-center px-3 py-2 rounded-lg gap-4 bg-[--respect-purple-deep]"
          to="/profile">
          <p className="flex w-fit">
            {userStore.username || "- Фамилия И.О. -"}
          </p>
          <img
            className="w-11 h-11 rounded-[100%]"
            src={
              user.avatar
                ? `http://localhost:0000/some_folder/${user.avatar}`
                : placeholder_avatar
            }
          />
        </Link>
        
      </div>

      <Sort></Sort>
      <Students />
    </div>
  );
};

export default Home;
