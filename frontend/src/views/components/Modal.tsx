import ReactDOM from 'react-dom';
import { useAppSelector } from '../../store/hooks';
import CustomGameModal from './modals/CustomGameModal.tsx';

const modalRoot = document.getElementById('modal-root');

const getModalType = (
  modalType: ModalEnum | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalProps: Record<string, any> | null
) => {
  switch (modalType) {
    case ModalTypes.CUSTOM_GAME:
      return <CustomGameModal {...modalProps} />;
    default:
      return null;
  }
};

const ModalTypes = {
  CUSTOM_GAME: 'CustomGame',
} as const;

const Modal = () => {
  const { isOpen, modalType, modalProps } = useAppSelector((state) => state.modal);

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
export { ModalTypes };
export type ModalEnum = (typeof ModalTypes)[keyof typeof ModalTypes];
