//
// Created by vitaly on 29.04.2026.
//

#ifndef HELPCOMMAND_H
#define HELPCOMMAND_H
#include "ICommand.h"
class HelpCommand: public ICommand {
public:
    std::string execute(std::map<std::string, std::vector<std::string>> map) override;
    void execute();
};
#endif //HELPCOMMAND_H
