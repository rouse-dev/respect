import placeholder_avatar from "../assets/media/placeholder_avatar.png";
import RemovePopup from "../components/remove_popup";
import AddPopup from "../components/add_popup";
import { Link } from "react-router-dom";
import HistoryPopup from "../components/history_popup";
import Group from "../components/group";
import Students from "../components/Students";
import { useAppContext } from "../context/AppContext";
import Sort from "../components/Sorting/Sort";

const Home = () => {
  const { user, currentStudent, setCurrentStudent } = useAppContext();

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-5 text-lg p-3 sm:p-5 text-white">
      <AddPopup />
      <RemovePopup />
      <HistoryPopup
        student={currentStudent}
        setCurrentStudent={setCurrentStudent}
      />

      <div className="flex flex-col sm:flex-row gap-5 justify-between mb-6 sm:mb-12">
        <Group />
        <Link
          className="flex flex-row order-1 sm:order-2 justify-center items-center px-3 py-2 rounded-lg gap-4 bg-[--respect-purple-deep]"
          to="/profile"
        >
          <p className="flex w-fit">{user.username || "- Фамилия И.О. -"}</p>
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
