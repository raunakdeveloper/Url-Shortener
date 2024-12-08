import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { googleSignIn, getUserProfile } from "../utils/api";
import { setToken, removeToken } from "../utils/localStorage";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await googleSignIn(idToken);

          // If the user data is not present in the API response
          if (!response?.user) {
            console.error("User data missing in API response. Logging out...");
            await handleLogout(); // logout
            return;
          }

          setUser(response.user);
          setToken(response.token);

          // Fetch user profile
          const profileData = await getUserProfile();
          setUser((prevUser) => ({ ...prevUser, ...profileData }));
        } catch (error) {
          console.error("Error during authentication:", error);
          await handleLogout();
        }
      } else {
        setUser(null);
        removeToken();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      removeToken();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const logout = handleLogout;

  const value = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
