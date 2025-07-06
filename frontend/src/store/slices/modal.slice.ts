import { createSlice } from "@reduxjs/toolkit";

export interface ModalState {
  isOpen: boolean;
  modalType: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalProps: Record<string, any> | null;
}

const initialState: ModalState = {
  isOpen: false,
  modalType: null,
  modalProps: null,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    open: (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload.type;
      state.modalProps = action.payload.props;
    },
    close: (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.modalProps = null;
    },
  },
});

export const { open, close } = modalSlice.actions;

export default modalSlice.reducer;
