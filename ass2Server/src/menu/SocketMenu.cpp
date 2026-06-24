
#include "SocketMenu.h"

#include <algorithm> // Check external library
#include <map>
#include <sstream>
#include <utility>
#include <vector>
#include "command/HelpCommand.h"

SocketMenu::SocketMenu() {
    this->mapArgs = std::map<std::string, std::vector<std::string>>();
    printMenu();
}

void SocketMenu::printMenu() {
    this->output_response = "Available commands: POST, GET, PATCH, HELP, EXIT";
}

void SocketMenu::feedRawString(std::string raw_request) {
    this->current_command_str = std::move(raw_request);
}


std::string SocketMenu::nextCommand() {
    std::string line = this->current_command_str;

    if (line.empty()) {
        return "ERROR";
    }

    std::stringstream ss(line);
    std::string command;
    ss >> command;

    std::transform(command.begin(), command.end(), command.begin(), ::toupper);

    mapArgs.clear();

    if (command == "EXIT") return "EXIT";
    if (command == "HELP") return "HELP";

    if (command == "POST" || command == "PATCH" || command=="DELETE") {
        std::string uId;
        if (ss >> uId) {
            std::vector<std::string> pId;
            std::string temp_pId;
            while(ss >> temp_pId) {
                pId.push_back(temp_pId);
            }
            mapArgs[uId] = pId;
        }
        return command;
    }

    if (command == "GET") {
        std::string uId;
        std::string temp_pId;
        if (ss >> uId && ss >> temp_pId) {
            std::vector<std::string> pId;
            pId.push_back(temp_pId);
            mapArgs[uId] = pId;
        }
        return "GET";
    }

    return "ERROR";
}


void SocketMenu::displayError() {
    this->output_response = "Sorry, an error occurred, try enter your command one more time";
}

std::map<std::string, std::vector<std::string> > SocketMenu::getArgs() {
    return this->mapArgs;
}

void SocketMenu::printResults(std::string message) {
    this->output_response = std::move(message);
}

std::string SocketMenu::getFormedResponse() {
    this->output_response.append("\n");
    return this->output_response;
}

void SocketMenu::exitMessage() {
    this->output_response = "Goodbye";
}




