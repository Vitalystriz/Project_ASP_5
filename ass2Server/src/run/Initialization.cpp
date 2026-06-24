//
// Created by vitaly on 29.04.2026.
//

#include "Initialization.h"
#include <map>
#include "command/ICommand.h"
#include "App.h"
#include "menu/ConsoleMenu.h"
#include "command/HelpCommand.h"
#include "command/AddCommand.h"
#include "command/DisplayErrorClass.h"
#include "command/RecommendCommand.h"
#include "LoadingData.h"
#include "command/DeleteCommand.h"
#include "command/PatchCommand.h"
#include "menu/SocketMenu.h"


std::map<std::string, ICommand*> Initialization::createCommandMapForCLIMode(DataManager* dm) {
    std::map<std::string, ICommand*> commands; // fix magic numbers trouble - done

    commands["error"] = new DisplayErrorClass();
    commands["help"] = new HelpCommand();
    commands["add"] = new AddCommand(dm);
    commands["recommend"] = new RecommendCommand(dm);
    commands["exit"] = nullptr;

    return commands;
}
// TODO CHANGE CLASS NAME
std::map<std::string, ICommand *> Initialization::createCommandMapForServerMode(DataManager *dm) {
    std::map<std::string, ICommand*> commands;

    commands["ERROR"] = new DisplayErrorClass();
    commands["HELP"] = new HelpCommand();
    commands["POST"] = new AddCommand(dm);
    commands["GET"] = new RecommendCommand(dm);
    commands["PATCH"] = new PatchCommand(dm);
    commands["DELETE"] = new DeleteCommand(dm);
    commands["EXIT"] = nullptr;

    return commands;
}

std::string Initialization::handleRequest(std::string raw_message) {
    this->menu->feedRawString(raw_message);
    this->app->runOnce();
    return this->menu->getFormedResponse();

}

void Initialization::appLaunchForServerMode() {
    this->menu= new SocketMenu();
    this->data_manager= new DataManager();

    LoadingData loadingData;
    loadingData.load(this->data_manager);


    this->commands_map = createCommandMapForServerMode(this->data_manager);
    this->app = new App(menu, commands_map);

    // Initialization only without calling for run

}



// void Initialization::appLaunchForCLIMode() {
//
//     IMenu* menu = new ConsoleMenu();
//     auto* dataManager = new DataManager();
//
//     LoadingData loadingData;
//     loadingData.load(dataManager);
//
//
//     std::map<std::string, ICommand*> commands=  createCommandMapForCLIMode(dataManager);
//
//     App app(menu, commands);
//
//
//     app.run();
//
//
//     for (auto const& [key, val] : commands) {
//         delete val;
//     }
//     delete menu;
//     delete dataManager;
// }

Initialization::~Initialization() {
    for (auto const& [key, val] : this->commands_map) {
        if (val != nullptr) {
            delete val;
        }
    }
    delete this->app;
    delete this->menu;
    delete this->data_manager;
}