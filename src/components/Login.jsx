import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGoogle,
  FaApple,
  FaEnvelope,
  FaLock,
  FaSignOutAlt,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import {
  signInWithGoogle,
  signInWithApple,
  signInWithEmailPassword,
} from "../../config/firebase";
import { signOut } from "firebase/auth";
import Skeleton from "./Skeletons/Skeleton";
import { useAuth } from "../../contexts/AuthContext"; // Import AuthContext
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";

const Login = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth(); // Use AuthContext for user and logout
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for page transition
  const [error, setError] = useState(null); // Error state for login errors
  const [showSuccess, setShowSuccess] = useState(false);

  // Simulate page loading (you can replace this with your actual load condition)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Function to check if the user exists in Firestore
  const checkUserDetails = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // User document exists, proceed to community options
        navigate("/events");
      } else {
        // User document does not exist, but we no longer need to set a username
        navigate("/events");
      }
    } catch (error) {
      console.error("Error checking user details:", error);
      setError("Failed to fetch user details.");
    }
  };

  // This effect will run when the user context updates.
  useEffect(() => {
    if (user) {
      checkUserDetails(user.uid);
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setError(null); // Clear any previous errors
      await signInWithGoogle();
      setShowSuccess(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser); // Update user in AuthContext
        await checkUserDetails(currentUser.uid);
      }
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again.");
    }
  };

  const handleAppleLogin = async () => {
    try {
      setError(null); // Clear any previous errors
      await signInWithApple();
      setShowSuccess(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser); // Update user in AuthContext
        await checkUserDetails(currentUser.uid);
      }
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Apple login error:", error);
      setError("Apple login failed. Please try again.");
    }
  };

  const handleEmailPasswordLogin = async () => {
    try {
      setError(null); // Clear any previous errors
      await signInWithEmailPassword(email, password);
      setShowSuccess(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser); // Update user in AuthContext
        await checkUserDetails(currentUser.uid);
      }
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Email/Password login error:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      logout(); // Call logout from AuthContext
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      setError("Failed to sign out. Please try again.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="relative flex items-center justify-center w-full h-screen bg-gradient-to-br from-gray-900 to-black">
        <Skeleton />
      </div>
    );
  }
  //bg-gradient-to-br from-gray-900 to-black
  return (
    <div className="relative bg-white flex items-center justify-center w-full h-screen ">
      {/* Back Button */}
      <div className="absolute top-4 left-4 flex gap-4">
        <button
          onClick={handleBack}
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
        >
          <FaArrowLeft size={24} />
        </button>
      </div>

      {/* Sign Out Button for Authenticated Users */}
      {user && (
        <div className="absolute top-4 right-4 flex gap-4">
          <button
            onClick={handleSignOut}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
          >
            <FaSignOutAlt size={24} />
          </button>
        </div>
      )}

      {/* Main Login Form */}
      <div className="w-[90%] max-w-[500px] p-8 bg-white rounded-lg border shadow-lg">
        <h2 className="text-3xl font-bold text-[#444141] text-center mb-6">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-center mb-6"> <span className="bg-gradient-to-r from-[#6A0DAD] via-[#6E3995] to-[#9E0DAD]
                    bg-clip-text text-transparent">Sign in</span>  to continue</p>

        {/* Social Login Buttons */}
        <div className="flex items-center mb-4">
          <div className="flex-grow border-t border-gray-500"></div>
          <span className="mx-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-500"></div>
        </div>
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleGoogleLogin}
            className="p-3 rounded-full bg-gradient-to-r from-[#6A0DAD] via-[#6E3995] to-[#9E0DAD] text-white"
          >
            <FaGoogle size={24} />
          </button>
          <button
            onClick={handleAppleLogin}
            className="p-3 rounded-full bg-gradient-to-r from-[#6A0DAD] via-[#6E3995] to-[#9E0DAD] text-white"
          >
            <FaApple size={24} />
          </button>
        </div>

        {/* Email and Password Inputs */}
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9E0DAD]" />
          <input
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-white text-gray-800 border border-[#9E0DAD] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9E0DAD]" />
          <input
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-white text-gray-800 border  border-[#9E0DAD] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-center mb-4 text-gray-400 text-sm">
          <input type="checkbox" id="consent" className="mr-2" />
          <label htmlFor="consent">
            I agree to the{" "}
            <a href="/terms" className="bg-gradient-to-r from-[#6A0DAD] via-[#6E3995] to-[#9E0DAD]
                    bg-clip-text text-transparent">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="/privacy" className="bg-gradient-to-r from-[#6A0DAD] via-[#6E3995] to-[#9E0DAD]
                    bg-clip-text text-transparent">
              Privacy Policy
            </a>
            .
          </label>
        </div>

        {/* Login Button */}
        <button
          onClick={handleEmailPasswordLogin}
          className="w-full py-3 text-white bg-gradient-to-r from-[#6A0DAD] via-[#6E3995] to-[#9E0DAD] hover:bg-purple-500 rounded-lg font-semibold text-lg"
        >
          Sign In
        </button>

        {/* Sign Up Link */}
        <p className="text-gray-400 text-center mt-4">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="bg-gradient-to-r from-[#6A0DAD] via-[#6E3995] to-[#9E0DAD]
                    bg-clip-text text-transparent"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
          >
            Sign up
          </a>
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <FaCheckCircle className="text-green-500" />
          Login successful!
        </div>
      )}

      {/* Error Message (only shows if not displaying success) */}
      {error && !showSuccess && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Login;
