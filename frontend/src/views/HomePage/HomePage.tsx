import HomePageTile from './HomePageTile';

const HomePage = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex items-stretch justify-center gap-2 ">
        <HomePageTile type="quickGame" />
        <HomePageTile type="customGame" />
      </div>
    </div>
  );
};

export default HomePage;
