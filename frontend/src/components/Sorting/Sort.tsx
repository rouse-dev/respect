import { useEffect } from "react";
import SortByParams from "./SortByParams";
import SortBySearch from "./SortBySearch";
import SortByTop from "./SortByTop";
import useStudentStore from "../../store/studentStore";
import useFilterStore from "../../store/filterStore";
import useGroupStore from "../../store/groupStore";

const Sort = () => {
  const { students, setSortedStudents } = useStudentStore();
  const { currentGroup } = useGroupStore();
  const { search, sortDirection, currentSortMethod, sortTop } = useFilterStore();

  useEffect(() => {
      let result = structuredClone(students);
  
      switch (currentSortMethod) {
        case "По фамилии": {
          result.sort((a, b) => a.name.split(' ')[0].localeCompare(b.name.split(' ')[0], "ru"));
          break;
        }
        case "По группе": {
          result.sort((a, b) =>
            a.groups.name.localeCompare(b.groups.name, "ru", { numeric: true })
          );
          break;
        }
        case "По рейтингу": {
          result.sort((a, b) => a.reputation - b.reputation);
          break;
        }
      }
  
      if (currentGroup) {
        result = result.filter((el) => el.groups.name === currentGroup.name);
      }
  
      if (search.length > 0) {
        result = result.filter((el) =>
          el.name.toLowerCase().includes(search.toLowerCase())
        );
      }
  
      if (sortTop > 0) {
        result.sort((a, b) => b.reputation - a.reputation);
        result = result.slice(0, sortTop);
      }

      setSortedStudents(sortDirection ? result : result.reverse());

      console.log(sortTop, search, currentGroup, currentSortMethod, sortDirection)
    }, [ sortTop, search, students, currentGroup, currentSortMethod, sortDirection ]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-5 justify-between">
        <SortByParams />
        <div className="flex flex-row gap-5">
          <SortByTop />
          <SortBySearch />
        </div>
      </div>
    </>
  );
};

export default Sort;
