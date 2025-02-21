import { useEffect, useState } from "react";
import { useAppContext } from "../../store/AppContext";

const SortByTop = () => {
    const {setSortedStudents, currentGroup, students, search, currentSortMethod, sortDirection} = useAppContext();
    const [sortTop, setSortTop] = useState(0);

    useEffect(() => {
        let result = [...students];

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
        
            setSortedStudents(result.slice(0, sortTop));
        } else {
            switch (currentSortMethod) {
                case "По фамилии": {
                  result.sort((a, b) => {
                    const compareResult = a.name.localeCompare(b.name, "ru");
                    return sortDirection ? compareResult : -compareResult;
                  });
                  break;
                }
                case "По группе": {
                  result.sort((a, b) => {
                    const compareResult = a.groups.name.localeCompare(
                      b.groups.name,
                      "ru",
                      { numeric: true }
                    );
                    return sortDirection ? compareResult : -compareResult;
                  });
                  break;
                }
                case "По рейтингу": {
                  result.sort((a, b) => {
                    const compareResult = a.reputation - b.reputation;
                    return sortDirection ? compareResult : -compareResult;
                  });
                  break;
                }
                default:
                    break;
            }
            setSortedStudents(result);
        }
      }, [sortTop, search, students, currentGroup, currentSortMethod, sortDirection]);
    return (
        <div className="flex flex-row items-center gap-2 bg-[--respect-purple-deep] rounded-md pl-3 pr-2">
            <p className="whitespace-nowrap">Топ - </p>
            <input type="text" className="w-9 pl-2 bg-[--respect-purple-dark] rounded-md outline-hidden" placeholder="...." onChange={(e) => {
              if (isNaN(+e.target.value)) {
                e.target.value = e.target.value.slice(0, e.target.value.length - 2);
                return;
              }
              setSortTop((Number(e.target.value)));
            }} />
        </div>
    )
}

export default SortByTop;