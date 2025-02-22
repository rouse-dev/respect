import { useState } from "react";
import { CreateGroup, GetAllGroups } from "../../../../service/server";
import { useAppContext } from "../../../../store/AppContext";
import Preloader from "../../preloader/preloader";
import { toast } from "react-toastify";

interface AddGroupPopup {
  onClose: () => void;
  isOpen: boolean;
}

const GroupPopup = ({ onClose, isOpen }: AddGroupPopup) => {
  if (!isOpen) return null;

  const { setGroups } = useAppContext();
  const [isLoading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await CreateGroup(groupName);
      if (response.succes && response.data) {
        const groupsResponse = await GetAllGroups();
        if (groupsResponse.succes && groupsResponse.data) {
          setGroups(groupsResponse.data);
          
          toast.success('Группа добавлена')
          onClose();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-[100vh] fixed top-0 left-0 z-50 backdrop-blur">
      {isLoading ? (
        <Preloader/>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-[300px] h-[180px] bg-[--respect-purple-deep] flex flex-col items-center justify-center p-5 rounded-lg gap-3"
        >
          <input
            className="sm:max-w-xs w-full bg-[--respect-purple-add-inputs] rounded-lg py-2 pl-3 outline-hidden"
            placeholder="Имя группы"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="h-[40px] bg-[--respect-purple-dark] w-full flex items-center justify-center rounded-lg cursor-pointer"
          >
            Добавить
          </button>
          <button 
            type="reset"
            onClick={onClose}
            className="h-[40px] bg-[--respect-purple-dark] w-full flex items-center justify-center rounded-lg cursor-pointer"
          >
            Отмена
          </button>
        </form>
      )}
    </div>
  );
};

export default GroupPopup;
