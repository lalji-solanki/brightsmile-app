// DentistApp.tsx
import React, { useState, useEffect, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/global.css";
import "../css/header.css";
import "../css/tab.css";
import BookAppointmentForm from "./BookAppointmentForm";
import AppointmentList from "./AppointmentList";
import { Slot, Appointment } from "./interfaces/types";
import HistoryList from "./HistoryList";

const dentist = { id: 1, name: "Dr. Smith", specialization: "General Dentistry" };

const generateSlots = (date: string): Slot[] => {
    const slots: Slot[] = [];
    for (let hour = 9; hour <= 20; hour++) {
      const time = `${hour < 10 ? "0" + hour : hour}:00`;
      const displayHour = hour > 12 ? hour - 12 : hour;
      const ampm = hour < 12 ? "AM" : "PM";
      const displayTime = `${displayHour}:00 ${ampm}`;
      slots.push({ id: `<span class="math-inline">\{dentist\.id\}\-</span>{date}-${time}`, date, time, displayTime });
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
    const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
    const [history, setHistory] = useState<Appointment[]>([]);

  useEffect(() => {
    try {
      const storedAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
      setAppointments(storedAppointments);
      appointmentsRef.current = storedAppointments;
      const storedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(storedDarkMode);
      if (storedDarkMode) {
        document.body.classList.add('dark-mode');
      }
      const storedHistory = JSON.parse(localStorage.getItem("appointmentHistory") || "[]");
      setHistory(storedHistory);
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast.error("Error loading data. Please try again.");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', String(darkMode));
      if (darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      localStorage.setItem("appointmentHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
      toast.error("Error saving settings.");
    }
  }, [darkMode, history]);

  const saveAppointments = (updatedAppointments: Appointment[]) => {
    try {
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
      setAppointments(updatedAppointments);
      appointmentsRef.current = updatedAppointments;
    } catch (error) {
      console.error("Error saving appointments to localStorage:", error);
      toast.error("Error saving appointments.");
    }
  };

  const handleBookAppointment = () => {
    try {
      if (!patientName || !gender || !age || !mobile || !selectedSlot) {
        toast.error("Please fill in all fields.");
        return;
      }
      if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
        toast.error("Mobile number must be 10 digits.");
        return;
      }
      const newAppointment: Appointment = { id: Date.now(), patientName, gender, age, mobile, slot: selectedSlot! };
      const updatedAppointments = [...appointmentsRef.current, newAppointment];
      saveAppointments(updatedAppointments);
      setPatientName("");
      setGender("");
      setAge(undefined);
      setMobile("");
      setSelectedSlot(null);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("An error occurred while booking. Please try again.");
    }
  };

  const handleCancelAppointment = (appointmentId: number) => {
    try {
      const canceledAppointment = appointments.find((appt) => appt.id === appointmentId);
      if (canceledAppointment) {
        setHistory((prevHistory) => [...prevHistory, canceledAppointment]);
      }
      const updatedAppointments = appointments.filter((appointment) => appointment.id !== appointmentId);
      saveAppointments(updatedAppointments);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("An error occurred while cancelling. Please try again.");
    }
  };

  const getAvailableSlots = () => {
    try {
      if (!selectedDate) return [];
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const allSlots = generateSlots(formattedDate);
      const bookedSlotIds = appointmentsRef.current
        .filter((appt) => appt.slot.date === formattedDate)
        .map((appt) => appt.slot.id);
      return allSlots.filter((slot) => !bookedSlotIds.includes(slot.id));
    } catch (error) {
      console.error("Error getting available slots:", error);
      toast.error("An error occurred while getting slots. Please try again.");
      return [];
    }
  };

  const availableSlots = getAvailableSlots();

  const handleReschedule = (appointment: Appointment) => {
    setRescheduleAppointment(appointment);
    setActiveTab("book");
    setSelectedDate(new Date(appointment.slot.date));
    setPatientName(appointment.patientName);
    setGender(appointment.gender);
    setAge(appointment.age);
    setMobile(appointment.mobile);
  };

  const handleRescheduleAppointmentConfirmed = () => {
    if (rescheduleAppointment && selectedSlot) {
      const rescheduledAppointment = appointments.find(appt => appt.id === rescheduleAppointment.id);
      if(rescheduledAppointment){
        setHistory(prevHistory => [...prevHistory, {...rescheduledAppointment, slot: selectedSlot}]);
      }
      const updatedAppointments = appointments.map((appt) =>
        appt.id === rescheduleAppointment.id ? { ...appt, slot: selectedSlot } : appt
      );
      saveAppointments(updatedAppointments);
      setRescheduleAppointment(null);
      setSelectedSlot(null);
      setPatientName("");
      setGender("");
      setAge(undefined);
      setMobile("");
      toast.success("Appointment rescheduled successfully!");
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
        <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>History</button>
      </div>
      <div className="tab-content">
        {activeTab === "book" && (
          <BookAppointmentForm
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            availableSlots={availableSlots}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            patientName={patientName}
            setPatientName={setPatientName}
            gender={gender}
            setGender={setGender}
            age={age}
            setAge={setAge}
            mobile={mobile}
            setMobile={setMobile}
            handleBookAppointment={rescheduleAppointment ? handleRescheduleAppointmentConfirmed : handleBookAppointment}
            isReschedule={!!rescheduleAppointment}
          />
        )}
        {activeTab === "appointments" && (
          <AppointmentList appointments={appointments} handleCancelAppointment={handleCancelAppointment} handleReschedule={handleReschedule} />
        )}
        {activeTab === "history" && (
          <HistoryList history={history} />
        )}
      </div>
    </div>
  );
};

export default DentistAppointmentApp;