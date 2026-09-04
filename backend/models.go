package main

type User struct {
	ID       int    `json:"id,omitempty"`
	Username string `json:"username"`
	Password string `json:"password,omitempty"`
	Email    string `json:"email"`
}

type RegisterResponse struct {
	ID       int    `json:"id"`
	Token    string `json:"token"`
	Username string `json:"username"`
}

type Habit struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type Task struct {
	ID          int     `json:"id"`
	UserID      int     `json:"user_id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	DueDate     *string `json:"due_date"`
	Completed   bool    `json:"completed"`
}
