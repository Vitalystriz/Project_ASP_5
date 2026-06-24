//
// Created by geras on 20.05.2026.
//

#ifndef PATCHCOMMAND_H
#define PATCHCOMMAND_H

#include <map>
#include <vector>
#include "ICommand.h"
#include "DataManager.h"

class PatchCommand: public ICommand{
private:
    DataManager* dataManager;
    std::map <std::string, std::vector<std::string>> map;
public:
    explicit PatchCommand(DataManager* dm);
    std::map<std::string, std::vector<std::string>> getArgs();
    std::string execute(std::map<std::string, std::vector<std::string>> map) override;

};



#endif //PATCHCOMMAND_H
