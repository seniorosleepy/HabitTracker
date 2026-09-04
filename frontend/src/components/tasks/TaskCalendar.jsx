import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

function TaskCalendar({ selectedDate, onDateSelect }) {
  return (
    <DayPicker
      mode="single"
      selected={selectedDate}
      onSelect={onDateSelect}
    />
  );
}

export default TaskCalendar;