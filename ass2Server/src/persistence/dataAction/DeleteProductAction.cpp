

#include "DeleteProductAction.h"

#include "DataManager.h"

DeleteProductAction::DeleteProductAction(std::vector<std::string> products,  std::string userId) {
    this->products = std::move(products);
    this->userId = std::move(userId);
}
void DeleteProductAction::displayError() {

}
void DeleteProductAction::execute(DataManager *dataManager) {
    std::map<std::string, std::set<std::string>> userToProducts = dataManager->getMapUserToProducts();

    for (const auto& product : this->products) {
        userToProducts[this->userId].erase(product);
    }

    if (userToProducts[this->userId].empty()) {
        userToProducts.erase(this->userId);
    }

    dataManager->setMapUserToProducts(userToProducts);


    std::map<std::string, std::set<std::string>> productToUser = dataManager->getMapProductToUser();

    for (auto product:this->products) {
        if (productToUser.count(product) > 0) {
            productToUser[product].erase(this->userId);

            if (productToUser[product].empty()) {
                productToUser.erase(product);
            }
        }
        else displayError(); // 404 Not Found
    }
    dataManager->setMapProductToUsers(productToUser);
}

