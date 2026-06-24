//
// Created by vitaly on 29.04.2026.
//

#ifndef ADDCOMMAND_H
#define ADDCOMMAND_H
#include <map>
#include <vector>
#include "ICommand.h"
#include "DataManager.h"

class AddCommand: public ICommand{
private:
    DataManager* dataManager;
    std::map <std::string, std::vector<std::string>> map;
public:
    explicit AddCommand(DataManager* dm);
    std::map<std::string, std::vector<std::string>> getArgs();
    std::string execute(std::map<std::string, std::vector<std::string>> map) override;

};



#endif //ADDCOMMAND_H
