// src/pages/EventMarketing.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import Sidebar from "./Sidebar";
import {
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaBars,
  FaTimes,
} from "react-icons/fa";
// If you wish to show a QR code, install and import a package such as:
// import QRCode from "qrcode.react";

const EventMarketing = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch event data from Firestore
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "events", eventId));
        if (eventDoc.exists()) {
          setEventData({ id: eventDoc.id, ...eventDoc.data() });
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, navigate]);

  if (loading) {
    return (
      <div className="text-center text-gray-400 p-4">
        Loading Event Marketing Details...
      </div>
    );
  }
  if (!eventData) {
    return <div className="text-center text-red-500 p-4">Event not found.</div>;
  }

  // Create a shareable link using your live website's domain
  const shareableLink = `https://adas-event.web.app/event-page/${eventId}`;

  return (
    <div className="relative flex min-h-screen bg-black text-white">
      {/* Mobile Hamburger Button */}
      <div className="absolute top-4 left-4 md:hidden z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-white focus:outline-none"
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 shadow-lg transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between md:hidden">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white focus:outline-none"
            >
              <FaTimes size={24} />
            </button>
          </div>
          <Sidebar eventId={eventId} />
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-6 transition-all">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-purple-400 text-center">
            Event Marketing for {eventData.title}
          </h2>
        </header>

        {/* Marketing Share Section */}
        <section className="mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaShareAlt className="mr-2" /> Share Your Event
            </h3>
            <p className="mb-4">
              Use the following link to promote your event across your social
              media platforms:
            </p>
            <div className="flex items-center">
              <input
                type="text"
                value={shareableLink}
                readOnly
                className="w-full p-2 rounded-l-lg bg-gray-700 text-white border border-gray-600"
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareableLink)}
                className="bg-teal-600 hover:bg-teal-500 p-2 rounded-r-lg"
              >
                Copy Link
              </button>
            </div>
            {/* Uncomment below to display a QR code */}
            {/*
            <div className="mt-4">
              <QRCode
                value={shareableLink}
                size={128}
                bgColor="#1F2937"
                fgColor="#fff"
              />
            </div>
            */}
          </div>
        </section>

        {/* Social Media Sharing Section */}
        <section className="mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Social Media Sharing</h3>
            <p className="mb-4">
              Quickly share your event on popular social media platforms:
            </p>
            <div className="flex space-x-4 text-2xl">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareableLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500"
              >
                <FaFacebook />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareableLink
                )}&text=${encodeURIComponent(eventData.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400"
              >
                <FaTwitter />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  shareableLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-700"
              >
                <FaLinkedin />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  shareableLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-500"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </section>

        {/* Event Flyer / Banner Preview Section */}
        {eventData.imageUrl && (
          <section className="mb-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-xl font-bold mb-4">Event Flyer Preview</h3>
              <img
                src={eventData.imageUrl}
                alt={`${eventData.title} Flyer`}
                className="w-full max-w-md rounded mb-4"
              />
              <a
                href={eventData.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded"
              >
                View Full Image
              </a>
            </div>
          </section>
        )}

        {/* Attendees List Section with WhatsApp Chat Link */}
        <section className="mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Registered Attendees</h3>
            {eventData.attendees && eventData.attendees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">WhatsApp</th>
                      <th className="px-4 py-2 text-left">Chat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {eventData.attendees.map((attendee, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{attendee.name}</td>
                        <td className="px-4 py-2">{attendee.email}</td>
                        <td className="px-4 py-2">
                          {attendee.whatsapp || "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          {attendee.whatsapp ? (
                            <a
                              href={`https://wa.me/${attendee.whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-400 hover:underline"
                            >
                              Message
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No attendees registered yet.</p>
            )}
          </div>
        </section>

        {/* Additional Marketing Tools Section */}
        <section className="mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">
              Additional Marketing Tools
            </h3>
            <p className="mb-4">
              Consider using email marketing, social media ads, influencer
              partnerships, and SEO strategies to boost your event’s visibility.
              Engage your audience with compelling content and interactive
              posts.
            </p>
            <Link
              to="#"
              className="inline-block bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg transition-colors text-sm font-medium"
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* Promotional Resources Section */}
        <section className="mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Promotional Resources</h3>
            <p className="mb-4">
              Download a complete promotional kit including banners, posters,
              and pre-written social media posts to help you promote your event
              effectively.
            </p>
            <a
              href="#"
              className="inline-block bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg transition-colors text-sm font-medium"
            >
              Download Promotional Kit
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventMarketing;
