package main

import (
	"encoding/json"
	"net/http"
	"time"
)

type DataResponse struct {
	Result        string  `json:"result"`
	ExecutionTime float64 `json:"executionTime"`
}

func main() {
	http.HandleFunc("/proses", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")

		text := r.URL.Query().Get("text")
		metode := r.URL.Query().Get("metode")

		var hasil string
		iterations := 100000 // Konsisten 100rb kali untuk akurasi

		start := time.Now()
		for i := 0; i < iterations; i++ {
			if metode == "rekursi" {
				hasil = ReverseRecursive(text, len(text)-1)
			} else {
				hasil = ReverseIterative(text)
			}
		}
		durasi := float64(time.Since(start).Nanoseconds()) / 1e6 // Konversi ke ms

		json.NewEncoder(w).Encode(DataResponse{
			Result:        hasil,
			ExecutionTime: durasi,
		})
	})

	println("Server berjalan di: http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}

func ReverseIterative(str string) string {
	var output string
	n := len(str)

	for i := n - 1; i >= 0; i-- {
		output = output + string(str[i])
	}

	return output
}

func ReverseRecursive(str string, idx int) string {
	if idx < 0 {
		return ""
	}

	return string(str[idx]) + ReverseRecursive(str, idx-1)
}
