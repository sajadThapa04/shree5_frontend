import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {
  loginUser,
  logOutUser,
  verifyEmail,
  refreshAccessToken,
  resendVerificationEmail,
  fetchUserProfile
} from "../../services/users.api";

//logging users
export const loginUsers = createAsyncThunk("users/login", async (userData, {rejectWithValue}) => {
  try {
    const response = await loginUser(userData);

    // Validate response structure
    if (
      !response
      ?.user || !response
        ?.accessToken) {
      throw new Error("Invalid login response from server");
    }

    return {user: response.user, accessToken: response.accessToken, refreshToken: response.refreshToken};
  } catch (error) {
    // Return consistent error structure
    return rejectWithValue({
      message: error.message,
      status: error.response
        ?.status || 500
    });
  }
});

//logout users
export const logoutUsers = createAsyncThunk("users/logout", async (_, {rejectWithValue}) => {
  try {
    const response = await logOutUser(); // Using the API function we created earlier
    return response;
  } catch (error) {
    return rejectWithValue({
      message: error.message || "Logout failed",
      status: error.response
        ?.status || 500
    });
  }
});

//verifyUserEmail
export const verifyUserEmail = createAsyncThunk("users/verifyEmail", async (token, {rejectWithValue}) => {
  try {
    const response = await verifyEmail(token);

    if (
      !response
      ?.success) {
      throw new Error(
        response
        ?.message || "Email verification failed");
    }

    return response;
  } catch (error) {
    return rejectWithValue({
      message: error.message || "Email verification failed",
      status: error.response
        ?.status || 500
    });
  }
});

// resendVerification
export const resendVerification = createAsyncThunk("user/resendVerification", async (email, {rejectWithValue}) => {
  try {
    const response = await resendVerificationEmail("/resend-verification", {email});

    if (
      !response
      ?.data
        ?.success) {
      throw new Error(
        response
        ?.data
          ?.message || "Failed to resend verification email");
    }

    return response.data;
  } catch (error) {
    return rejectWithValue({
      message: error.response
        ?.data
          ?.message || error.message || "Failed to resend verification email",
      status: error.response
        ?.status || 500
    });
  }
});

// refreshuserToken
export const refreshUserToken = createAsyncThunk("users/refreshToken", async (refreshToken, {rejectWithValue}) => {
  try {
    const response = await refreshAccessToken(refreshToken);

    if (
      !response
      ?.success || !response
        ?.data
          ?.accessToken) {
      throw new Error(
        response
        ?.message || "Token refresh failed");
    }

    return {accessToken: response.data.accessToken, refreshToken: response.data.refreshToken, message: response.message};
  } catch (error) {
    return rejectWithValue({
      message: error.message || "Token refresh failed",
      status: error.response
        ?.status || 500
    });
  }
});

//fetch current users
export const fetchUser = createAsyncThunk("users/fetchProfile", async (_, {rejectWithValue}) => {
  try {
    const response = await fetchUserProfile();

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch user profile");
    }

    return {user: response.data, isEmailVerified: response.data.isEmailVerified, isPhoneVerified: response.data.isPhoneVerified};
  } catch (error) {
    return rejectWithValue({
      message: error.response
        ?.data
          ?.message || error.message || "Failed to fetch user profile",
      status: error.response
        ?.status || 500
    });
  }
});

const loadInitialState = () => {
  // Helper function to safely parse localStorage items
  const safeParse = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item
        ? JSON.parse(item)
        : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  // Check if tokens exist and are valid (you might want to add more validation)
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const hasValidTokens = accessToken && refreshToken;

  return {
    userInfo: safeParse("userInfo", null),
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    verificationToken: localStorage.getItem("verificationToken") || null,
    loading: false,
    error: null,
    // isAuthenticated: !!localStorage.getItem("accessToken"),
    isAuthenticated: hasValidTokens, // Only true if both tokens exist
    isEmailVerified: safeParse("isEmailVerified", false),
    isPhoneVerified: safeParse("isPhoneVerified", false),
    verificationSent: false,
    isRefreshingToken: false
  };
};

