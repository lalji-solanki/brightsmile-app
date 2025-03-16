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
    <div className="flex flex-col items-center p-4">
    <div className="flex space-x-2 mb-4">
      <button
        className={`p-2 rounded-md transition-colors ${
          exportFormat === 'excel'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
        onClick={() => setExportFormat('excel')}
        title="Export as Excel"
      >
        <FaFileExcel className="text-xl" />
      </button>
      <button
        className={`p-2 rounded-md transition-colors ${
          exportFormat === 'pdf'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
        onClick={() => setExportFormat('pdf')}
        title="Export as PDF"
      >
        <FaFilePdf className="text-xl" />
      </button>
    </div>
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
      onClick={exportFormat === 'excel' ? generateExcelReport : generatePdfReport}
    >
      <FaDownload />
      <span>Download {exportFormat === 'excel' ? 'Excel' : 'PDF'}</span>
    </button>
  </div>
  );
};

export default ReportGenerator;