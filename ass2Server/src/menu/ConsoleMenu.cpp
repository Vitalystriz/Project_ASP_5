//
// Created by vitaly on 28.04.2026.
//


#include <sstream>
#include <iostream>
#include <map>
#include <vector>
#include "IMenu.h"
#include "command/HelpCommand.h"
#include "ConsoleMenu.h"

    ConsoleMenu::ConsoleMenu() {
        this->mapArgs = std::map<std::string, std::vector<std::string>>();
        printMenu();
    }

    void ConsoleMenu::printMenu() {
        HelpCommand help;
        help.execute();
    }

std::string ConsoleMenu::nextCommand() { // -> std::string command
        std::string line;

        if (!std::getline(std::cin, line) || line.empty()) {
            return "error";
        }

        std::stringstream ss(line);
        std::string command;

        ss >> command;
        mapArgs.clear();

        if (command == "exit") return "exit";

        if (command == "help") return "help";

        if (command == "add") {
            std::string uId;
            std::vector<std::string> pId;
            if (ss >> uId) {
                std::string temp_pId;
                while(ss >> temp_pId) {
                    pId.push_back(temp_pId);
                }
                mapArgs[uId] = pId;
            }
            return "add";
        }

        if (command == "recommend") {
            std::string uId;
            std::string temp_pId;
            std::vector<std::string> pId;
            if (ss >> uId && ss >> temp_pId) {
                pId.push_back(temp_pId);
                mapArgs[uId] = pId;
            }
            return "recommend";
        }


        return "error";
    }

    void ConsoleMenu::displayError() {
        std::cout << "Sorry, an error occurred" << std::endl;
        std::cout << "Please, try enter your command one more time" << std::endl;
    }

    void ConsoleMenu::exitMessage() {
        std::cout << "Goodbye" << std::endl;
    }

    std::map<std::string, std::vector<std::string> > ConsoleMenu::getArgs() {
        return mapArgs;
    }

    void ConsoleMenu::printResults(std::string message) {
        std::cout << message << std::endl;
    }

