import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserRole, UserStatus } from '../types/store';

export type ProfileState = {
  id: number;
  name: string;
  email: string;
  profilePicture: string | null;
  role: UserRole;
  isEmailConfirmed: boolean;
  userStatus: UserStatus;
};

const initialState = null;

const profileSlice = createSlice({
  name: 'profile',
  initialState: initialState as ProfileState | null,
  reducers: {
    setProfile(
      state: ProfileState | null,
      action: PayloadAction<ProfileState>
    ) {
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        profilePicture: action.payload.profilePicture,
        role: action.payload.role,
        isEmailConfirmed: action.payload.isEmailConfirmed,
        userStatus: action.payload.userStatus,
      };
    },
    resetProfile() {
      return null;
    },
  },
});

export const { setProfile, resetProfile } = profileSlice.actions;

export default profileSlice.reducer;
