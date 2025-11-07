import { useEffect, useState } from "react";
import Preloader from "../common/preloader/preloader";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import useGroupStore from "../../store/groupStore";
import useStudentStore from "../../store/studentStore";
import { GetAllGroups } from "../../service/teacher";

const Group = () => {
  const { currentGroup, setCurrentGroup, groups, setGroups } = useGroupStore();
  const { setSortedStudents, students } = useStudentStore();
  const [isLoading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await GetAllGroups();
        if (response.succes && response.data) {
          setGroups(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setGroups]);

  return (
    <div
      className="relative w-full sm:w-[250px] cursor-pointer selection:bg-transparent flex flex-row order-2 sm:order-1 justify-end items-center px-5 py-2 rounded-t-lg rounded-b-lg gap-5 bg-[--respect-purple-deep]"
      onClick={(e) => {
        const dropdown = e.currentTarget;
        dropdown.classList.toggle("rounded-b-lg");

        setDropdown(dropdown.querySelector("div")!.classList.contains("hidden"));
        dropdown.querySelector("div")!.classList.contains("hidden")
          ? dropdown.querySelector("div")!.classList.replace("hidden", "flex")
          : dropdown.querySelector("div")!.classList.replace("flex", "hidden");
      }}
    >
      <p className="flex mr-auto">
        {currentGroup ? currentGroup.name : "Все группы"}
      </p>
      <p className="hidden sm:block">|</p>
      {dropdown ? <FaAngleDown /> : <FaAngleUp />}

      <div className="hidden z-20 flex-col absolute left-0 top-full w-full max-h-64 overflow-y-scroll overflow-x-hidden rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-deep] bg-[--respect-purple]">
        {isLoading ? (
          <div className="py-4">
            <Preloader />
          </div>
        ) : (
          <>
            <button
              className="py-2 hover:backdrop-brightness-110"
              onClick={() => {
                setCurrentGroup(null);
                setSortedStudents(students);
              }}
            >
              <div className="p-2 cursor-pointer">Все группы</div>
            </button>
            {groups.map((group) => (
              <button
                className="py-2 cursor-pointer hover:backdrop-brightness-110 last:rounded-b-sm"
                key={group.id}
                onClick={() => {
                  setCurrentGroup(group);
                  setSortedStudents(students.filter(el => el.groupsId === group.id)); 
                }}
              >
                <div className="p-2">{group.name}</div>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Group;