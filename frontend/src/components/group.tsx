import { useAppContext } from "../context/AppContext";

const Group = () => {
  const { currentGroup, setCurrentGroup, groups } = useAppContext();

  return (
    <div
      className="relative cursor-pointer selection:bg-transparent flex flex-row order-2 sm:order-1 justify-end items-center px-5 py-2 rounded-t-lg rounded-b-lg gap-5 bg-[--respect-purple-deep]"
      onClick={(e) => {
        const dropdown = e.currentTarget;
        dropdown.classList.toggle("rounded-b-lg");

        dropdown.querySelector("div")!.classList.contains("hidden")
          ? dropdown.querySelector("div")!.classList.replace("hidden", "flex")
          : dropdown.querySelector("div")!.classList.replace("flex", "hidden");

        dropdown.querySelector("i")!.classList.contains("fa-angle-down")
          ? dropdown
              .querySelector("i")!
              .classList.replace("fa-angle-down", "fa-angle-up")
          : dropdown
              .querySelector("i")!
              .classList.replace("fa-angle-up", "fa-angle-down");
      }}
    >
      <p className="flex mr-auto">{currentGroup}</p>
      <p className="hidden sm:block">|</p>
      <i className="fa fa-angle-up" aria-hidden="true"></i>

      <div className="hidden z-20 flex-col absolute left-0 top-full w-full max-h-64 overflow-y-scroll overflow-x-hidden rounded-b-lg border-[6px] border-t-0 border-[--respect-purple-deep] bg-[--respect-purple]">
        {groups.map((el, i) => (
          <button
            className="py-2 hover:backdrop-brightness-110 last:rounded-b-sm"
            key={i}
            onClick={(_) => {
              setCurrentGroup(el);
            }}
          >
            {el}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Group;
