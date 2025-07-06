import ReactDOM from "react-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import NewGameModal from "./modals/NewGameModal";
import { close, type ModalState } from "../../store/slices/modal.slice";
import type { ThunkDispatch, UnknownAction, Dispatch } from "@reduxjs/toolkit";
import type { GameState } from "../../store/slices/gameState.slice";

const modalRoot = document.getElementById("modal-root");

const getModalType = (
  modalType: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalProps: Record<string, any> | null,
  dispatch: ThunkDispatch<
    { game: GameState; modal: ModalState },
    undefined,
    UnknownAction
  > &
    Dispatch<UnknownAction>
) => {
  switch (modalType) {
    case "NEW_GAME":
      return (
        <NewGameModal
          {...modalProps}
          onClose={() => {
            dispatch(close());
          }}
        />
      );
    default:
      return null;
  }
};

const Modal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, modalType, modalProps } = useAppSelector(
    (state) => state.modal
  );

  if (!isOpen || !modalRoot) return null;

  const content = getModalType(modalType, modalProps, dispatch);

  return ReactDOM.createPortal(content, modalRoot);
};

export default Modal;
