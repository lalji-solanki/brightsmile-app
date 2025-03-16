// AppointmentList.tsx
import React from 'react';
import { Appointment } from './interfaces/types';
import "../css/list.css";

interface AppointmentListProps {
  appointments: Appointment[];
  handleCancelAppointment: (appointmentId: number) => void;
  handleReschedule: (appointment: Appointment) => void; // Add this line
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, handleCancelAppointment, handleReschedule }) => {
  return (
    <div className="appointment-list">
      <h2>Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            <div className="appointment-details">
              <div>Name: {appointment.patientName}</div>
              <div>Gender: {appointment.gender}</div>
              <div>Age: {appointment.age}</div>
              <div>Mobile: {appointment.mobile}</div>
              <div>Date: {appointment.slot.date}</div>
              <div>Time: {appointment.slot.displayTime}</div>
            </div>
            <div>
              <button className="reschedule-button"  onClick={() => handleReschedule(appointment)}>Reschedule</button>
              <button className="cancel-button"  onClick={() => handleCancelAppointment(appointment.id)}>Cancel</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;