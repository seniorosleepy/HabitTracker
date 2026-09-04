package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"

	_ "github.com/lib/pq"
)

var db *sql.DB

var secretKey []byte

func main() {
	er := godotenv.Load()
	if er != nil {
		log.Fatal("Error loading .env file")
	}

	secretKey = []byte(os.Getenv("JWT_SECRET"))

	var err error
	connStr := "postgres://postgres:nik7142009@localhost:5432/habittrackerdb?sslmode=disable&client_encoding=UTF8"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/register", createUser)
	mux.HandleFunc("/login", checkUser)
	mux.HandleFunc("/task", authMiddleware(createTask))
	mux.HandleFunc("/tasks", authMiddleware(showTask))
	mux.HandleFunc("/profile", authMiddleware(getUser))
	mux.HandleFunc("/task/complete", authMiddleware(completeTask))

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", withCors(mux)))
}
