import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/DentistApp.css";

interface Slot {
  id: string;
  date: string;
  time: string;
  displayTime: string;
}

interface Appointment {
  id: number;
  patientName: string;
  gender: string;
  age: number;
  mobile: string;
  slot: Slot;
}

const dentist = { id: 1, name: "Dr.Smith", specialization: "General Dentistry" };

const generateSlots = (date: string): Slot[] => {
  const slots: Slot[] = [];
  for (let hour = 9; hour <= 20; hour++) {
    const time = `${hour < 10 ? "0" + hour : hour}:00`;
    const displayHour = hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? "AM" : "PM";
    const displayTime = `${displayHour}:00 ${ampm}`;
    slots.push({ id: `${dentist.id}-${date}-${time}`, date, time, displayTime });
  }
  return slots;
};

const DentistAppointmentApp: React.FC = () => {
  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [mobile, setMobile] = useState("");
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
    if (!patientName || !gender || !age || !mobile || !selectedSlot) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      toast.error("Mobile number must be 10 digits.");
      return;
    }
    const newAppointment: Appointment = { id: Date.now(), patientName, gender, age, mobile, slot: selectedSlot };
    const updatedAppointments = [...appointmentsRef.current, newAppointment];
    saveAppointments(updatedAppointments);
    setPatientName("");
    setGender("");
    setAge(undefined);
    setMobile("");
    setSelectedSlot(null);
    toast.success("Appointment booked successfully!");
  };

  const handleCancelAppointment = (appointmentId: number) => {
    const updatedAppointments = appointments.filter((appointment) => appointment.id !== appointmentId);
    saveAppointments(updatedAppointments);
  };

  const getAvailableSlots = () => {
    if (!selectedDate) return [];
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const allSlots = generateSlots(formattedDate);
    const bookedSlotIds = appointmentsRef.current
      .filter((appt) => appt.slot.date === formattedDate)
      .map((appt) => appt.slot.id);
    return allSlots.filter((slot) => !bookedSlotIds.includes(slot.id));
  };

  const availableSlots = getAvailableSlots();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "patientName") setPatientName(value);
    else if (name === "gender") setGender(value);
    else if (name === "age") setAge(value ? parseInt(value) : undefined);
    else if (name === "mobile") {
      if (value.length <= 10) {
        setMobile(value);
      }
    }
  };

  return (
    <div className={`dentist-app ${darkMode ? "dark-mode" : ""}`}>
      <header className="app-header">
        <div className="header-content">
          <div className="app-title">Dentist Appointment</div>
          <div className="app-subtitle">Dr. Smith</div>
        </div>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>
      <ToastContainer />
      <div className="tab-container">
        <button className={activeTab === "book" ? "active" : ""} onClick={() => setActiveTab("book")}>Book</button>
        <button className={activeTab === "appointments" ? "active" : ""} onClick={() => setActiveTab("appointments")}>Appointments</button>
      </div>
      <div className="tab-content">
        {activeTab === "book" && (
          <div className="booking-form">
            <h2>Book Appointment</h2>
            <div className="horizontal-form">
              <div className="form-group">
                <label>Name:</label>
                <input type="text" name="patientName" value={patientName} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Gender:</label>
                <input type="text" name="gender" value={gender} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input type="number" name="age" value={age || ""} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Mobile:</label>
                <input type="tel" name="mobile" value={mobile} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Date:</label>
                <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} minDate={new Date()} />
              </div>
            </div>
            <div className="form-group">
              <label>Slots:</label>
              <div className="slot-container">
                {availableSlots.length > 0 ? (availableSlots.map((slot) => (<button key={slot.id} className={`slot-button ${selectedSlot?.id === slot.id ? "selected" : ""}`} onClick={() => setSelectedSlot(slot)}>{slot.displayTime}</button>))
                ) : (<p>No slots.</p>)}
              </div>
            </div>
            <button className="book-button" onClick={handleBookAppointment}>
              Book Appointment
            </button>
          </div>
        )}
        {activeTab === "appointments" && (
          <div className="appointment-list">
            <h2>Appointments</h2>
            {appointments.length === 0 ? (<p>None booked.</p>) : (<ul>{appointments.map((appointment) => (<li key={appointment.id}>{appointment.patientName} - {dentist.name} - {appointment.slot.date} {appointment.slot.displayTime} <button onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button></li>))}</ul>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default DentistAppointmentApp;