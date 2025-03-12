import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage (if available)
const storedUser = localStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

export const userSlice = createSlice({
  name: "User",
  initialState: {
    user: parsedUser, // Set user from localStorage
    listFavorites: []
  },
  reducers: {
    setUser: (state, action) => {
      if (action.payload === null) {
        localStorage.removeItem("user");
        localStorage.removeItem("actkn");
      } else {
        localStorage.setItem("user", JSON.stringify(action.payload));
        if (action.payload.token) localStorage.setItem("actkn", action.payload.token);
      }
      state.user = action.payload;
    },
    setListFavorites: (state, action) => {
      state.listFavorites = action.payload;
    },
    removeFavorite: (state, action) => {
      const { mediaId } = action.payload;
      state.listFavorites = state.listFavorites.filter(e => e.mediaId.toString() !== mediaId.toString());
    },
    addFavorite: (state, action) => {
      state.listFavorites = [action.payload, ...state.listFavorites];
    }
  }
});

export const { setUser, setListFavorites, addFavorite, removeFavorite } = userSlice.actions;

export default userSlice.reducer;
