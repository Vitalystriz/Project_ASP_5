//
// Created by vitaly on 05.05.2026.
//

#include "AppendProductAction.h"

#include <utility>

#include "DataManager.h"

AppendProductAction::AppendProductAction(std::vector<std::string> products, std::string userId) {
    this->products = std::move(products);
    this->userId = std::move(userId);
}
void AppendProductAction::execute(DataManager *dataManager) {
    try {
        std::map <std::string, std::set <std::string>> data = dataManager->getMapUserToProducts();


        // this part was already implemented in AppendUserAction it's a redudant but doesn't effect
        data[this->userId].insert(this->products.begin(), this->products.end());
        dataManager->setMapUserToProducts(data);

        std::map <std::string, std::set <std::string>> data2 = dataManager->getMapProductToUser();

        //iterating all products and set user
        for(const std::string& product : this->products) {
            data2[product].insert(this->userId);
        }
        dataManager->setMapProductToUsers(data2);
    }
    catch (...) {
        this->displayError();
    }
}
void AppendProductAction::displayError() {
    std::cout<<"Something went wrong, try one more time"<<std::endl;
}


