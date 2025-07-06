import TopBar from "./components/TopBar/TopBar";
import Modal from "./components/Modal";

function App() {
  return (
    <>
      <div className="h-[100vh] w-[100vw] bg-background">
        <TopBar />
      </div>
      <Modal />
    </>
  );
}

export default App;
