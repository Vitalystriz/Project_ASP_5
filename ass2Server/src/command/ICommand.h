//
// Created by vitaly on 29.04.2026.
//

#ifndef ICOMMAND_H
#define ICOMMAND_H
#include <iostream>
#include <map>
#include <vector>

class ICommand {
public:
    virtual ~ICommand() = default;

    virtual std::string execute(std::map<std::string, std::vector<std::string>> map) = 0;

};
#endif //ICOMMAND_H
