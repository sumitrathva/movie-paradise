import { createSlice } from "@reduxjs/toolkit";
import { themeModes } from "../../configs/theme.configs";

// Load the saved theme from localStorage, default to "light" if not found
const savedTheme = localStorage.getItem("themeMode") || themeModes.light;

export const themeModeSlice = createSlice({
  name: "themeMode",
  initialState: {
    themeMode: savedTheme
  },
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
      localStorage.setItem("themeMode", action.payload); // Save to localStorage
    }
  }
});

export const { setThemeMode } = themeModeSlice.actions;
export default themeModeSlice.reducer;
