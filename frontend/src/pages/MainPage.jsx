import "../App.css";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import TaskEditor from "../components/tasks/TaskEditor";
import MainScreen from "../components/layout/MainScreen";
import AddTask from "../components/tasks/AddTask";
import PlusIcon from "../components/icons/PlusIcon";
import CloseIcon from "../components/icons/CloseIcon";
import { API_URL } from "../config";

import { useEffect, useRef, useState } from "react";

function MainPage({ setAuth }) {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 750,
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTaskEditorOpen, setIsTaskEditorOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token missing");
      handleLogout();
      return;
    }

    fetch(`${API_URL}/tasks`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          handleLogout();
          throw new Error("The token is invalid");
        } else if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Assigned tasks:", data);
        setTasks(Array.isArray(data) ? data : []);
      })
      .catch((error) =>
        console.error("An error occurred while retrieving tasks:", error),
      );
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const makeCompleted = async (taskId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}//task/complete`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: taskId }),
      });
      if (response.ok) {
        const text = "The task has been successfully completed!";
        fetchTasks();
        sendMessage();
        setMessage(text);
        console.log("The task has been successfully updated!");
      } else {
        console.error("The server returned an error:", response.status);
      }
    } catch (error) {
      console.error("The network error:", error);
    }
  };

  const sendMessage = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return "";

    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const endOfRange = new Date(today);
    endOfRange.setDate(today.getDate() + 6);
    endOfRange.setHours(23, 59, 59, 999);

    if (date.getTime() === today.getTime()) {
      return "Today";
    }
    if (date.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    }

    if (date >= today && date <= endOfRange) {
      return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(date);
    }

    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
    })
      .format(date)
      .replace(".", "");
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 750px)");

    const handleBreakpointChange = (e) => {
      setIsSidebarOpen(e.matches);
    };
    mediaQuery.addEventListener("change", handleBreakpointChange);
    return () =>
      mediaQuery.removeEventListener("change", handleBreakpointChange);
  }, []);

  function handleLogout() {
    setAuth(false);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setTasks([]);
  }

  return (
    <div
      className={`main-container ${isSidebarOpen ? "sidebar-open" : ""} ${isCalendarOpen ? "calendar-open" : ""}`}
    >
      <Header onMenuClick={setIsSidebarOpen} isOpen={isSidebarOpen} />
      <div className="main-wrapper">
        <Sidebar
          isOpen={isSidebarOpen}
          logout={handleLogout}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="list-editor-container">
          <AddTask
            isOpen={isTaskEditorOpen}
            onOpen={() => setIsTaskEditorOpen(true)}
            tasksCount={tasks.length}
          />

          {tasks.length === 0 ? (
            isTaskEditorOpen ? (
              <TaskEditor
                onClose={() => setIsTaskEditorOpen(false)}
                onTaskCreated={fetchTasks}
                dataFormater={formatDueDate}
                isCalendarOpen={isCalendarOpen}
                setIsCalendarOpen={setIsCalendarOpen}
                setMessage={setMessage}
                sendMessage={sendMessage}
              />
            ) : (
              <>
                <button
                  className="add-task"
                  onClick={() => setIsTaskEditorOpen(true)}
                >
                  <PlusIcon />
                  <h3 className="add-task-title">Create a Task</h3>
                </button>
                <MainScreen />
              </>
            )
          ) : (
            <div className="tasks-list-container">
              {tasks.map((task) => (
                <div key={task.id} className="task-row">
                  <input
                    type="checkbox"
                    onChange={() => makeCompleted(task.id)}
                    className="task-checkbox"
                  />
                  <div className="task-data">
                    <h2 className="task-title">{task.title}</h2>
                    <h3 className="task-description">{task.description}</h3>
                    <h2 className="task-due_date">
                      {formatDueDate(task.due_date)}
                    </h2>
                  </div>
                </div>
              ))}

              {isTaskEditorOpen ? (
                <TaskEditor
                  onClose={() => setIsTaskEditorOpen(false)}
                  onTaskCreated={fetchTasks}
                  dataFormater={formatDueDate}
                  isCalendarOpen={isCalendarOpen}
                  setIsCalendarOpen={setIsCalendarOpen}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                />
              ) : (
                <button
                  className="add-task"
                  onClick={() => setIsTaskEditorOpen(true)}
                >
                  <PlusIcon />
                  <h3 className="add-task-title">Create a task</h3>
                </button>
              )}
            </div>
          )}
        </div>
        {message && (
          <div className="toast-notification">
            <h2>{message}</h2>
            <div className="toast-buttons">
              <p>Cancel</p>
              <button
                onClick={() => {
                  setMessage("");
                }}
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
