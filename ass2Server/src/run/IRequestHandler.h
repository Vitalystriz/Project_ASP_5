//
// Created by geras on 18.05.2026.
//

#ifndef IREQUESTHANDLER_H
#define IREQUESTHANDLER_H
#include <iostream>
#include <map>
#include <vector>
class IRequestHandler {
public:
    virtual std::string handleRequest(std::string raw_buffer) = 0;
};
#endif //IREQUESTHANDLER_H
