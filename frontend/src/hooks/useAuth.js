import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { useState, useEffect, useCallback } from "react";
import { getUserProfile } from "../services/api";

export const useAuth = () => {
  const { isLoaded, userId, getToken, signOut } = useClerkAuth();
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    if (!userId || !isLoaded) return;

    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const profile = await getUserProfile(token);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId, isLoaded, getToken]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const refreshProfile = useCallback(() => {
    return fetchUserProfile();
  }, [fetchUserProfile]);

  const logout = useCallback(async () => {
    try {
      await signOut();
      setUserProfile(null);
      setError(null);
    } catch (error) {
      console.error("Error signing out:", error);
      setError(error.message);
    }
  }, [signOut]);

  return {
    // Clerk auth state
    isLoaded,
    userId,
    user,
    getToken,
    signOut: logout,
    
    // User profile state
    userProfile,
    loading,
    error,
    
    // Actions
    refreshProfile,
    clearError: () => setError(null),
  };
};
