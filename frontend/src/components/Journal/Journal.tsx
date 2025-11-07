import { Link } from "react-router-dom";
import Group from "../Group/group";
import { BiBell } from "react-icons/bi";

interface useUserStoreInterface {
  auth: boolean,
  name: string,
  email: string,
  avatar: string
}

interface JournalInterface {
    useUserStore: useUserStoreInterface
}

const Journal = ({ useUserStore }: JournalInterface) => {
  return (
      <div className="flex flex-col sm:flex-row gap-5 justify-between mb-6 sm:mb-12">
      <Group />
     <div className="flex order-1 gap-3">
      <Link className="flex flex-row order-1 sm:order-2 justify-center items-center px-3 py-2 rounded-lg gap-4 bg-[--respect-purple-deep]"
        to="/profile">
        <p className="flex w-fit whitespace-nowrap overflow-hidden">
          {useUserStore.name ? useUserStore.name : "- Фамилия И.О. -"}
        </p>
        <img
          className="w-11 h-11 rounded-[100%]"
          src={
            useUserStore.avatar
              ? `${import.meta.env.VITE_API_URL}/${useUserStore.avatar}`
              : `${import.meta.env.VITE_API_URL}/uploads/avatars/default.jpg`
          }
        />
      </Link> 
      <Link to='/debt' className=" flex gap-2 border-1 items-center bg-[--respect-purple-deep] px-3 rounded-lg py-[10px]">
          <BiBell className="text-2xl"></BiBell>
      </Link>
     </div>
      
    </div>
  )
}

export default Journal;