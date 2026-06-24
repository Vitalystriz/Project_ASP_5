//
// Created by vitaly on 29.04.2026.
//

#ifndef RECOMMENDCOMMAND_H
#define RECOMMENDCOMMAND_H
#include <iosfwd>
#include <map>

#include "ICommand.h"
#include <map>
#include <vector>
#include <bits/stl_vector.h>

#include "DataManager.h"

class RecommendCommand: public ICommand {
private:
    DataManager* dataManager;
    std::map <std::string, std::vector<std::string>> map;
public:
    RecommendCommand(DataManager* dm);
    std::string execute(std::map<std::string, std::vector<std::string>> map) override;
    std::map<std::string, std::vector<std::string>> getArgs();
};



#endif //RECOMMENDCOMMAND_H
