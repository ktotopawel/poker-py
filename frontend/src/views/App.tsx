import TopBar from './components/TopBar/TopBar';
import Modal from './components/Modal';
import Game from './Game/Game';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import AppRoutes from '../utils/appRoutes.ts';

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="h-[100vh] w-[100vw] bg-background flex flex-col">
          <TopBar />
          <Routes>
            <Route path={AppRoutes.HOME} element={<HomePage />} />
            <Route path={AppRoutes.GAME} element={<Game />} />
          </Routes>
        </div>
        <Modal />
      </BrowserRouter>
    </>
  );
}

export default App;
