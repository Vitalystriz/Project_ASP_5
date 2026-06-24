//
// Created by vitaly on 02.05.2026.
//

#ifndef DISPLAYERRORCLASS_H
#define DISPLAYERRORCLASS_H

#include "ICommand.h"

class DisplayErrorClass: public ICommand {
public:
    std::string execute(std::map<std::string, std::vector<std::string>> map) override;
};



#endif //DISPLAYERRORCLASS_H
