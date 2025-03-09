// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  FiUpload,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiGlobe,
} from "react-icons/fi";
import { MdOutlineAccountCircle, MdOutlinePayment } from "react-icons/md";
import { BsGearFill } from "react-icons/bs";
import { FaInstagram, FaTwitter, FaYoutube, FaLinkedin } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../config/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState("account");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Fetch a default avatar if none is set
  useEffect(() => {
    if (profileData && !profileData.profilePicture) {
      // For demo purposes, using a free random avatar service
      setProfileData((prev) => ({
        ...prev,
        profilePicture: "https://i.pravatar.cc/150?img=65",
      }));
    }
  }, [profileData]);

  // Fetch profile data from Firestore when the user is available
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          } else {
            // Initialize with default values so inputs are shown
            setProfileData({
              firstName: "",
              lastName: "",
              username: "",
              bio: "",
              email: user.email,
              phoneNumber: "",
              profilePicture: "",
              instagram: "",
              x: "",
              youtube: "",
              tiktok: "",
              linkedin: "",
              website: "",
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  // Fetch attended events
  useEffect(() => {
    const fetchAttendedEvents = async () => {
      if (user) {
        try {
          const eventsQuery = query(
            collection(db, "events"),
            where("attendees", "array-contains", user.email)
          );
          const querySnapshot = await getDocs(eventsQuery);
          const eventsList = [];
          querySnapshot.forEach((doc) => {
            eventsList.push({ id: doc.id, ...doc.data() });
          });
          setAttendedEvents(eventsList);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      }
    };
    fetchAttendedEvents();
  }, [user]);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Save profile changes to Firestore
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (user && profileData) {
      try {
        await setDoc(doc(db, "users", user.uid), profileData);
        setIsEditing(false);
      } catch (error) {
        console.error("Error saving profile:", error);
      }
    }
  };

  // Upload image to imgbb (replace YOUR_IMGBB_API_KEY with your actual key)
  const uploadToImgbb = async (file) => {
    const apiKey = "YOUR_IMGBB_API_KEY";
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data && data.data && data.data.url) {
        return data.data.url;
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadToImgbb(file);
    if (url) {
      setProfileData({ ...profileData, profilePicture: url });
    }
  };

  // Payment: handle adding card via Squadco API
  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://api.squadco.com/cards", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_SQUADCO_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardNumber,
          expiryDate,
          cvv,
          userId: user.uid,
        }),
      });
      if (response.ok) {
        alert("Card added successfully");
        setCardNumber("");
        setExpiryDate("");
        setCvv("");
      } else {
        alert("Error adding card");
      }
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  if (!profileData) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Top Navbar with Glass Morphism */}
      <nav className="fixed top-0 left-0 w-full bg-white/50 backdrop-blur-lg border-b border-[#9E0DAD]/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-2xl font-bold text-[#9E0DAD]">
            <MdOutlineAccountCircle size={32} />
            <span>Adas Profile</span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setSelectedTab("account")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                selectedTab === "account"
                  ? "bg-[#9E0DAD]/20 text-[#9E0DAD] backdrop-blur-sm"
                  : "text-gray-600 hover:text-[#9E0DAD]"
              }`}
            >
              <BsGearFill size={18} />
              <span>Account</span>
            </button>
            <button
              onClick={() => setSelectedTab("payments")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                selectedTab === "payments"
                  ? "bg-[#9E0DAD]/20 text-[#9E0DAD] backdrop-blur-sm"
                  : "text-gray-600 hover:text-[#9E0DAD]"
              }`}
            >
              <MdOutlinePayment size={20} />
              <span>Payments</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-6 px-6">
        {/* Current Time Display */}
        <div className="text-right text-sm text-gray-600 mb-4">
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
          })}
        </div>

        {/* Page Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#9E0DAD]">Your Profile</h1>
          <p className="text-[#9E0DAD]/70">
            Last updated: {currentTime.toLocaleTimeString()}
          </p>
        </header>

        {/* Tab Content */}
        {selectedTab === "account" && (
          <div>
            {/* Profile Form with Glassmorphism */}
            <form
              onSubmit={handleSaveChanges}
              className="space-y-6 max-w-4xl mx-auto p-6 rounded-3xl backdrop-blur-lg bg-white/30 border border-[#9E0DAD]/20 shadow-lg"
            >
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-2 border-[#9E0DAD]/50 shadow-lg"
                  />
                  <label
                    htmlFor="profilePicInput"
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white opacity-0 hover:opacity-100 transition cursor-pointer"
                  >
                    <FiUpload size={28} />
                  </label>
                  <input
                    id="profilePicInput"
                    type="file"
                    className="hidden"
                    onChange={handleProfilePicChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-[#9E0DAD] text-white rounded hover:opacity-90 transition flex items-center gap-2"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-[#9E0DAD]">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#9E0DAD]"
                    placeholder="Enter first name"
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#9E0DAD]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        lastName: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#9E0DAD]"
                    placeholder="Enter last name"
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#9E0DAD]">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        username: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#9E0DAD]"
                    placeholder="Enter username"
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block font-medium text-[#9E0DAD]">Bio</label>
                <textarea
                  rows="3"
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#9E0DAD]"
                  placeholder="Share something about yourself"
                  readOnly={!isEditing}
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#9E0DAD]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    className="border p-2 rounded w-full cursor-not-allowed bg-gray-100"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#9E0DAD]">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profileData.phoneNumber}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#9E0DAD]"
                    placeholder="Enter phone number"
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h2 className="text-xl font-semibold text-[#9E0DAD]">
                  Social Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {[
                    {
                      label: "Instagram",
                      key: "instagram",
                      placeholder: "instagram.com/username",
                      icon: <FaInstagram size={18} />,
                    },
                    {
                      label: "X (Twitter)",
                      key: "x",
                      placeholder: "x.com/username",
                      icon: <FaTwitter size={18} />,
                    },
                    {
                      label: "YouTube",
                      key: "youtube",
                      placeholder: "youtube.com/@username",
                      icon: <FaYoutube size={18} />,
                    },
                    {
                      label: "TikTok",
                      key: "tiktok",
                      placeholder: "tiktok.com/@username",
                      icon: <SiTiktok size={18} />,
                    },
                    {
                      label: "LinkedIn",
                      key: "linkedin",
                      placeholder: "linkedin.com/in/handle",
                      icon: <FaLinkedin size={18} />,
                    },
                    {
                      label: "Website",
                      key: "website",
                      placeholder: "https://yourwebsite.com",
                      icon: <FiGlobe size={18} />,
                    },
                  ].map(({ label, key, placeholder, icon }) => (
                    <div key={key} className="flex items-center space-x-2">
                      {icon && <div className="text-[#9E0DAD]">{icon}</div>}
                      <input
                        type="text"
                        value={profileData[key]}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            [key]: e.target.value,
                          })
                        }
                        className="border-b border-[#9E0DAD]/50 bg-transparent focus:outline-none w-full py-2"
                        placeholder={placeholder}
                        readOnly={!isEditing}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Save Changes Button */}
              {isEditing && (
                <button
                  type="submit"
                  className="fixed bottom-8 right-8 bg-[#9E0DAD] text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <FiUpload />
                  Save Changes
                </button>
              )}
            </form>

            {/* Attended Events Section */}
            <section className="mt-12 max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold text-[#9E0DAD] mb-4">
                Attended Events
              </h2>
              {attendedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attendedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border rounded p-4 shadow-sm hover:shadow-md transition group bg-white/80 backdrop-blur-sm"
                    >
                      <h3 className="font-bold text-lg text-[#9E0DAD] mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center mb-1">
                        <FiCalendar className="mr-2" />
                        {new Date(event.startTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <FiMapPin className="mr-2" />
                        {event.location?.address || "Location not provided"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No events attended yet.</p>
              )}
            </section>
          </div>
        )}

        {selectedTab === "payments" && (
          <div className="max-w-4xl mx-auto p-6 rounded-3xl backdrop-blur-lg bg-white/30 border border-[#9E0DAD]/20 shadow-lg space-y-6">
            <h2 className="text-2xl font-semibold text-[#9E0DAD] flex items-center space-x-2">
              <MdOutlinePayment size={24} />
              <span>Payment Methods</span>
            </h2>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div className="flex items-center gap-2">
                <FiCreditCard size={20} className="text-[#9E0DAD]" />
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#9E0DAD]"
                  placeholder="Card Number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#9E0DAD]"
                  placeholder="Expiry Date (MM/YY)"
                />
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#9E0DAD]"
                  placeholder="CVV"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#9E0DAD] text-white py-3 rounded-full shadow-lg hover:bg-[#7a098c] transition-colors flex items-center gap-2"
              >
                <FiCreditCard size={20} />
                Add Payment Method
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Adas. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ProfilePage;
