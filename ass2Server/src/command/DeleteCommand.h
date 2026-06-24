//
// Created by geras on 20.05.2026.
//

#ifndef DELETECOMMAND_H
#define DELETECOMMAND_H

#include <map>
#include <vector>
#include "ICommand.h"
#include "DataManager.h"

class DeleteCommand : public ICommand{
private:
    DataManager* dataManager;
    std::map <std::string, std::vector<std::string>> map;
public:
    explicit DeleteCommand(DataManager* dm);
    std::map<std::string, std::vector<std::string>> getArgs();
    std::string execute(std::map<std::string, std::vector<std::string>> map) override;
};



#endif //DELETECOMMAND_H