const initialState = loadInitialState();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearState: state => {
      Object.assign(state, {
        userInfo: null,
        accessToken: null,
        refreshToken: null,
        verificationToken: null,
        isAuthenticated: false,
        isEmailVerified: false,
        isPhoneVerified: false,
        verificationSent: false,
        error: null
      });
    },
    setAuthTokens: (state, {payload}) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.isAuthenticated = true;
    },
    markEmailVerified: state => {
      state.isEmailVerified = true;
      state.verificationToken = null;
    },
    markPhoneVerified: state => {
      state.isPhoneVerified = true;
    },
    clearError: state => {
      state.error = null;
    },
    updateProfileImage: (state, action) => {
      if (state.userInfo) {
        state.userInfo.profileImage = action.payload.profileImage;
        localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      }
    },
    updateUserAddress: (state, action) => {
      if (state.userInfo) {
        state.userInfo.address = action.payload;
        localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      }
    },
    updateHostProfile: (state, action) => {
      if (state.userInfo) {
        state.userInfo.role = "host";
        state.userInfo.hostProfile = action.payload.hostProfileId;
        localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      }
    }
  },
  extraReducers: builder => {
    builder
    //login cases
      .addCase(loginUsers.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(loginUsers.fulfilled, (state, {payload}) => {
      localStorage.setItem("userInfo", JSON.stringify(payload.user));
      localStorage.setItem("accessToken", payload.accessToken);
      localStorage.setItem("refreshToken", payload.refreshToken);
      localStorage.setItem("isEmailVerified", payload.user.isEmailVerified);
      localStorage.setItem("isPhoneVerified", payload.user.isPhoneVerified);

      state.loading = false;
      state.userInfo = payload.user;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.isAuthenticated = true;
      state.isEmailVerified = payload.user.isEmailVerified;
      state.isPhoneVerified = payload.user.isPhoneVerified;
    }).addCase(loginUsers.rejected, (state, {payload}) => {
      state.loading = false;
      state.error = payload;
    })

    //logout case
      .addCase(logoutUsers.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(logoutUsers.fulfilled, state => {
      // Reset to initial state on successful logouts
      localStorage.clear();
      Object.assign(state, {
        userInfo: null,
        accessToken: null,
        refreshToken: null,
        verificationToken: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        isEmailVerified: false,
        isPhoneVerified: false,
        verificationSent: false
      });
    }).addCase(logoutUsers.rejected, (state, {payload}) => {
      state.loading = false;
      state.error = payload;
    })

    // Email verification cases
      .addCase(verifyUserEmail.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(verifyUserEmail.fulfilled, state => {
      state.loading = false;
      state.isEmailVerified = true;
      state.verificationToken = null;
    }).addCase(verifyUserEmail.rejected, (state, {payload}) => {
      state.loading = false;
      state.error = payload;
    })

    // Token refresh cases
      .addCase(refreshUserToken.pending, state => {
      state.isRefreshingToken = true;
      state.error = null;
    }).addCase(refreshUserToken.fulfilled, (state, {payload}) => {
      state.isRefreshingToken = false;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.isAuthenticated = true;
    }).addCase(refreshUserToken.rejected, (state, {payload}) => {
      state.isRefreshingToken = false;
      state.error = payload;
      // Optional: clear tokens if refresh fails
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    })

    // Fetch user cases
      .addCase(fetchUser.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(fetchUser.fulfilled, (state, {payload}) => {
      state.loading = false;
      state.userInfo = payload.user;
      state.isEmailVerified = payload.isEmailVerified;
      state.isPhoneVerified = payload.isPhoneVerified;
      // Update localStorage if needed
      localStorage.setItem("userInfo", JSON.stringify(payload.user));
      localStorage.setItem("isEmailVerified", payload.isEmailVerified);
      localStorage.setItem("isPhoneVerified", payload.isPhoneVerified);
    }).addCase(fetchUser.rejected, (state, {payload}) => {
      state.loading = false;
      state.error = payload;
    });
  }
});

// Export actions
export const {
  clearState,
  setAuthTokens,
  markEmailVerified,
  markPhoneVerified,
  clearError,
  updateProfileImage
} = userSlice.actions;

export default userSlice.reducer;
