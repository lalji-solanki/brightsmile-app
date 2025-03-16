// HistoryList.tsx
import React from 'react';
import { Appointment } from './interfaces/types';
import ReportGenerator from './ReportGenerator';
import "../css/list.css";

interface HistoryListProps {
  history: Appointment[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  return (
    <div className="appointment-list">
      <h2>Appointment History</h2>
      <ReportGenerator history={history} />
      <ul>
        {history.map((appointment) => (
          <li key={appointment.id}>
            <div className="appointment-details">
              <div>Name: {appointment.patientName}</div>
              <div>Gender: {appointment.gender}</div>
              <div>Age: {appointment.age}</div>
              <div>Mobile: {appointment.mobile}</div>
              <div>Date: {appointment.slot.date}</div>
              <div>Time: {appointment.slot.displayTime}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;