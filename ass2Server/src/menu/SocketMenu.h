//
// Created by geras on 18.05.2026.
//

#ifndef SOCKETMENU_H
#define SOCKETMENU_H
#include "IMenu.h"


class SocketMenu : public IMenu {
private:
    std::map<std::string, std::vector<std::string>> mapArgs;
    std::string current_arguments;
    std::string current_command_str;
    std::string output_response;
public:

    SocketMenu();
    void printMenu();
    std::string nextCommand() override;
    void displayError() override;
    void printResults(std::string message) override;
    std::string getFormedResponse();
    void feedRawString(std::string raw_request);
    std::map<std::string, std::vector<std::string>> getArgs() override;
    void exitMessage() override;
};



#endif //SOCKETMENU_H
