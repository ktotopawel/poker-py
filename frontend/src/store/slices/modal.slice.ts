import { createSlice } from '@reduxjs/toolkit';
import { type ModalEnum } from '../../views/components/Modal.tsx';

export interface ModalState {
  isOpen: boolean;
  modalType: ModalEnum | null;
  modalProps: Record<string, string | number> | null;
}

const initialState: ModalState = {
  isOpen: false,
  modalType: null,
  modalProps: null,
};

type ModalPayload = {
  type: ModalEnum;
  props?: Record<string, string | number> | null;
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalOpen: (state, action: { payload: ModalPayload; type: string }) => {
      state.isOpen = true;
      state.modalType = action.payload.type;
      state.modalProps = action.payload.props || null;
    },
    modalClose: (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.modalProps = null;
    },
  },
});

export const { modalOpen, modalClose } = modalSlice.actions;

export default modalSlice.reducer;
