

#ifndef DELETEPRODUCTACTION_H
#define DELETEPRODUCTACTION_H
#include "IDataAction.h"
#include <vector>
#include <set>


class DeleteProductAction : public IDataAction {
private:
    std::vector<std::string> products;
    std::string userId;
public:
    DeleteProductAction(std::vector<std::string> products, std::string userId);
    void execute(DataManager* dataManager) override;
    void displayError() override;
};



#endif //DELETEPRODUCTACTION_H
