//
// Created by vitaly on 05.05.2026.
//
#include "AppendUserAction.h"

#include <utility>

#include "DataManager.h"

AppendUserAction::AppendUserAction(std::string userId, std::vector<std::string> products) {
    this->userId = std::move(userId);
    this->products = std::move(products);
}

void AppendUserAction::execute(DataManager* dataManager) {
    std::map <std::string, std::set <std::string>> data = dataManager->getMapUserToProducts();
    if ( this->products.empty()) {
        this->displayError();
        return;
    }
    data[userId].insert(products.begin(), products.end());
    dataManager->setMapUserToProducts(data);
}

void AppendUserAction::displayError() {
    std::cout<<"Products list is empty"<<std::endl;
}
