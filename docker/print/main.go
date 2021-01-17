package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"time"
)

func main() {
	listener, err := net.Listen("tcp", "0.0.0.0:4002")
	if err != nil {
		log.Fatal(err)
	}

	conn, err := listener.Accept()
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	conn.SetReadDeadline(time.Now().Add(3 * time.Second))
	data, err := ioutil.ReadAll(conn)
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("data received:")
	fmt.Println(string(data))
}
