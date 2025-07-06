interface INewGameModal {
  onClose: () => void;
}

const NewGameModal = ({ onClose }: INewGameModal) => {
  return (
    <>
      <button onClick={onClose}></button>
    </>
  );
};

export default NewGameModal;
