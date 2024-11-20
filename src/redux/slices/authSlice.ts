import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface UserInfo {
	userId: string;
	userType: 'sysadmin' | 'general';
}

// declaring the types for our state
export type AuthState = {
	isAuthenticated: boolean;
	userInfo: UserInfo | null;
};

const initialState: AuthState = {
	isAuthenticated: false,
	userInfo: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setIsAuthenticated: (state: AuthState, action: PayloadAction<boolean>) => {
			state.isAuthenticated = action.payload;
		},
		setUserInfo: (state: AuthState, action: PayloadAction<UserInfo | null>) => {
			state.userInfo = action.payload;
		},
	},
});

// Here we are just exporting the actions from this slice, so that we can call them anywhere in our app.
export const { setIsAuthenticated, setUserInfo } = authSlice.actions;

// calling the above actions would be useless if we could not access the data in the state.
// So, we use something called a selector which allows us to select a value from the state.
export const getIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

// exporting the reducer here, as we need to add this to the store
const authReducer = authSlice.reducer;
export default authReducer;
