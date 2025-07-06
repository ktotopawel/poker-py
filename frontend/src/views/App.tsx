import TopBar from "./components/TopBar/TopBar";
import Modal from "./components/Modal";
import Game from "./Game/Game";

function App() {
  return (
    <>
      <div className="h-[100vh] w-[100vw] bg-background flex flex-col">
        <TopBar />
        <div className="flex-1">
          <Game />
        </div>
      </div>
      <Modal />
    </>
  );
}

export default App;
