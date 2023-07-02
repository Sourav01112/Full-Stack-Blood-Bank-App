import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loaders",
  initialState: {
    isLoading: false,
  },
  reducers: {
    SetLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { SetLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
