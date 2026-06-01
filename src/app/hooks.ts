import { configureStore } from '@reduxjs/toolkit';
// Импортируй свои будущие редьюсеры (например, authReducer) здесь
// import authReducer from '@/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    // auth: authReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;