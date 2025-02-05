import { ClipLoader } from "react-spinners";

const Preloader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg flex flex-col items-center">
        <ClipLoader color="#3687e6" size={50} />
        <p className="mt-4 text-gray-700 font-medium">Загрузка...</p>
      </div>
    </div>
  );
};

export default Preloader;
