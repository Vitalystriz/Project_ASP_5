//
// Created by vitaly on 28.04.2026.
//

#ifndef APP_H
#define APP_H

#include <map>
#include <string>
#include "menu/IMenu.h"


#include "command/ICommand.h"


class App {
    private:
        int** matrix = nullptr;
        IMenu* menu;
        std::map<std::string, ICommand*> commands_map{};
    public:
        explicit App(IMenu* menu, std::map<std::string, ICommand*> map);
        void runOnce();
        void run();
};





#endif //APP_H
