//
// Created by vitaly on 03.05.2026.
//

#include "DataManager.h"

void DataManager::setMapUserToProducts(std::map<std::string, std::set<std::string> > map) {
    userToProducts = std::move(map);
}

void DataManager::setMapProductToUsers(std::map<std::string, std::set<std::string> > map) {
    productToUser = std::move(map);
}

std::map<std::string, std::set<std::string> > DataManager::getMapProductToUser() {
    return productToUser;
}

std::map<std::string, std::set<std::string> > DataManager::getMapUserToProducts() {
    return userToProducts;
}