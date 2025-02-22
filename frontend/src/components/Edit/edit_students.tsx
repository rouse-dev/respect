import {
  FaEdit,
  FaRegPlusSquare,
  FaTrashAlt,
  FaUserPlus,
} from "react-icons/fa";
import { Student, useAppContext } from "../../store/AppContext";
import { useEffect, useState } from "react";
import { MdGroupAdd } from "react-icons/md";
import StudentPopup from "../common/popups/addPopups/add_students";
import SingleStudentPopup from "../common/popups/addPopups/add_single_student";
import { GetAllStudents } from "../../service/server";
import Preloader from "../common/preloader/preloader";

interface EditStudentsInterface {
  isOpen: boolean;
}

const EditStudents = ({ isOpen }: EditStudentsInterface) => {
  const { students, setPopupActive,setStudents } = useAppContext();
  const [search, setSearch] = useState("");
  const [isStudentPopup, setIsStudentPopup] = useState(false);
  const [isSingleStudentPopup, setIsSingleStudentPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortedStudents, setSortedStudents] = useState<Student[]>([...students])
 
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
   }, [search]);


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
            setIsSingleStudentPopup(true);
            setPopupActive(true);
          }}
          className="flex flex-row justify-center items-center w-full gap-3 p-3 bg-[--respect-purple-dark] rounded-md transition-shadow hover:shadow-[0px_0px_5px_var(--respect-purple-light)]"
        >
          <p className="hidden sm:block">Добавить одного</p>
          <FaUserPlus className="sm:hidden" />
          <FaRegPlusSquare className="hidden sm:block" />
        </button>
        <button
          onClick={() => {
            setIsStudentPopup(true);
            setPopupActive(true);
          }}
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
          } transition-transform flex flex-col md:flex-row items-center gap-3 md:gap-5 p-3 md:p-5 bg-[--respect-purple] rounded-md text-xl`}
        >
          <p className="w-full md:w-5/12 order-2 md:order-1 text-center md:text-left">
            {student.name}
          </p>
          <p className="w-full md:w-1/6 order-1 md:order-2 -mb-2 md:mb-0 text-sm md:text-xl text-center md:text-left">
            {student.groups.name}
          </p>
          <p className="w-full md:w-1/6 order-3 py-3 md:py-0 md:mr-auto text-center md:text-left">
            {student.reputation}
          </p>
          <div className="order-4 w-full md:w-fit flex flex-row justify-self-end gap-3 sm:gap-5">
            <button className="w-full md:w-fit p-3 rounded-md bg-amber-600 hover:bg-amber-500">
              <FaEdit className="mx-auto" />
            </button>
            <button className="w-full md:w-fit p-3 rounded-md bg-red-500 hover:bg-rose-600">
              <FaTrashAlt className="mx-auto" />
            </button>
          </div>
        </div>
      ))}
      <StudentPopup
        isOpen={isStudentPopup}
        onClose={() => {
          setIsStudentPopup(false);
          setPopupActive(false);
        }}
      />
      <SingleStudentPopup
        isOpen={isSingleStudentPopup}
        onClose={() => {
          setIsSingleStudentPopup(false);
          setPopupActive(false);
        }}
      />
    </div>
    </>
  
  );
};

export default EditStudents;
