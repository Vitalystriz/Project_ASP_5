//
// Created by vitaly on 29.04.2026.
//

#ifndef CONSOLEMENU_H
#define CONSOLEMENU_H
#include "IMenu.h"
#include <map>
#include <vector>

class ConsoleMenu : public IMenu {
private:
    std::map<std::string, std::vector<std::string>> mapArgs;

public:
    ConsoleMenu();

    void printMenu();
    std::string nextCommand() override;
    void displayError() override;
    void printResults(std::string message) override;
    void exitMessage() override;
    std::map<std::string, std::vector<std::string>> getArgs() override;

};
#endif
