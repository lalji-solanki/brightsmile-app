// BookAppointmentForm.tsx
import React, { ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import { Slot } from "./interfaces/types";
import "../css/form.css";

interface BookAppointmentFormProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  availableSlots: Slot[];
  selectedSlot: Slot | null;
  setSelectedSlot: (slot: Slot | null) => void;
  patientName: string;
  setPatientName: (name: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  age: number | undefined;
  setAge: (age: number | undefined) => void;
  mobile: string;
  setMobile: (mobile: string) => void;
  handleBookAppointment: () => void;
  isReschedule?: boolean;
}

const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({
  selectedDate,
  setSelectedDate,
  availableSlots,
  selectedSlot,
  setSelectedSlot,
  patientName,
  setPatientName,
  gender,
  setGender,
  age,
  setAge,
  mobile,
  setMobile,
  handleBookAppointment,
  isReschedule = false,
}) => {
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
const handleGenderChange = (selectedGender: string) => {
    setGender(selectedGender);
  };
  return (
    <div className="booking-form">
      <h2>{isReschedule ? "Reschedule Appointment" : "Book Appointment"}</h2>
      <div className="horizontal-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="patientName" value={patientName} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select value={gender} onChange={(e) => handleGenderChange(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
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
            <p>No slots.</p>
          )}
        </div>
      </div>
      <button className="book-button" onClick={handleBookAppointment}>
        {isReschedule ? "Confirm Reschedule" : "Book Appointment"}
      </button>
    </div>
  );
};

export default BookAppointmentForm;