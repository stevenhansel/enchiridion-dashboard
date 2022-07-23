import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Permissions {
    id: number;
    name: string;
}

export interface Role {
    id: number;
    name: string;
    permissions: Permissions[];
}

export interface UserStatus {
  value: string;
  label: string;
}

export interface ProfileState {
  id: number;
  name: string;
  email: string;
  profilePicture: string | null;
  role: Role; 
  userStatus: UserStatus;
}

const initialState = null;

const profileSlice = createSlice({
  name: 'profile',
  initialState: initialState as ProfileState | null,
  reducers: {
    setProfile(state: ProfileState | null, action: PayloadAction<ProfileState>) {
      console.log('payload', action.payload);
      return { 
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        profilePicture: action.payload.profilePicture,
        role: action.payload.role,
        userStatus: action.payload.userStatus
      };
    },
    resetProfile() {
      return null;
    },
  },
});

export const { setProfile, resetProfile } = profileSlice.actions;

export default profileSlice.reducer;
