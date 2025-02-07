import {FadeLoader } from "react-spinners";

const Preloader = () => {
  return (
    <div className="fixed shadow-2xl top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
        <FadeLoader color="#ffffff" width={5} />
    </div>
  );
};

export default Preloader;
