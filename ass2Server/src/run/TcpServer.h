//
// Created by ari on 15/05/2026.
//
#include <string>
#ifndef TCPSERVER_H
#define TCPSERVER_H
#include "IRequestHandler.h"


class TcpServer {
private:
    int port;
    int sock;
    int clientSocket;
    IRequestHandler& handler;


    public:
    TcpServer(int port, IRequestHandler& handler);

    ~TcpServer();

    void start();
    bool acceptClient();
    std::string receiveMessage();
    void sendMessage(const std::string& msg);
    void handleClientCommunication();
    void closeClient();

};



#endif //TCPSERVER_H
