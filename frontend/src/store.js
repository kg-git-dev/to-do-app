// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { applyMiddleware } from "redux";
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from "@redux-devtools/extension";

import taskReducer from "./reducers/index.js";

const store = configureStore({
    reducer: {
        tasks: taskReducer,
    }
},
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;