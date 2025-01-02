import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface responseType {
  token: string | null;
  data: {
    id: string;
  userName: string;
  email: string;
  bio?: string;
  name?: string;
  address?: string;
  profile_pic?: string;
  background_pic?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  other?: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
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

      data && localStorage.setItem("user", JSON.stringify(data));
      token && localStorage.setItem("access_token", JSON.stringify(token));
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
