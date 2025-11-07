import {
  FaEdit,
  FaRegPlusSquare,
  FaTrashAlt,
  FaUserPlus,
  FaSave,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { MdGroupAdd } from "react-icons/md";
import StudentPopup from "../common/popups/addPopups/add_students";
import SingleStudentPopup from "../common/popups/addPopups/add_single_student";
import {
  deleteStudent,
  updateStudent,
} from "../../service/server";
import Preloader from "../common/preloader/preloader";
import { TbCancel } from "react-icons/tb";
import { Student, StudentData } from "../../interfaces/student";
import { Group } from "../../interfaces/group";
import useStudentStore from "../../store/studentStore";
import useGroupStore from "../../store/groupStore";
import usePopupStore from "../../store/popupStore";
import { GetAllStudents } from "../../service/admin";

interface EditStudentsInterface {
  isOpen: boolean;
}

const EditStudents = ({ isOpen }: EditStudentsInterface) => {
  const { setPopupActive } = usePopupStore();
  const { students, setStudents } = useStudentStore();
  const { groups } = useGroupStore();
  const [search, setSearch] = useState("");
  const [isStudentPopup, setIsStudentPopup] = useState(false);
  const [isSingleStudentPopup, setIsSingleStudentPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortedStudents, setSortedStudents] = useState<Student[] | []>([...students]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [studentGroup, setStudentGroup] = useState<Group | null>();

  const handleEdit = (id: number, name: string, group: Group) => {
    setEditingId(id);
    setNewName(name);
    setStudentGroup(group);
  };

  const handleSave = async (id: number, group: Group) => {
    await updateStudent({ id, name: newName, groupsId: group.id }).then((res) => {
      if (!res.error) {
        setStudents(
          students.map((student) =>
            student.id === id ? { ...student, name: newName, groups: group, groupsId: group.id } : student
          )
        );
        setSortedStudents(
          sortedStudents.map((student) =>
            student.id === id ? { ...student, name: newName, groups: group, groupsId: group.id } : student
          )
        );
        setEditingId(null);
      }
    });
  };

  const HandleDelete = async (studentId: number) => {
    await deleteStudent(studentId).then(_ => {
      GetAllStudents().then(response => {
        setStudents(response.data);
        setSortedStudents(response.data.filter((student: StudentData) => 
          student.name.toLowerCase().includes(search.toLowerCase())
        ));
      })
    });
  };

  useEffect(() => {
    try {
      setLoading(true);
      GetAllStudents().then((response) => {
        setStudents(response.data);
        setSortedStudents(response.data);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    search.length > 0
      ? setSortedStudents(
          [...students].filter((student: Student) =>
            student.name.toLowerCase().includes(search.toLowerCase())
          )
        )
      : setSortedStudents([...students]);
  }, [students, search]);

  useEffect(() => {
    try {
      setLoading(true);
      GetAllStudents().then((response) => {
        setStudents(response.data);
        setSortedStudents(response.data);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [groups]);

  return (
    <>
      {loading && <Preloader />}
      <div
        className={`${
          isOpen ? "max-w-full px-3 sm:px-5" : "max-w-0 max-h-0"
        } overflow-hidden transition-[max-width_max-height] py-3 sm:py-5 w-full flex flex-col gap-5 text-lg bg-[--respect-purple-deep] rounded-md`}
      >
        <input
          className={`placeholder:text-[#8e8e8e] w-full  bg-[--respect-purple-dark] outline-none rounded-lg py-2 pl-3 pr-9 outline-hidden ${
            search.length
              ? "bg-[url(./assets/media/lypa-white.svg)]"
              : "bg-[url(./assets/media/lypa-grey.svg)]"
          } bg-no-repeat bg-[calc(100%-8px)_center] bg-[24px_auto]`}
          placeholder="Поиск..."
          type="text"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-3">
          <button
            onClick={() => {
              setPopupActive(true);
              setIsSingleStudentPopup(true);
            }}
            className="flex flex-row justify-center items-center w-full gap-3 p-3 bg-[--respect-purple-dark] rounded-md transition-shadow hover:shadow-[0px_0px_5px_var(--respect-purple-light)]"
          >
            <p className="hidden sm:block">Добавить одного</p>
            <FaUserPlus className="sm:hidden" />
            <FaRegPlusSquare className="hidden sm:block" />
          </button>
          <button
            onClick={() => setIsStudentPopup(true)}
            className="flex flex-row justify-center items-center w-full gap-3 p-3 bg-[--respect-purple-dark] rounded-md transition-shadow hover:shadow-[0px_0px_5px_var(--respect-purple-light)]"
          >
            <p className="hidden sm:block">Добавить нескольких</p>
            <MdGroupAdd className="sm:hidden" />
            <FaRegPlusSquare className="hidden sm:block" />
          </button>
        </div>

        {sortedStudents.map((student, index) => (
          <div
            key={index}
            className={`${
              isOpen ? "scale-y-100" : "scale-y-0"
            } ${
              editingId === student.id ? 'z-10' : 'z-0'
            }
            transition-transform flex flex-col md:flex-row items-center gap-3 md:gap-5 p-3 md:p-5 bg-[--respect-purple] rounded-md text-xl`}
          >
            {editingId === student.id ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full md:w-5/12 order-2 md:order-1 py-2 h-9 sm:py-0 bg-[--respect-purple-add-inputs] rounded-md px-2 outline-none"
              />
            ) : (
              <p className="w-full md:w-5/12 order-2 md:order-1 text-center md:text-left">
                {student.name}
              </p>
            )}
            {editingId === student.id ? <div className="w-full md:w-1/6 z-10 order-1 md:order-2 relative cursor-pointer selection:bg-transparent flex flex-row justify-end items-center px-3 py-1 rounded-b-md rounded-t-md gap-3 bg-[--respect-purple-add-inputs]" onClick={e => {
                const dropdown = e.currentTarget;
                dropdown.classList.toggle('rounded-t-md');
    
                setDropdown(dropdown.querySelector("div")!.classList.contains("hidden"));
                dropdown.querySelector('div')!.classList.contains('hidden')?
                dropdown.querySelector('div')!.classList.replace('hidden', 'flex'):
                dropdown.querySelector('div')!.classList.replace('flex', 'hidden');
              }}>
                <div className="hidden z-20 flex-col absolute left-0 bottom-full w-full max-h-64 overflow-y-scroll overflow-x-hidden rounded-t-md border-[6px] border-b-0 border-[--respect-purple-add-inputs] bg-[--respect-purple]">
                    {groups.map((el, i) => 
                        <button type="button" className="px-3 py-2 text-left hover:backdrop-brightness-110 last:rounded-b-sm" key={i} onClick={_ => {
                          setStudentGroup(el);
                        }}>{el.name}</button>
                    )}
                </div>
                <p className="flex mr-auto">{studentGroup!.name}</p>
                {dropdown ? <FaAngleDown /> : <FaAngleUp />}
              </div> : <p className="w-full md:w-1/6 order-1 md:order-2 -mb-2 md:mb-0 text-sm md:text-xl text-center md:text-left">
              {student.groups.name}
            </p>}
            <p className="w-full md:w-1/6 order-3 py-3 md:py-0 md:mr-auto text-center md:text-left">
              {student.reputation}
            </p>
            <div className="order-4 w-full md:w-fit flex flex-row justify-self-end gap-3 sm:gap-5">
              {editingId === student.id ? (
                ((student.name === newName) && (student.groups.name === studentGroup!.name)) ? (
                  <button
                    onClick={() => setEditingId(null)}
                    className="w-full md:w-fit p-3 rounded-md bg-amber-600 hover:bg-amber-500"
                  >
                    <TbCancel className="mx-auto text-xl" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSave(student.id, studentGroup!)}
                    className="w-full md:w-fit p-3 rounded-md bg-green-500 hover:bg-green-600"
                  >
                    <FaSave className="mx-auto" />
                  </button>
                )
              ) : (
                <button
                  onClick={() => handleEdit(student.id, student.name, student.groups)}
                  className="w-full md:w-fit p-3 rounded-md bg-amber-600 hover:bg-amber-500"
                >
                  <FaEdit className="mx-auto" />
                </button>
              )}
              <button
                onClick={() => HandleDelete(student.id)}
                className="w-full md:w-fit p-3 rounded-md bg-red-500 hover:bg-rose-600"
              >
                <FaTrashAlt className="mx-auto" />
              </button>
            </div>
          </div>
        ))}
        <StudentPopup
          isOpen={isStudentPopup}
          onClose={() => setIsStudentPopup(false)}
        />
        <SingleStudentPopup
          isOpen={isSingleStudentPopup}
          onClose={() => setIsSingleStudentPopup(false)}
        />
      </div>
    </>
  );
};

export default EditStudents;
