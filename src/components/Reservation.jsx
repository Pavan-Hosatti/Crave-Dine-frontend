import React, { useState } from 'react';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

// IMPORTANT: Define BASE_URL for reservation endpoints
// Using environment variable VITE_API_URL for the base path
const BASE_URL_RESERVATION = import.meta.env.VITE_API_URL + '/reservation';

const Reservation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAuth(); // Get isAuthenticated and user from AuthContext

  const handleReservation = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken"); // Use 'jwtToken' for consistency

  

    if (!isAuthenticated || !user || !token) {
      toast.error("Please login to make a reservation.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL_RESERVATION}/send`, // Correct endpoint
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use jwtToken
          },
          body: JSON.stringify({ firstName, lastName, email, phone, date, time, address }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Reservation failed');
      }

      // FIX: Display the table number in the success toast
      // Ensure data.reservation and data.reservation.tableNumber exist
      const tableNumber = data.reservation?.tableNumber || 'N/A';
      toast.success(`Reservation successful! Your table number is: ${tableNumber}. Please check your dashboard.`);
      
      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDate("");
      setTime("");
      setAddress("");

      // FIX: Navigate to dashboard after successful reservation
      navigate("/dashboard");
    } catch (error) {
     
      toast.error(error.message || "Reservation failed.");
    }
  };

  return (
    <section className='reservation' id='reservation'>
      <div className="container">
        <div className="banner">
          <img src="/reservation.png" alt="Reservation Illustration" />
        </div>
        <div className="banner">
          <div className="reservation_form_box">
            <h1>MAKE A RESERVATION</h1>
            <p>For Further Questions, Please Call</p>

            <form onSubmit={handleReservation}>
              <div>
                <input
                  type='text'
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type='text'
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type='date'
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <input
                  type='time'
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder='Phone'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder='Address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <button type="submit">
                RESERVE NOW <span><HiOutlineArrowNarrowRight /></span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
