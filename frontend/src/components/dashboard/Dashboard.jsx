import { useEffect, useState } from "react";
import API from "../../services/api";
import "./Dashboard.css";
import Toast from "../toast/Toast";
import Loader from "../loader/Loader";
export default function Dashboard({ user, setUser }) {
    const [provider, setProvider] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loadingProvider, setLoadingProvider] = useState(true);

    const [form, setForm] = useState({
        description: "",
        experience: "",
        serviceRadius: ""
    });

    const [services, setServices] = useState([]);
    const [offerings, setOfferings] = useState([]);
    const [showServiceForm, setShowServiceForm] = useState(false);

    const [serviceForm, setServiceForm] = useState({
        serviceId: "",
        price: ""
    });

    const checkProviderProfile = async () => {
        try {
            const res = await API.get(`/provider/me/${user.id}`);
            setProvider(res.data);

            const offeringRes = await API.get(`/provider-offerings/provider/${res.data.id}`);
            setOfferings(offeringRes.data);

            const incomingRes = await API.get(`/bookings/provider/${res.data.id}/incoming`);
            setIncomingRequests(
                incomingRes.data.sort((a, b) => new Date(a.bookingDateTime) - new Date(b.bookingDateTime))
            );

            fetchProviderBookings(res.data.id);
        } catch (err) {
            setProvider(null);
            setOfferings([]);
            setIncomingRequests([]);
            setProviderBookings([]);
        } finally {
            setLoadingProvider(false);
        }
    };

    const fetchServices = async () => {
        try {
            const res = await API.get("/services");
            setServices(res.data);
        } catch (err) {
            showToast("error", "Something Went Wrong", "Please try again.");
        }
    };

    const openServiceForm = () => {
        fetchServices();
        setShowServiceForm(true);
    };

    const handleServiceFormChange = (e) => {
        setServiceForm({
            ...serviceForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        setLoadingAction("addService");
        try {
            const res = await API.post("/provider-offerings/add", {
                providerId: provider.id,
                serviceId: Number(serviceForm.serviceId),
                price: Number(serviceForm.price)
            });
            showToast("success", "Service Added", "Your service was added successfully.");
            setOfferings([...offerings, res.data]);
            setShowServiceForm(false);
            setServiceForm({
                serviceId: "",
                price: ""
            });
        } catch (err) {
            showToast("error", "Something Went Wrong", "Please try again.");
        }
        finally {
            setLoadingAction(null);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateProvider = async (e) => {
        e.preventDefault();
        setLoadingAction("createProvider");
        try {
            const res = await API.post(`/provider/create/${user.id}`, {
                description: form.description,
                experience: Number(form.experience),
                serviceRadius: Number(form.serviceRadius)
            });
            showToast("success", "Success", "Profile created successfully.");
            setProvider(res.data);
            checkProviderProfile();
            setShowForm(false);
            setForm({
                description: "",
                experience: "",
                serviceRadius: ""
            });
        } catch (err) {
            showToast("error", "Something Went Wrong", "Please try again.");
        }
        finally {
            setLoadingAction(null);
        }
    };
    const [allServices, setAllServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [serviceProviders, setServiceProviders] = useState([]);
    const [showProvidersModal, setShowProvidersModal] = useState(false);

    const handleServiceClick = async (service) => {
        try {
            setSelectedService(service);
            const res = await API.get(`/provider-offerings/service/${service.id}/customer/${user.id}`);
            setServiceProviders(res.data);
            setShowProvidersModal(true);
        } catch (err) {
            showToast("error", "Something Went Wrong", "Please try again.");
        }
    };

    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedOffering, setSelectedOffering] = useState(null);

    const [bookingForm, setBookingForm] = useState({
        address: "",
        note: "",
        bookingDateTime: ""
    });

    const [incomingRequests, setIncomingRequests] = useState([]);
    const handleBookingChange = (e) => {
        setBookingForm({
            ...bookingForm,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateBooking = async (e) => {
        e.preventDefault();
        setLoadingAction("createBooking");
        try {
            await API.post("/bookings", {
                customerId: user.id,
                providerOfferingId: selectedOffering.id,
                address: bookingForm.address,
                note: bookingForm.note,
                bookingDateTime: bookingForm.bookingDateTime
            });

            showToast("success", "Booking Sent", "Your booking request was sent successfully.");
            fetchCustomerBookings();
            setShowBookingForm(false);
            setShowProvidersModal(false);
            setBookingForm({
                address: "",
                note: "",
                bookingDateTime: ""
            });

        } catch (err) {
            showToast("error", "Something Went Wrong", "Please try again.");
        }
        finally {
            setLoadingAction(null);
        }
    };
    const [customerBookings, setCustomerBookings] = useState([]);
    const [providerBookings, setProviderBookings] = useState([]);
    const fetchCustomerBookings = async () => {
        try {
            const res = await API.get(`/bookings/customer/${user.id}`);

            const sortedBookings = res.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setCustomerBookings(sortedBookings);

            fetchReviewedBookingIds(sortedBookings);
        } catch (err) {
            console.log("Failed to load customer bookings");
        }
    };

    const fetchReviewedBookingIds = async (bookings) => {
        try {
            const completedBookings = bookings.filter(
                (booking) => booking.status === "COMPLETED"
            );

            const reviewedIds = [];

            for (const booking of completedBookings) {
                try {
                    const res = await API.get(`/reviews/booking/${booking.id}/exists`);

                    if (res.data === true) {
                        reviewedIds.push(booking.id);
                    }
                } catch (err) {
                    console.log("Review check failed for booking", booking.id);
                }
            }

            setReviewedBookingIds(reviewedIds);
        } catch (err) {
            console.log("Failed to check reviewed bookings");
        }
    };

    const fetchProviderBookings = async (providerId) => {
        try {
            const res = await API.get(`/bookings/provider/${providerId}`);
            setProviderBookings(
                res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            );
        } catch (err) {
            console.log("Failed to load provider bookings");
        }
    };

    const fetchAllServices = async () => {
        try {
            const res = await API.get("/services");
            setAllServices(res.data);
        } catch (err) {
            showToast("error", "Failed", "Could not load services.");
        }
    };
    const [showAllCustomerBookings, setShowAllCustomerBookings] = useState(false);
    const [showAllProviderBookings, setShowAllProviderBookings] = useState(false);

    const [showWorkDoneModal, setShowWorkDoneModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [workDoneForm, setWorkDoneForm] = useState({
        extraAmount: "",
        reason: ""
    });

    const handleWorkDoneChange = (e) => {
        setWorkDoneForm({
            ...workDoneForm,
            [e.target.name]: e.target.value
        });
    };

    const handleMarkWorkDone = async (e) => {
        e.preventDefault();
        setLoadingAction("workDone");
        try {
            await API.put(`/bookings/${selectedBooking.id}/work-done`, {
                extraAmount: Number(workDoneForm.extraAmount) || 0,
                reason: workDoneForm.reason
            });
            showToast("success", "Success", "Work done");
            setShowWorkDoneModal(false);
            setSelectedBooking(null);
            setWorkDoneForm({
                extraAmount: "",
                reason: ""
            });

            checkProviderProfile();
            fetchCustomerBookings();
        } catch (err) {
            showToast("error", "Something Went Wrong", "Please try again.");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleApproveExtraCharge = async (bookingId) => {
        try {
            const res = await API.put(`/bookings/${bookingId}/extra-charge/approve`);

            fetchCustomerBookings();

            setSelectedReviewBooking(res.data);
            setShowReviewModal(true);
        } catch (err) {
            showToast("error", "Something Went Wrong", "Please try again.");
        }
    };

    const handleRejectExtraCharge = async (bookingId) => {
        try {
            const res = await API.put(`/bookings/${bookingId}/extra-charge/reject`);

            fetchCustomerBookings();

            setSelectedReviewBooking(res.data);
            setShowReviewModal(true);
        } catch (err) {
            showToast("error", "Something Went Wrong", "Please try again.");
        }
    };


    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedReviewBooking, setSelectedReviewBooking] = useState(null);

    const [reviewForm, setReviewForm] = useState({
        rating: "",
        comment: ""
    });

    const handleReviewChange = (e) => {
        setReviewForm({
            ...reviewForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setLoadingAction("submitReview");
        try {
            await API.post("/reviews", {
                bookingId: selectedReviewBooking.id,
                customerId: user.id,
                rating: Number(reviewForm.rating),
                comment: reviewForm.comment
            });

            showToast("success", "Review Submitted", "Thanks for sharing your feedback.");
            setReviewedBookingIds((prev) => [...prev, selectedReviewBooking.id]);

            setShowReviewModal(false);
            setSelectedReviewBooking(null);
            setReviewForm({
                rating: "",
                comment: ""
            });
            fetchCustomerBookings();
            checkProviderProfile();
        } catch (err) {
            showToast("error", "Something Went Wrong", "Please try again.");
        } finally {
            setLoadingAction(null);
        }
    };

    const [reviewedBookingIds, setReviewedBookingIds] = useState([]);

    const [toast, setToast] = useState({
        show: false,
        type: "info",
        title: "",
        message: ""
    });

    const showToast = (type, title, message) => {
        setToast({
            show: true,
            type,
            title,
            message
        });

        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 3500);
    };

    const [pageLoading, setPageLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(null);
    useEffect(() => {
        const loadDashboard = async () => {
            setPageLoading(true);

            await Promise.all([
                checkProviderProfile(),
                fetchAllServices(),
                fetchCustomerBookings()
            ]);

            setPageLoading(false);
        };
        loadDashboard();
        const interval = setInterval(() => {
            fetchCustomerBookings();
            checkProviderProfile();
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="dashboard">
            <Toast
                toast={toast}
                onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            />
            <div className="dashboard-card">
                <div className="dashboard-header">
                    <h2>Welcome, {user.name} 👋</h2>
                    <p>{user.email}</p>
                </div>

                <div className="info-grid">
                    <div className="info-box">
                        <span>Status</span>
                        <strong>Active User</strong>
                    </div>

                    <div className="info-box">
                        <span>Member Since</span>
                        <strong>2026</strong>
                    </div>
                </div>
                {pageLoading && <Loader text="Preparing your dashboard..." />}
                {loadingProvider ? (
                    <p className="muted">Checking provider status...</p>
                ) : provider ? (
                    <div className="provider-box">
                        <h3>Provider Profile ✅</h3>
                        <p><strong>Description:</strong> {provider.description}</p>
                        <p><strong>Experience:</strong> {provider.experience} years</p>
                        <p><strong>Service Radius:</strong> {provider.serviceRadius} km</p>
                        <p><strong>Rating:</strong> {provider.rating?.toFixed(1) ?? 0}</p>

                        <div className="service-section">
                            <div className="service-header">
                                <h4>My Services</h4>
                                <button className="small-btn" onClick={openServiceForm}>
                                    Add Service
                                </button>
                            </div>
                            {offerings.length === 0 ? (
                                <p className="muted">No services added yet.</p>
                            ) : (
                                <div className="offering-list">
                                    {offerings.map((item) => (
                                        <div className="offering-card" key={item.id}>
                                            <strong>{item.serviceCategory?.name}</strong>
                                            <span>₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="incoming-section">
                            <h4>Incoming Requests</h4>

                            {incomingRequests.length === 0 ? (
                                <p className="muted">No incoming requests.</p>
                            ) : (
                                <div className="request-list">
                                    {incomingRequests.map((booking) => (
                                        <div className="request-card" key={booking.id}>
                                            <div>
                                                <strong>{booking.customer?.name}</strong>

                                                <p>{booking.providerOffering?.serviceCategory?.name}</p>
                                                <p className="muted">{booking.note}</p>
                                                <small className="booking-address">
                                                    {booking.address}
                                                </small>

                                                <div className="booking-datetime">
                                                    <span className="date-badge">
                                                        📅 {new Date(booking.bookingDateTime).toLocaleDateString()}
                                                    </span>

                                                    <span className="time-badge">
                                                        ⏰ {new Date(booking.bookingDateTime).toLocaleTimeString()}
                                                    </span>

                                                    <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>




                                            </div>

                                            <div className="request-actions">
                                                <button
                                                    className="accept-btn"
                                                    onClick={async () => {
                                                        await API.put(`/bookings/${booking.id}/accept`);
                                                        checkProviderProfile();
                                                    }}
                                                >
                                                    Accept
                                                </button>

                                                <button
                                                    className="reject-btn"
                                                    onClick={async () => {
                                                        await API.put(`/bookings/${booking.id}/reject`);
                                                        checkProviderProfile();
                                                    }}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="incoming-section">
                            <h4>Provider Booking History</h4>

                            {providerBookings.length === 0 ? (
                                <p className="muted">No provider booking history.</p>
                            ) : (
                                <>
                                    <div className="request-list">
                                        {(showAllProviderBookings
                                            ? providerBookings
                                            : providerBookings.slice(0, 3)
                                        ).map((booking) => (
                                            <div className="request-card" key={booking.id}>
                                                <div>
                                                    <strong>{booking.customer?.name}</strong>

                                                    <p>{booking.providerOffering?.serviceCategory?.name}</p>
                                                    <p className="muted">{booking.note}</p>
                                                    <small className="booking-address">
                                                        {booking.address}
                                                    </small>

                                                    <div className="booking-datetime">
                                                        <span className="date-badge">
                                                            📅 {new Date(booking.bookingDateTime).toLocaleDateString()}
                                                        </span>

                                                        <span className="time-badge">
                                                            ⏰ {new Date(booking.bookingDateTime).toLocaleTimeString()}
                                                        </span>
                                                    </div>


                                                </div>

                                                <div className="history-status">
                                                    <strong>₹{booking.finalAmount ?? booking.totalAmount}</strong>
                                                    <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                                                        {booking.status}
                                                    </span>

                                                    {booking.status === "ACCEPTED" && (
                                                        <button
                                                            className="complete-btn"
                                                            onClick={() => {
                                                                setSelectedBooking(booking);
                                                                setShowWorkDoneModal(true);
                                                            }}
                                                        >
                                                            Mark Work Done
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {providerBookings.length > 3 && (
                                        <button
                                            className="show-more-btn"
                                            onClick={() => setShowAllProviderBookings(!showAllProviderBookings)}
                                        >
                                            {showAllProviderBookings ? "Show Less" : "Show More"}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <button className="primary-btn" onClick={() => setShowForm(true)}>
                        Become a Provider
                    </button>
                )}
                <div className="customer-services">
                    <h3>Available Services</h3>
                    <p className="muted">Browse services and find providers near you.</p>

                    <div className="service-card-grid">
                        {allServices.map((service) => (
                            <button
                                key={service.id}
                                className="browse-service-card"
                                onClick={() => handleServiceClick(service)}
                            >
                                <strong>{service.name}</strong>
                                <span>Starts from ₹{service.basePrice}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="history-section">
                    <h3>My Bookings</h3>

                    {customerBookings.length === 0 ? (
                        <p className="muted">No bookings yet.</p>
                    ) : (
                        <>
                            <div className="history-list">
                                {(showAllCustomerBookings
                                    ? customerBookings
                                    : customerBookings.slice(0, 3)
                                ).map((booking) => (
                                    <div className="history-card" key={booking.id}>
                                        <div>
                                            <strong>
                                                {booking.providerOffering?.serviceCategory?.name}
                                            </strong>

                                            <p>
                                                {booking.providerOffering?.provider?.description}
                                            </p>

                                            <small className="booking-address">
                                                {booking.address}
                                            </small>

                                            <div className="booking-datetime">
                                                <span className="date-badge">
                                                    📅 {new Date(booking.bookingDateTime).toLocaleDateString()}
                                                </span>

                                                <span className="time-badge">
                                                    ⏰ {new Date(booking.bookingDateTime).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            {booking.extraChargeStatus === "REQUESTED" && (
                                                <div className="extra-charge-box">
                                                    <strong>Extra charge requested: ₹{booking.extraAmount}</strong>
                                                    <p>{booking.extraChargeReason}</p>

                                                    <div className="extra-actions">
                                                        <button
                                                            className="accept-btn"
                                                            onClick={() => handleApproveExtraCharge(booking.id)}
                                                        >
                                                            Accept
                                                        </button>

                                                        <button
                                                            className="reject-btn"
                                                            onClick={() => handleRejectExtraCharge(booking.id)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="history-status">
                                            <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                                                {booking.status}
                                            </span>

                                            <strong>₹{booking.finalAmount ?? booking.totalAmount}</strong>
                                            {booking.status === "COMPLETED" &&
                                                (reviewedBookingIds.includes(booking.id) ? (
                                                    <span className="reviewed-badge">Reviewed ✅</span>
                                                ) : (
                                                    <button
                                                        className="review-btn"
                                                        onClick={() => {
                                                            setSelectedReviewBooking(booking);
                                                            setShowReviewModal(true);
                                                        }}
                                                    >
                                                        Write Review
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {customerBookings.length > 3 && (
                                <button
                                    className="show-more-btn"
                                    onClick={() =>
                                        setShowAllCustomerBookings(!showAllCustomerBookings)
                                    }
                                >
                                    {showAllCustomerBookings ? "Show Less" : "Show More"}
                                </button>
                            )}
                        </>
                    )}
                </div>
                <button className="logout-btn" onClick={() => setUser(null)}>
                    Logout
                </button>
            </div>
            {showBookingForm && (
                <div className="modal-overlay">
                    <div className="provider-modal">
                        <h3>Book Service</h3>
                        <p className="muted">
                            {selectedOffering?.serviceCategory?.name} - ₹{selectedOffering?.price}
                        </p>

                        <form onSubmit={handleCreateBooking}>
                            <input
                                type="text"
                                name="address"
                                placeholder="Service address"
                                value={bookingForm.address}
                                onChange={handleBookingChange}
                                required
                            />

                            <input
                                type="datetime-local"
                                name="bookingDateTime"
                                value={bookingForm.bookingDateTime}
                                onChange={handleBookingChange}
                                required
                            />

                            <textarea
                                name="note"
                                placeholder="Describe your issue"
                                value={bookingForm.note}
                                onChange={handleBookingChange}
                            />

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowBookingForm(false)}
                                >
                                    Cancel
                                </button>

                                <button type="submit" className="primary-btn" disabled={loadingAction === "createBooking"}>
                                    {loadingAction === "createBooking" ? "Please wait..." : "Send Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showForm && (
                <div className="modal-overlay">
                    <div className="provider-modal">
                        <h3>Become a Provider</h3>
                        <p className="muted">Create your provider profile</p>

                        <form onSubmit={handleCreateProvider}>
                            <textarea
                                name="description"
                                placeholder="Describe your service experience"
                                value={form.description}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="number"
                                name="experience"
                                placeholder="Experience in years"
                                value={form.experience}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="number"
                                name="serviceRadius"
                                placeholder="Service radius in km"
                                value={form.serviceRadius}
                                onChange={handleChange}
                                required
                            />

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>

                                <button type="submit" className="primary-btn" disabled={loadingAction === "createProvider"}>
                                    {loadingAction === "createProvider" ? "Please wait..." : "Create Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showServiceForm && (
                <div className="modal-overlay">
                    <div className="provider-modal">
                        <h3>Add Service</h3>
                        <p className="muted">Select a service and set your price</p>

                        <form onSubmit={handleAddService}>
                            <select
                                name="serviceId"
                                value={serviceForm.serviceId}
                                onChange={handleServiceFormChange}
                                required
                            >
                                <option value="">Select service</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name} - Base ₹{service.basePrice}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                name="price"
                                placeholder="Your price"
                                value={serviceForm.price}
                                onChange={handleServiceFormChange}
                                required
                            />

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowServiceForm(false)}
                                >
                                    Cancel
                                </button>

                                <button type="submit" className="primary-btn" disabled={loadingAction === "addService"}>
                                    {loadingAction === "addService" ? "Please wait..." : "Add Service"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            )}
            {showProvidersModal && (
                <div className="modal-overlay">
                    <div className="provider-modal large-modal">
                        <h3>{selectedService?.name} Providers</h3>
                        <p className="muted">Compare providers and prices.</p>

                        {serviceProviders.length === 0 ? (
                            <p className="muted">No providers available for this service yet.</p>
                        ) : (
                            <div className="provider-list">
                                {serviceProviders.map((item) => (
                                    <div className="provider-card" key={item.id}>
                                        <div>
                                            <strong>{item.provider?.user?.name || "Service Provider"}</strong>
                                            <p>{item.provider?.description}</p>
                                            <small>
                                                Experience: {item.provider?.experience} years | Rating: {item.provider?.rating ?? 0}
                                            </small>
                                        </div>

                                        <div className="provider-actions">
                                            <div className="provider-price">₹{item.price}</div>

                                            <button
                                                className="small-btn"
                                                onClick={() => {
                                                    setSelectedOffering(item);
                                                    setShowProvidersModal(false);
                                                    setShowBookingForm(true);
                                                }}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className="cancel-btn"
                            onClick={() => setShowProvidersModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {showWorkDoneModal && (
                <div className="modal-overlay">
                    <div className="provider-modal">
                        <h3>Mark Work Done</h3>
                        <p className="muted">
                            Base Amount: ₹{selectedBooking?.totalAmount}
                        </p>

                        <form onSubmit={handleMarkWorkDone}>
                            <input
                                type="number"
                                name="extraAmount"
                                placeholder="Extra amount (optional)"
                                value={workDoneForm.extraAmount}
                                onChange={handleWorkDoneChange}
                            />

                            <textarea
                                name="reason"
                                placeholder="Reason for extra charge (optional)"
                                value={workDoneForm.reason}
                                onChange={handleWorkDoneChange}
                            />

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowWorkDoneModal(false)}
                                >
                                    Cancel
                                </button>

                                <button type="submit" className="primary-btn" disabled={loadingAction === "workDone"}>
                                    {loadingAction === "workDone" ? "Please wait..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            )}
            {showReviewModal && (
                <div className="modal-overlay">
                    <div className="provider-modal">
                        <h3>Write Review</h3>
                        <p className="muted">
                            {selectedReviewBooking?.providerOffering?.serviceCategory?.name}
                        </p>

                        <form onSubmit={handleSubmitReview}>
                            <select
                                name="rating"
                                value={reviewForm.rating}
                                onChange={handleReviewChange}
                                required
                            >
                                <option value="">Select rating</option>
                                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                                <option value="4">⭐⭐⭐⭐ Good</option>
                                <option value="3">⭐⭐⭐ Average</option>
                                <option value="2">⭐⭐ Poor</option>
                                <option value="1">⭐ Very Poor</option>
                            </select>

                            <textarea
                                name="comment"
                                placeholder="Share your experience"
                                value={reviewForm.comment}
                                onChange={handleReviewChange}
                            />

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowReviewModal(false)}
                                >
                                    Cancel
                                </button>

                                <button type="submit" className="primary-btn" disabled={loadingAction === "submitReview"}>
                                    {loadingAction === "submitReview" ? "Please wait..." : "Submit Review"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}