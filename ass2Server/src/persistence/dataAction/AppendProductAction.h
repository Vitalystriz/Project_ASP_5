//
// Created by vitaly 05.05.2026.
//

#ifndef APPENDPRODUCTACTION_H
#define APPENDPRODUCTACTION_H

#include "IDataAction.h"
#include <vector>
#include <set>

class AppendProductAction : public IDataAction {
private:
    std::vector<std::string> products;
    std::string userId;
public:
    AppendProductAction(std::vector<std::string> products, std::string userId);
    void execute(DataManager* dataManager) override;
    void displayError() override;
};



#endif //APPENDPRODUCTACTION_H
