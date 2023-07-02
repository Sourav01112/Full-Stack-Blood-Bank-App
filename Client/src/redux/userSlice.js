import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    currentUser: null,
    isLoading: false
  },
  reducers: {
    // here, 1st letter will be in capital
    SetCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
  },
});

// Mandatory to export both
export const { SetCurrentUser } = userSlice.actions;
export default userSlice.reducer;
