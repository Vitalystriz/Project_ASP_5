

#include "DeleteCommand.h"

#include "persistence/dataAction/DeleteProductAction.h"
#include "persistence/dataStorage/DeleteProductStorage.h"

DeleteCommand::DeleteCommand(DataManager *dm) {
    this->dataManager = dm;
}

std::map<std::string, std::vector<std::string> > DeleteCommand::getArgs() {
    return this->map;
}

std::string DeleteCommand::execute(std::map<std::string, std::vector<std::string> > map) {
    if (map.empty()) {
        return "404 Not Found";
    }
    this->map = std::move(map);
    auto it = this->map.begin();
    std::string userId = it->first;
    std::vector<std::string> data = it->second;


    if (this->dataManager->getMapUserToProducts()[userId].empty() || data.empty()) {
        return "404 Not Found";
    }


    std::set<std::string> userProducts = this->dataManager->getMapUserToProducts().at(userId);
    for (const auto& product : data) {
        if (userProducts.count(product) == 0) {
            return "404 Not Found";
        }
    }


    auto* delete_product_action = new DeleteProductAction(data, userId);
    delete_product_action->execute(dataManager);
    delete delete_product_action;

    auto* append_user_storage = new DeleteProductStorage(userId);
    append_user_storage->execute(dataManager);
    delete append_user_storage;


    return "204 No Content";
}

