import Students from "../components/Students/Students";
import Sort from "../components/Sorting/Sort";
import HomeContainer from "../components/Home/HomeContainer";

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-5 text-lg p-3 sm:p-5 text-white">
      <HomeContainer />
      <Sort />
      <Students />
    </div>
  );
};

export default Home;
