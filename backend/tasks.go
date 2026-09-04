package main

import (
	"encoding/json"
	"net/http"
)

func createTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method is not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	var t Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("INSERT INTO task (user_id, title, description, due_date, completed) VALUES ($1, $2, $3, $4, $5)",
		userID, t.Title, t.Description, t.DueDate, t.Completed)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func showTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method is not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	var t Task
	tasks := []Task{}

	rows, err := db.Query("SELECT id, user_id, title, description, due_date, completed FROM task WHERE user_id = $1 AND completed = false", userID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&t.ID, &t.UserID, &t.Title, &t.Description, &t.DueDate, &t.Completed)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		tasks = append(tasks, t)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

func completeTask(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method is not alllowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	var t Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("UPDATE task SET completed = true WHERE id = $1 AND user_id = $2",
		t.ID, userID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
