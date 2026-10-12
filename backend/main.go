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
		log.Println("Error loading .env file")
	}

	secretKey = []byte(os.Getenv("JWT_SECRET"))

	if len(secretKey) < 32 {
		log.Fatal("JWT_SECRET is not set or too short (need 32+ chars)")
	}

	var err error
	connStr := os.Getenv("DATABASE_URL")
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/register", createUser)
	mux.HandleFunc("/login", checkUser)
	mux.HandleFunc("/task", authMiddleware(createTask))
	mux.HandleFunc("/tasks", authMiddleware(showTask))
	mux.HandleFunc("/profile", authMiddleware(getUser))
	mux.HandleFunc("/task/complete", authMiddleware(completeTask))

	log.Println("Server started on :" + port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, withCors(mux)))
}
