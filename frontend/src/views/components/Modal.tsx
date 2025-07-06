import ReactDOM from "react-dom";
import { useAppSelector } from "../../store/hooks";
import NewGameModal from "./modals/NewGameModal";

const modalRoot = document.getElementById("modal-root");

const getModalType = (
  modalType: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalProps: Record<string, any> | null
) => {
  switch (modalType) {
    case "NEW_GAME":
      return <NewGameModal {...modalProps} />;
    default:
      return null;
  }
};

const Modal = () => {
  const { isOpen, modalType, modalProps } = useAppSelector(
    (state) => state.modal
  );

  if (!isOpen || !modalRoot) return null;

  const content = (
    <div className="w-[100vw] h-[100vh] fixed top-0 left-0 z-50 flex justify-center items-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {getModalType(modalType, modalProps)}
    </div>
  );

  return ReactDOM.createPortal(content, modalRoot);
};

export default Modal;
