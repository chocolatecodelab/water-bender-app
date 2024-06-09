import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { thunk } from 'redux-thunk';
import { persistStore } from 'redux-persist';
import HomeSlice from './features/home/homeSlice';
import RegisterSlice from './features/register/registerSlice';
import AuthSlice from './features/login/loginSlice';

const reducers = combineReducers({
    auth: AuthSlice,
    register: RegisterSlice,
    home: HomeSlice,
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [
        'home',
        'auth',
        'register',
    ],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export const persistor = persistStore(store);
