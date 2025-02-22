import { Link } from "react-router-dom";

interface useUserStoreInterface {
    auth: boolean,
    name: string,
    email: string,
    avatar: string
  }
  
  interface LinkInterface {
      useUserStore: useUserStoreInterface,
      className?: string
  }

const ProfileLink = ({useUserStore, className}:LinkInterface) => {
  return(
    <Link className={"flex flex-row justify-center items-center px-3 py-2 rounded-lg gap-4 bg-[--respect-purple-deep] " + className || ''}
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
  );
};
export default ProfileLink
