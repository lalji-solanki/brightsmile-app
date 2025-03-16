// ReportGenerator.tsx
import React, { useState } from 'react';
import { Appointment } from './interfaces/types';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import { FaDownload, FaFileExcel, FaFilePdf } from 'react-icons/fa'; // Install react-icons: npm install react-icons

interface ReportGeneratorProps {
  history: Appointment[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ history }) => {
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');

  const generateExcelReport = () => {
    try {
      if (history.length === 0) {
        toast.info("No history to export.");
        return;
      }

      const data = history.map((appointment) => ({
        Name: appointment.patientName,
        Gender: appointment.gender,
        Age: appointment.age,
        Mobile: appointment.mobile,
        Date: appointment.slot.date,
        Time: appointment.slot.displayTime,
      }));

      const workbook = utils.book_new();
      const worksheet = utils.json_to_sheet(data);
      utils.book_append_sheet(workbook, worksheet, "Appointment History");

      writeFile(workbook, "appointment_history.xlsx");
      toast.success("Excel report generated successfully!");
    } catch (error) {
      console.error("Error generating Excel report:", error);
      toast.error("Error generating Excel report. Please try again.");
    }
  };

  const generatePdfReport = () => {
    try {
      if (history.length === 0) {
        toast.info("No history to export.");
        return;
      }

      const doc = new jsPDF();
      doc.text("Appointment History", 10, 10);

      let y = 20;
      history.forEach((appointment) => {
        doc.text(`Name: ${appointment.patientName}`, 10, y);
        y += 7;
        doc.text(`Gender: ${appointment.gender}`, 10, y);
        y += 7;
        doc.text(`Age: ${appointment.age?.toString() || ""}`, 10, y);
        y += 7;
        doc.text(`Mobile: ${appointment.mobile}`, 10, y);
        y += 7;
        doc.text(`Date: ${appointment.slot.date}`, 10, y);
        y += 7;
        doc.text(`Time: ${appointment.slot.displayTime}`, 10, y);
        y += 10;
      });

      doc.save("appointment_history.pdf");
      toast.success("PDF report generated successfully!");
    } catch (error) {
      console.error("Error generating PDF report:", error);
      toast.error("Error generating PDF report. Please try again.");
    }
  };

  return (
    <div className="report-generator">
      <div className="report-options">
        <button
          className={`report-icon ${exportFormat === 'excel' ? 'selected' : ''}`}
          onClick={() => setExportFormat('excel')}
          title="Export as Excel"
        >
          <FaFileExcel />
        </button>
        <button
          className={`report-icon ${exportFormat === 'pdf' ? 'selected' : ''}`}
          onClick={() => setExportFormat('pdf')}
          title="Export as PDF"
        >
          <FaFilePdf />
        </button>
      </div>
      {exportFormat === 'excel' ? (
        <button className="export-button" onClick={generateExcelReport}>
          <FaDownload/>
        </button>
      ) : (
        <button className="export-button" onClick={generatePdfReport}>
          <FaDownload/>
        </button>
      )}
    </div>
  );
};

export default ReportGenerator;