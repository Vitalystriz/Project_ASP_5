//
// Created by vitaly on 29.04.2026.
//

#ifndef INITIALIZATION_H
#define INITIALIZATION_H


#include <map>

#include "DataManager.h"
#include "IRequestHandler.h"
#include "command/ICommand.h"
#include "menu/IMenu.h"
#include "App.h"
#include "menu/SocketMenu.h"

class Initialization : public IRequestHandler {
private:
    SocketMenu* menu = nullptr;
    DataManager* data_manager = nullptr;
    App* app = nullptr;
    std::map<std::string, ICommand*> commands_map;
  public:
    Initialization() = default;
    ~Initialization();
    std::map<std::string, ICommand*> createCommandMapForCLIMode(DataManager* dm);
    std::map<std::string, ICommand*> createCommandMapForServerMode(DataManager* dm);
    // void appLaunchForCLIMode();
    void appLaunchForServerMode();
    std::string handleRequest(std::string raw_message) override;
};



#endif //INITIALIZATION_H
