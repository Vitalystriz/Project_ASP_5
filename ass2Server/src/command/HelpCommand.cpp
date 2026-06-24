#include "ICommand.h"
//
// Created by vitaly on 29.04.2026.
//
#include "HelpCommand.h"

    std::string HelpCommand::execute(std::map<std::string, std::vector<std::string>> map) {
        execute();
        std::string response;
        response.append("--- Recommendation System CLI ---");
        response.append("\n");
        response.append("Available commands:");
        response.append("\n");
        response.append("- HELP");
        response.append("\n");
        response.append("- POST <userId> <productId1> <productId2> ...");
        response.append("\n");
        response.append("- PATCH <userId> <productId1> <productId2> ...");
        response.append("\n");
        response.append("- GET <userId> <productId>");
        response.append("\n");
        response.append("- DELETE <userId> <productId1> <productId2> ...");
        response.append("\n");
        response.append("---------------------------------");
        return response;
    }
    void HelpCommand::execute() {

        std::cout << "--- Recommendation System CLI ---" << std::endl;
        std::cout << "Available commands:" << std::endl;
        std::cout << "- help" << std::endl;
        std::cout << "- add <userId> <productId1> <productId2> ..." << std::endl;
        std::cout << "- recommend <userId> <productId>" << std::endl;
        std::cout << "- exit" << std::endl;
        std::cout << "---------------------------------" << std::endl;
    }




