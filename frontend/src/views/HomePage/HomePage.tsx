import HomePageTile from './HomePageTile';

const HomePage = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-radial from-surface to-modal-background">
      <div className={'flex flex-col p-4 z-10 gap-4 md:flex-row md:w-1/2'}>
        <HomePageTile type="quickGame" />
        <HomePageTile type="customGame" />
      </div>
    </div>
  );
};

export default HomePage;
