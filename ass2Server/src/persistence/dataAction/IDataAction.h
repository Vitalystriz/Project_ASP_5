

#ifndef IDATAACTION_H
#define IDATAACTION_H
#include <map>
#include <vector>
#include <iostream>

class DataManager;
class IDataAction {
public:
    virtual ~IDataAction() = default;
    virtual void execute(DataManager* dataManager) = 0;
    virtual void displayError() = 0;
};


#endif //IDATAACTION_H
