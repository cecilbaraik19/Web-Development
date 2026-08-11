
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaChair,
    FaMoneyBillWave,
    FaArrowLeft,
} from "react-icons/fa";

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // ==========================================
    // FETCH EVENT
    // ==========================================

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError("");

                const { data } = await api.get(`/events/${id}`);

                console.log("EVENT API RESPONSE:", data);

                if (data.success && data.event) {
                    // IMPORTANT:
                    // Backend returns { success, event }
                    // We need only data.event
                    setEvent(data.event);
                } else {
                    setError("Event not found.");
                }
            } catch (err) {
                console.error("Failed to load event:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load event details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    // ==========================================
    // BOOK EVENT
    // ==========================================

    const handleBooking = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (!event) {
            return;
        }

        setBookingLoading(true);
        setError("");
        setSuccessMsg("");

        try {
            // Step 1: Send OTP
            if (!showOTP) {
                await api.post("/bookings/send-otp");

                setShowOTP(true);

                setSuccessMsg(
                    "OTP sent to your email. Please enter the OTP to confirm your booking."
                );
            }

            // Step 2: Verify OTP and book
            else {
                if (!otp || otp.length !== 6) {
                    setError("Please enter the 6-digit OTP.");
                    return;
                }

                await api.post("/bookings", {
                    eventId: event._id,
                    otp: otp,
                });

                setSuccessMsg(
                    "Booking requested! Awaiting admin confirmation."
                );

                setShowOTP(false);
                setOtp("");

                // Update available seats locally
                setEvent((previousEvent) => ({
                    ...previousEvent,
                    availableSeats: Math.max(
                        0,
                        previousEvent.availableSeats - 1
                    ),
                }));
            }
        } catch (err) {
            console.error("Booking error:", err);

            setError(
                err.response?.data?.message ||
                "Booking failed. Please try again."
            );
        } finally {
            setBookingLoading(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-semibold text-gray-600">
                    Loading event details...
                </p>
            </div>
        );
    }

    // ==========================================
    // ERROR / NOT FOUND
    // ==========================================

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <p className="text-xl text-red-500 mb-6">
                    {error || "Event not found."}
                </p>

                <button
                    onClick={() => navigate("/")}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition"
                >
                    Back to Events
                </button>
            </div>
        );
    }

    // ==========================================
    // EVENT VALUES
    // ==========================================

    const isSoldOut = event.availableSeats <= 0;

    const eventDate = new Date(event.date);

    const formattedDate = eventDate.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formattedTime = eventDate.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });

    const seatPercentage =
        event.totalSeats > 0
            ? (event.availableSeats / event.totalSeats) * 100
            : 0;

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">

            <div className="max-w-6xl mx-auto">

                {/* BACK BUTTON */}

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-6 transition"
                >
                    <FaArrowLeft />
                    Back
                </button>

                {/* MAIN CARD */}

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

                    {/* EVENT IMAGE */}

                    {event.image ? (
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-72 md:h-96 object-cover"
                        />
                    ) : (
                        <div className="w-full h-72 bg-gray-900 flex items-center justify-center text-white text-5xl font-black">
                            {event.category || "EVENT"}
                        </div>
                    )}

                    {/* CONTENT */}

                    <div className="p-6 md:p-10">

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                            {/* LEFT SIDE */}

                            <div className="lg:col-span-2">

                                {/* CATEGORY */}

                                <span className="inline-block bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-4">
                                    {event.category}
                                </span>

                                {/* TITLE */}

                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                                    {event.title}
                                </h1>

                                {/* DESCRIPTION */}

                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    About This Event
                                </h2>

                                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                    {event.description ||
                                        "No description available for this event."}
                                </p>

                                {/* EVENT INFORMATION */}

                                <div className="space-y-5">

                                    {/* DATE */}

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center">
                                            <FaCalendarAlt />
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-400 font-semibold uppercase">
                                                Date & Time
                                            </p>

                                            <p className="font-bold text-gray-900">
                                                {formattedDate}
                                            </p>

                                            <p className="text-gray-600">
                                                {formattedTime}
                                            </p>
                                        </div>
                                    </div>

                                    {/* LOCATION */}

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center">
                                            <FaMapMarkerAlt />
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-400 font-semibold uppercase">
                                                Location
                                            </p>

                                            <p className="font-bold text-gray-900">
                                                {event.location}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {/* RIGHT SIDE - BOOKING */}

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 h-fit">

                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Booking Details
                                </h2>

                                {/* PRICE */}

                                <div className="flex items-center gap-4 mb-6">

                                    <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center">
                                        <FaMoneyBillWave />
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">
                                            Ticket Price
                                        </p>

                                        <p className="text-xl font-bold text-gray-900">
                                            {event.ticketPrice === 0 ? (
                                                <span className="text-green-600">
                                                    FREE
                                                </span>
                                            ) : (
                                                `₹${event.ticketPrice}`
                                            )}
                                        </p>
                                    </div>

                                </div>

                                {/* SEATS */}

                                <div className="flex items-center gap-4 mb-3">

                                    <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center">
                                        <FaChair />
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">
                                            Availability
                                        </p>

                                        <p className="font-bold text-gray-900">
                                            {event.availableSeats} /{" "}
                                            {event.totalSeats}
                                        </p>
                                    </div>

                                </div>

                                {/* SEAT PROGRESS */}

                                <div className="mb-8">

                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gray-800 h-2 rounded-full transition-all"
                                            style={{
                                                width: `${seatPercentage}%`,
                                            }}
                                        ></div>
                                    </div>

                                    <p className="text-xs text-gray-500 mt-2">
                                        {event.availableSeats} seats remaining
                                    </p>

                                </div>

                                {/* OTP */}

                                {showOTP && (
                                    <div className="mb-5">

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Enter OTP
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            value={otp}
                                            onChange={(e) =>
                                                setOtp(
                                                    e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 6)
                                                )
                                            }
                                            maxLength={6}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 text-center text-xl font-bold tracking-widest"
                                        />

                                    </div>
                                )}

                                {/* BOOK BUTTON */}

                                <button
                                    onClick={handleBooking}
                                    disabled={
                                        isSoldOut ||
                                        bookingLoading ||
                                        (showOTP && otp.length !== 6)
                                    }
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                                        isSoldOut ||
                                        bookingLoading ||
                                        (showOTP && otp.length !== 6)
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-gray-900 text-white hover:bg-black"
                                    }`}
                                >
                                    {bookingLoading
                                        ? "Processing..."
                                        : showOTP
                                        ? "Verify OTP & Confirm"
                                        : isSoldOut
                                        ? "Sold Out"
                                        : "Confirm Registration"}
                                </button>

                                {/* ERROR */}

                                {error && (
                                    <p className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-center text-sm font-medium">
                                        {error}
                                    </p>
                                )}

                                {/* SUCCESS */}

                                {successMsg && (
                                    <p className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg text-center text-sm font-medium">
                                        {successMsg}
                                    </p>
                                )}

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;

