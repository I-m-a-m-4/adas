// contexts/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../config/firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser ? authUser : null);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const value = {
    user,
    loading,
    login: (email, password) =>
      auth.signInWithEmailAndPassword(email, password),
    signup: (email, password) =>
      auth.createUserWithEmailAndPassword(email, password),
    logout: () => auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          {/* Responsive container: stacks vertically on mobile, horizontally on medium+ screens */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Animated Spinner (Spinning Circle) */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-30 animate-pulse" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full shadow-lg">
                <div className="w-12 h-12 border-4 border-[#33bbcf] border-t-transparent rounded-full animate-spin" />
              </div>
            </div>

            {/* Animated Text with Shimmer Effect */}
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9E0DAD] to-[#6A0DAD] bg-clip-text text-transparent animate-shimmer">
                ADAS
              </h1>
              <p className="text-sm font-medium text-gray-600">
                Securing Your Digital Experience
              </p>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
