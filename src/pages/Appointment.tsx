import { Typography } from "@mui/material";

export default function Appointment() {
//   const [date, setDate] = useState<dayjs.Dayjs | null>(null);
//   const [timeSlot, setTimeSlot] = useState("");
console.log('Appointment component rendered');
  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
  ];

  return (
    <div className="p-4">
      <Typography variant="h6">Book an Appointment</Typography>
    </div>
  );
}
