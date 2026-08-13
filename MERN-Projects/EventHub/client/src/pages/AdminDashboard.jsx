import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEventForm, setShowEventForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        category: '',
        totalSeats: '',
        ticketPrice: '',
        image: ''
    });

    // ========================================
    // AUTH + FETCH DATA
    // ========================================

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'admin') {
            navigate('/');
            return;
        }

        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my')
            ]);

            // ----------------------------------------
            // Safely handle events response
            // ----------------------------------------

            const eventsData = eventsRes.data;

            if (Array.isArray(eventsData)) {
                setEvents(eventsData);
            } else if (Array.isArray(eventsData?.events)) {
                setEvents(eventsData.events);
            } else if (Array.isArray(eventsData?.data)) {
                setEvents(eventsData.data);
            } else {
                console.error('Unexpected events response:', eventsData);
                setEvents([]);
            }

            // ----------------------------------------
            // Safely handle bookings response
            // ----------------------------------------

            const bookingsData = bookingsRes.data;

            if (Array.isArray(bookingsData)) {
                setBookings(bookingsData);
            } else if (Array.isArray(bookingsData?.bookings)) {
                setBookings(bookingsData.bookings);
            } else if (Array.isArray(bookingsData?.data)) {
                setBookings(bookingsData.data);
            } else {
                console.error('Unexpected bookings response:', bookingsData);
                setBookings([]);
            }

        } catch (error) {
            console.error('Error fetching admin data:', error);

            setEvents([]);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    // ========================================
    // CREATE EVENT
    // ========================================

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        try {
            await api.post('/events', {
                ...formData,
                totalSeats: Number(formData.totalSeats),
                ticketPrice: Number(formData.ticketPrice)
            });

            alert('Event created successfully!');

            setShowEventForm(false);

            setFormData({
                title: '',
                description: '',
                date: '',
                location: '',
                category: '',
                totalSeats: '',
                ticketPrice: '',
                image: ''
            });

            await fetchData();

        } catch (error) {
            console.error('Create event error:', error);

            alert(
                error.response?.data?.message ||
                'Error creating event'
            );
        }
    };

    // ========================================
    // DELETE EVENT
    // ========================================

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            await api.delete(`/events/${id}`);

            alert('Event deleted successfully!');

            await fetchData();

        } catch (error) {
            console.error('Delete event error:', error);

            alert(
                error.response?.data?.message ||
                'Error deleting event'
            );
        }
    };

    // ========================================
    // CONFIRM BOOKING
    // ========================================

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, {
                paymentStatus
            });

            alert('Booking confirmed successfully!');

            await fetchData();

        } catch (error) {
            console.error('Confirm booking error:', error);

            alert(
                error.response?.data?.message ||
                'Error confirming booking'
            );
        }
    };

    // ========================================
    // CANCEL / REJECT BOOKING
    // ========================================

    const handleCancelBooking = async (id) => {
        if (!window.confirm("Cancel this user's booking request?")) {
            return;
        }

        try {
            await api.delete(`/bookings/${id}`);

            alert('Booking cancelled successfully!');

            await fetchData();

        } catch (error) {
            console.error('Cancel booking error:', error);

            alert(
                error.response?.data?.message ||
                'Error cancelling booking'
            );
        }
    };

    // ========================================
    // LOADING
    // ========================================

    if (loading) {
        return (
            <div className="text-center py-20 text-xl font-semibold">
                Loading admin panel...
            </div>
        );
    }

    // ========================================
    // CALCULATE STATS
    // ========================================

    const totalRevenue = bookings.reduce(
        (sum, booking) =>
            booking.paymentStatus === 'paid' &&
            booking.status === 'confirmed'
                ? sum + Number(booking.amount || 0)
                : sum,
        0
    );

    const paidClients = new Set(
        bookings
            .filter(
                booking =>
                    booking.paymentStatus === 'paid' &&
                    booking.status === 'confirmed'
            )
            .map(booking => booking.userId?._id)
            .filter(Boolean)
    ).size;

    const pendingRequests = bookings.filter(
        booking => booking.status === 'pending'
    ).length;

    // ========================================
    // UI
    // ========================================

    return (
        <div className="max-w-7xl mx-auto">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
                        Admin Dashboard
                    </h1>

                    <p className="text-gray-300">
                        Manage events and manually confirm bookings.
                    </p>
                </div>

                <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="w-full md:w-auto bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition shadow-md"
                >
                    {showEventForm
                        ? 'Cancel Creation'
                        : '+ Create New Event'}
                </button>
            </div>

            {/* ========================================
                STATS
            ======================================== */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* Revenue */}

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">

                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
                            Total Revenue
                        </p>

                        <h3 className="text-3xl font-black text-green-600">
                            ₹{totalRevenue}
                        </h3>
                    </div>

                    <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl font-bold">
                        ₹
                    </div>
                </div>

                {/* Paid Clients */}

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">

                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
                            Paid Clients
                        </p>

                        <h3 className="text-3xl font-black text-blue-600">
                            {paidClients}
                        </h3>
                    </div>

                    <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
                        👤
                    </div>
                </div>

                {/* Pending */}

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">

                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
                            Pending Requests
                        </p>

                        <h3 className="text-3xl font-black text-yellow-600">
                            {pendingRequests}
                        </h3>
                    </div>

                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl font-bold">
                        ⏳
                    </div>
                </div>

            </div>

            {/* ========================================
                CREATE EVENT FORM
            ======================================== */}

            {showEventForm && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">

                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        Create New Event
                    </h2>

                    <form
                        onSubmit={handleCreateEvent}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >

                        <input
                            required
                            type="text"
                            placeholder="Event Title"
                            className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none"
                            value={formData.title}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value
                                })
                            }
                        />

                        <input
                            required
                            type="text"
                            placeholder="Category (e.g., Tech, Music)"
                            className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none"
                            value={formData.category}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    category: e.target.value
                                })
                            }
                        />

                        <input
                            required
                            type="date"
                            className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none"
                            value={formData.date}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    date: e.target.value
                                })
                            }
                        />

                        <input
                            required
                            type="text"
                            placeholder="Location"
                            className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none"
                            value={formData.location}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    location: e.target.value
                                })
                            }
                        />

                        <input
                            required
                            type="number"
                            min="1"
                            placeholder="Total Seats"
                            className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none"
                            value={formData.totalSeats}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    totalSeats: e.target.value
                                })
                            }
                        />

                        <input
                            required
                            type="number"
                            min="0"
                            placeholder="Ticket Price (0 for free)"
                            className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none"
                            value={formData.ticketPrice}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    ticketPrice: e.target.value
                                })
                            }
                        />

                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Image URL"
                                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none"
                                value={formData.image}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        image: e.target.value
                                    })
                                }
                            />
                        </div>

                        <textarea
                            required
                            placeholder="Event Description"
                            className="border px-4 py-3 rounded-lg md:col-span-2 h-32 focus:ring-2 focus:ring-gray-700 outline-none"
                            value={formData.description}
                            onChange={e =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value
                                })
                            }
                        />

                        <button
                            type="submit"
                            className="md:col-span-2 bg-gray-900 text-white font-bold py-3 mt-2 rounded-lg hover:bg-black transition shadow-md"
                        >
                            Publish Event
                        </button>

                    </form>
                </div>
            )}

            {/* ========================================
                EVENTS + BOOKINGS
            ======================================== */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ========================================
                    EVENTS
                ======================================== */}

                <div className="flex flex-col">

                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">

                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm">
                            {events.length}
                        </span>

                        All Events
                    </h2>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                        <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">

                            {events.length === 0 ? (

                                <li className="p-6 text-gray-500 text-center">
                                    No events created yet.
                                </li>

                            ) : (

                                events.map(event => (

                                    <li
                                        key={event._id}
                                        className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition border-b border-gray-100"
                                    >

                                        <div>

                                            <h4 className="font-bold text-gray-900 mb-1">
                                                {event.title}
                                            </h4>

                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">

                                                <span className="flex items-center gap-1 font-medium">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>

                                                    {event.date
                                                        ? new Date(event.date).toLocaleDateString()
                                                        : 'No date'}
                                                </span>

                                                <span className="flex items-center gap-1 font-medium">

                                                    <div
                                                        className={`w-2 h-2 rounded-full ${
                                                            Number(event.availableSeats) > 0
                                                                ? 'bg-green-500'
                                                                : 'bg-red-500'
                                                        }`}
                                                    ></div>

                                                    {event.availableSeats ?? 0}/
                                                    {event.totalSeats ?? 0} seats

                                                </span>

                                            </div>

                                        </div>

                                        <button
                                            onClick={() =>
                                                handleDeleteEvent(event._id)
                                            }
                                            className="w-full sm:w-auto text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm"
                                        >
                                            Delete
                                        </button>

                                    </li>

                                ))

                            )}

                        </ul>

                    </div>

                </div>

                {/* ========================================
                    BOOKINGS
                ======================================== */}

                <div className="flex flex-col">

                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">

                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">
                            {bookings.length}
                        </span>

                        Booking Requests
                    </h2>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                        <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">

                            {bookings.length === 0 ? (

                                <li className="p-6 text-gray-500 text-center">
                                    No bookings yet.
                                </li>

                            ) : (

                                bookings.map(booking => (

                                    <li
                                        key={booking._id}
                                        className={`p-6 hover:bg-gray-50 transition border-l-4 ${
                                            booking.status === 'pending'
                                                ? 'border-l-yellow-400'
                                                : booking.status === 'confirmed'
                                                    ? 'border-l-green-400'
                                                    : 'border-l-red-400'
                                        }`}
                                    >

                                        <div className="flex justify-between items-start mb-3">

                                            <h4 className="font-bold text-gray-900 text-lg">
                                                {booking.eventId?.title || 'Deleted Event'}
                                            </h4>

                                            <div className="flex flex-col gap-1 items-end shrink-0 ml-4">

                                                <span
                                                    className={`px-2 py-1 text-[10px] font-black rounded uppercase ${
                                                        booking.status === 'confirmed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : booking.status === 'cancelled'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                                >
                                                    {booking.status}
                                                </span>

                                                {booking.status !== 'cancelled' && (
                                                    <span
                                                        className={`px-2 py-1 text-[10px] font-black rounded uppercase ${
                                                            booking.paymentStatus === 'paid'
                                                                ? 'bg-indigo-100 text-indigo-700'
                                                                : 'bg-gray-200 text-gray-800'
                                                        }`}
                                                    >
                                                        {(booking.paymentStatus || 'not_paid').replace(
                                                            '_',
                                                            ' '
                                                        )}
                                                    </span>
                                                )}

                                            </div>

                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100 text-sm">

                                            <p className="text-gray-700 flex flex-wrap items-center gap-2 mb-1">

                                                <span className="font-bold w-16 text-gray-500 uppercase text-xs">
                                                    User:
                                                </span>

                                                <span className="font-semibold">
                                                    {booking.userId?.name || 'Unknown User'}
                                                </span>

                                                <span className="text-gray-400">
                                                    ({booking.userId?.email || 'No email'})
                                                </span>

                                            </p>

                                            <p className="text-gray-700 flex items-center gap-2 mb-1">

                                                <span className="font-bold w-16 text-gray-500 uppercase text-xs">
                                                    Amount:
                                                </span>

                                                <span
                                                    className={`font-semibold ${
                                                        Number(booking.amount) === 0
                                                            ? 'text-green-600'
                                                            : ''
                                                    }`}
                                                >
                                                    {Number(booking.amount) === 0
                                                        ? 'Free'
                                                        : `₹${booking.amount}`}
                                                </span>

                                            </p>

                                            <p className="text-gray-700 flex items-center gap-2 mb-1">

                                                <span className="font-bold w-16 text-gray-500 uppercase text-xs">
                                                    Date:
                                                </span>

                                                <span>
                                                    {booking.bookedAt
                                                        ? new Date(
                                                              booking.bookedAt
                                                          ).toLocaleString()
                                                        : 'Unknown'}
                                                </span>

                                            </p>

                                            {booking.eventId && (

                                                <p className="text-gray-700 flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">

                                                    <span className="font-bold w-16 text-gray-500 uppercase text-xs">
                                                        Seats:
                                                    </span>

                                                    <span
                                                        className={`font-bold ${
                                                            Number(
                                                                booking.eventId
                                                                    .availableSeats
                                                            ) > 0
                                                                ? 'text-green-600'
                                                                : 'text-red-500'
                                                        }`}
                                                    >
                                                        {booking.eventId.availableSeats ?? 0}
                                                    </span>

                                                    remaining of{' '}
                                                    {booking.eventId.totalSeats ?? 0}

                                                </p>

                                            )}

                                        </div>

                                        {/* ========================================
                                            ADMIN ACTIONS
                                        ======================================== */}

                                        {booking.status === 'pending' && (

                                            <div className="flex flex-wrap gap-2 mt-2">

                                                <button
                                                    onClick={() =>
                                                        handleConfirmBooking(
                                                            booking._id,
                                                            'paid'
                                                        )
                                                    }
                                                    className="flex-1 min-w-[120px] bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition"
                                                >
                                                    ✓ Approve as Paid
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleConfirmBooking(
                                                            booking._id,
                                                            'not_paid'
                                                        )
                                                    }
                                                    className="flex-1 min-w-[120px] bg-gray-50 text-gray-700 hover:bg-gray-800 hover:text-white border border-gray-200 text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition"
                                                >
                                                    ✓ Approve Undecided
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleCancelBooking(
                                                            booking._id
                                                        )
                                                    }
                                                    className="w-[80px] bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 text-xs font-bold py-2.5 px-3 rounded-lg transition"
                                                >
                                                    ✕ Reject
                                                </button>

                                            </div>

                                        )}

                                    </li>

                                ))

                            )}

                        </ul>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;