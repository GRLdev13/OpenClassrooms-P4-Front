import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string;
  name: string;
}

const initialState: UserState = {
  email: localStorage?.getItem("email") || "",
  name: localStorage?.getItem("name") || "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ email: string; name: string; }>,
    ) => {
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("name", action.payload.name);

      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    clearUser: (state) => {
      state.email = "";
      state.name = "";
      localStorage.clear();
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
