import { Link } from "react-router-dom";
import Group from "../Group/group";
import { LiaListSolid } from "react-icons/lia";

interface useUserStoreInterface {
  auth: boolean,
  name: string,
  email: string,
  avatar: string
}

interface HomeInterface {
    useUserStore: useUserStoreInterface
}

const Home = ({ useUserStore }: HomeInterface) => {
  return (
      <div className="flex flex-col sm:flex-row gap-5 justify-between mb-6 sm:mb-12">
      <div className="flex justify-center items-center gap-3 order-2 sm:order-1">
        
        <Group />
        <Link to='/edit' className="order-2 flex gap-2 border-1 items-center bg-[--respect-purple-deep] px-3 rounded-lg py-[10px]"><LiaListSolid className="text-2xl" /></Link>
      </div>
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
    </div>
  )
}

export default Home;