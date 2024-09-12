import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface responseType {
  token: string | null;
  data: {
    userName: string;
    email: string;
    id: number;
  } | null;
}

// let user = null;
// let token = null;
//localStorage server side pr exist nhi krta h islye agar ham direct localStorge ka use krte h to server side pr error dega to ham condition laga skte h ki agar window ka type undefined nhi h jo ki browser(client) side pr hi possible h tabhi localstorage run hoga.
// if(typeof window !== 'undefined'){
//     const isUser = localStorage.getItem('user');
//     const user = isUser ? JSON.parse(isUser) : null

//     const istoken = localStorage.getItem('access_token');
//     const token = istoken ? JSON.parse(istoken) : null
// }

// const isUser = localStorage.getItem("user");
// const user = isUser ? JSON.parse(isUser) : null;

// const istoken = localStorage.getItem("access_token");
// const token = istoken ? JSON.parse(istoken) : null;

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
