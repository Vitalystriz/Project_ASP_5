//
// Created by vitaly on 28.04.2026.
//

#ifndef IMENU_H
#define IMENU_H

#include<string>
#include<iostream>
#include <map>
#include <vector>

class IMenu {
public:
    virtual ~IMenu() = default;

    virtual std::string nextCommand() = 0 ;
    virtual void displayError() = 0;
    virtual void exitMessage() = 0;
    virtual void printResults(std::string message) = 0;
    virtual std::map<std::string, std::vector<std::string>> getArgs() = 0;
};



#endif //IMENU_H
