//
// Created by ari on 15/05/2026.
//
#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>


#include "TcpServer.h"

#include "command/HelpCommand.h"


using namespace std;

TcpServer::TcpServer(int port, IRequestHandler& handler)
    : port(port), handler(handler), sock(-1), clientSocket(-1) {
}


void TcpServer::start() {



    sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
        return;
    }

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);

    if (bind(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error binding socket");
        return;
    }

    if (listen(sock, 5) < 0) {
        perror("error listening to a socket");

    }


    while (true) {
        cout << "Waiting for a new client connection..." << endl;

        if (acceptClient()) {

            // HelpCommand help_command;
            // std::map<std::string, std::vector<std::string>> map;
            // sendMessage(help_command.execute(map));

            handleClientCommunication();

        } else {
            usleep(100000);
        }
    }

}
bool TcpServer::acceptClient() {
    struct sockaddr_in client_sin;
    unsigned int addr_len = sizeof(client_sin);
     clientSocket = accept(sock,  (struct sockaddr *) &client_sin,  &addr_len);

    if (clientSocket < 0) {
        perror("error accepting client");
        return false;
    }
    return true;


}
std::string TcpServer::receiveMessage() {
    char buffer[4096] ={0} ;
    int expected_data_len = sizeof(buffer) - 1;
    int read_bytes = recv(clientSocket, buffer, expected_data_len, 0);
    if (read_bytes == 0) {
        return "";
        // connection is closed
    }
    else if (read_bytes < 0) {
        return "";
        // error
    }

    return std::string(buffer);


}
void TcpServer::sendMessage(const std::string& msg) {
    int sent_bytes = send(clientSocket, msg.c_str(), msg.length(), 0);

    if (sent_bytes < 0) {
        perror("error sending to client");
    }

}

// Main communication loop
void TcpServer::handleClientCommunication() {
    while (true) {
        //read  request
        std::string raw_request = receiveMessage();

        // Break if disconnected or error
        if (raw_request.empty()) {
            break;
        }

        //pass to app logic and get response
        std::string final_response = handler.handleRequest(raw_request);

        //Send response back
        sendMessage(final_response);
    }


    closeClient();
}

void TcpServer::closeClient() {
    if(clientSocket != -1) {
        close(clientSocket);
    }
    clientSocket = -1;


}
TcpServer::~TcpServer() {

    if (clientSocket != -1) {
        close(clientSocket);
    }
    if (sock != -1) {
        close(sock);
    }
}