import Logo from "./Logo";

const TopBar = () => {
  return (
    <div className="w-full sticky h-16 bg-felt-green flex justify-center items-center">
      <div className="w-[50%] flex justify-center items-center">
        <Logo />
      </div>
    </div>
  );
};

export default TopBar;
