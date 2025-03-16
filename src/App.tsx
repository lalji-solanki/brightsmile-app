import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/DentistApp.css";

interface Dentist {
  id: number;
  name: string;
  specialization: string;
}

interface Slot {
  id: string;
  dentistId: number;
  date: string;
  time: string;
  displayTime: string;
}

interface Appointment {
  id: number;
  patientName: string;
  dentist: Dentist;
  slot: Slot;
}

// Dentist List
const dentists: Dentist[] = [
  { id: 1, name: "Dr. Smith", specialization: "General Dentistry" },
  { id: 2, name: "Dr. Jones", specialization: "Orthodontics" },
  { id: 3, name: "Dr. Lee", specialization: "Periodontics" },
];

// Generate slots dynamically (09:00 AM - 08:00 PM)
const generateSlots = (date: string, dentistId: number): Slot[] => {
  const slots: Slot[] = [];
  for (let hour = 9; hour <= 20; hour++) {
    const time = `${hour < 10 ? "0" + hour : hour}:00`;
    const displayHour = hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? "AM" : "PM";
    const displayTime = `${displayHour}:00 ${ampm}`;

    slots.push({ id: `${dentistId}-${date}-${time}`, dentistId, date, time, displayTime });
  }
  return slots;
};

const DentistAppointmentApp: React.FC = () => {
  const [patientName, setPatientName] = useState("");
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const appointmentsRef = useRef<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState("book");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    setAppointments(storedAppointments);
    appointmentsRef.current = storedAppointments;
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedDarkMode);
    if (storedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const saveAppointments = (updatedAppointments: Appointment[]) => {
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments);
    appointmentsRef.current = updatedAppointments;
  };

  const handleBookAppointment = () => {
    if (!patientName || !selectedDentist || !selectedSlot) {
      toast.error("Please fill in all fields.");
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now(),
      patientName,
      dentist: selectedDentist,
      slot: selectedSlot,
    };

    const updatedAppointments = [...appointmentsRef.current, newAppointment];
    saveAppointments(updatedAppointments);

    setPatientName("");
    setSelectedDentist(null);
    setSelectedSlot(null);
    toast.success("Appointment booked successfully!");
  };

  const handleCancelAppointment = (appointmentId: number) => {
    const updatedAppointments = appointments.filter((appointment) => appointment.id !== appointmentId);
    saveAppointments(updatedAppointments);
  };

  const getAvailableSlots = () => {
    if (!selectedDentist || !selectedDate) return [];

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const allSlots = generateSlots(formattedDate, selectedDentist.id);

    // Filter out booked slots
    const bookedSlotIds = appointmentsRef.current
      .filter((appt) => appt.dentist.id === selectedDentist.id && appt.slot.date === formattedDate)
      .map((appt) => appt.slot.id);

    return allSlots.filter((slot) => !bookedSlotIds.includes(slot.id));
  };

  const availableSlots = getAvailableSlots();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "patientName") {
      setPatientName(value);
    } else if (name === "dentist") {
      setSelectedDentist(dentists.find((dentist) => dentist.id === parseInt(value)) || null);
    }
  };

  return (
    <div className={`dentist-app ${darkMode ? "dark-mode" : ""}`}>
      <header className="app-header">
        <h1>Dentist Appointment System</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>
      <ToastContainer />

      <div className="tab-container">
        <button className={activeTab === "book" ? "active" : ""} onClick={() => setActiveTab("book")}>
          Book Appointment
        </button>
        <button className={activeTab === "appointments" ? "active" : ""} onClick={() => setActiveTab("appointments")}>
          Appointments
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "book" && (
          <div className="booking-form">
            <h2>Book an Appointment</h2>
            <div className="form-group">
              <label>Patient Name:</label>
              <input type="text" name="patientName" value={patientName} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Select Dentist:</label>
              <select name="dentist" value={selectedDentist ? selectedDentist.id : ""} onChange={handleInputChange}>
                <option value="">Choose Dentist</option>
                {dentists.map((dentist) => (
                  <option key={dentist.id} value={dentist.id}>
                    {dentist.name} ({dentist.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Date:</label>
              <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} minDate={new Date()} />
            </div>

            <div className="form-group">
              <label>Available Slots:</label>
              <div className="slot-container">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      className={`slot-button ${selectedSlot?.id === slot.id ? "selected" : ""}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.displayTime}
                    </button>
                  ))
                ) : (
                  <p>No slots available.</p>
                )}
              </div>
            </div>

            <button onClick={handleBookAppointment}>Book Appointment</button>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="appointment-list">
            <h2>Appointments</h2>
            {appointments.length === 0 ? (
              <p>No appointments booked yet.</p>
            ) : (
              <ul>
                {appointments.map((appointment) => (
                  <li key={appointment.id}>
                    {appointment.patientName} - {appointment.dentist.name} - {appointment.slot.date} {appointment.slot.displayTime}
                    <button onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DentistAppointmentApp;