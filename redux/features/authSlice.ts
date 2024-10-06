import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface responseType {
  token: string | null;
  data: {
    userName: string;
    email: string;
    id: number;
  } | null;
}

const initialState: responseType = {
  data: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<responseType>) => {
      const { data, token } = action.payload;
      state.data = data;
      state.token = token;

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("access_token", JSON.stringify(token));
    },

    removeUserInfo: (state) => {
      (state.data = null), (state.token = null);

      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
    },

    hydrateUserInfoFromLocalStorage: (state) => {
      if (typeof window !== "undefined") {
        const isUser = localStorage.getItem('user');
        const istoken = localStorage.getItem('access_token')
        state.data = isUser ? JSON.parse(isUser) : null
        state.token = istoken ? JSON.parse(istoken) : null
      }
    },
  },
});

export const { setUserInfo, removeUserInfo, hydrateUserInfoFromLocalStorage } =
  authSlice.actions;
export default authSlice.reducer;
