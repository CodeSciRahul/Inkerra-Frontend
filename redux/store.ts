// Store Creation (Per Request):
// Instead of globally creating a Redux store, har request ke liye ek makeStore function banaya jata hai jo naya store return karega:

import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./features/authSlice"

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authSlice 
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>

export type AppDispatch = AppStore['dispatch']