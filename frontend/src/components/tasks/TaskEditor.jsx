import { useRef, useState, useEffect } from "react";
import CloseIcon from "../icons/CloseIcon";
import CalendarIcon from "../icons/CalendarIcon";
import SendIcon from "../icons/SendIcon";
import TaskCalendar from "./TaskCalendar";
import CloseDateIcon from "../icons/CloseDateIcon";
import { API_URL } from "../../config";

function TaskEditor({
  onClose,
  onTaskCreated,
  dataFormater,
  isCalendarOpen,
  setIsCalendarOpen,
  setMessage,
  sendMessage,
}) {
  const getTodayString = () => new Date().toISOString().split("T")[0];
  const calendarWrapperRef = useRef(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: getTodayString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!isCalendarOpen) return;

    const handleClickOutside = (event) => {
      if (
        calendarWrapperRef.current &&
        !calendarWrapperRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  const CreateTask = async (e) => {
    e.preventDefault();
    if (taskData.title.trim().length < 3) {
      const text = "The length of the name cannot be less than 3";
      setMessage(text);
      sendMessage();
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      const text = "You are not logged in!";
      setMessage(text);
      sendMessage();
      return;
    }

    const taskPayload = {
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.due_date === "" ? null : taskData.due_date,
      completed: false,
    };

    try {
      const response = await fetch(`${API_URL}/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskPayload),
      });

      if (response.ok) {
        setTaskData({ title: "", description: "", due_date: getTodayString() });
        const text = "Task created successfully";
        setMessage(text);
        sendMessage();
        onTaskCreated();
        onClose();
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="task-editor open">
      <div className="task-editor-container">
        <div className="task-editor-inputs">
          <input
            type="text"
            name="title"
            value={taskData.title}
            placeholder="Title"
            onChange={handleChange}
            className="title-input"
            autoComplete="off"
          />
          <input
            type="text"
            name="description"
            value={taskData.description}
            placeholder="Description"
            onChange={handleChange}
            className="description-input"
            autoComplete="off"
          />
        </div>
        <div className="task-editor-buttons">
          <div
            className="data-icon-container"
            onClick={() => {
              isCalendarOpen
                ? setIsCalendarOpen(false)
                : setIsCalendarOpen(true);
            }}
          >
            <CalendarIcon />
            <p>
              {!taskData.due_date ? "Date" : dataFormater(taskData.due_date)}
            </p>
            {taskData.due_date && (
              <button
                className="reset-date-btn"
                onClick={() => {
                  setTaskData((prev) => ({
                    ...prev,
                    due_date: "",
                  }));
                }}
              >
                <CloseDateIcon />
              </button>
            )}
          </div>
          <div className="editor-buttons">
            <button onClick={onClose}>
              <CloseIcon />
            </button>
            <button onClick={CreateTask} className="create-button">
              <SendIcon />
            </button>
          </div>
        </div>
        {isCalendarOpen && (
          <div className="calendar-overlay">
            <div className="calendar-popup" ref={calendarWrapperRef}>
              <TaskCalendar
                selectedDate={taskData.due_date}
                onDateSelect={(newDate) => {
                  if (newDate != undefined) {
                    const year = newDate.getFullYear();
                    const month = String(newDate.getMonth() + 1).padStart(
                      2,
                      "0",
                    );
                    const day = String(newDate.getDate()).padStart(2, "0");
                    const formattedDate = `${year}-${month}-${day}`;

                    setTaskData((prev) => ({
                      ...prev,
                      due_date: formattedDate,
                    }));
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskEditor;
