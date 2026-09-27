package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	key := os.Getenv("FISH_API_KEY")
	if key == "" {
		fmt.Println("set FISH_API_KEY")
		os.Exit(1)
	}
	body, _ := json.Marshal(map[string]string{
		"text":            "Wubba lubba dub dub! [laugh]",
		"voice_id":        "d2e75a3e3fd6419893057c02a375a113",
		"model":           "s2.1-pro-free",
		"response_format": "mp3",
	})
	req, _ := http.NewRequest("POST", "https://api.fish.audio/v1/tts", bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+key)
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		b, _ := io.ReadAll(resp.Body)
		panic(fmt.Sprintf("HTTP %d: %s", resp.StatusCode, b))
	}
	out, _ := os.Create("quickstart.mp3")
	defer out.Close()
	io.Copy(out, resp.Body)
	fmt.Println("[OK] wrote quickstart.mp3")
}
