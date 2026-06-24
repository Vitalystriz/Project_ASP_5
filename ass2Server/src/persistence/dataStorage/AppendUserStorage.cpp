#include "AppendUserStorage.h"
#include <fstream>
#include <iostream>
#include <filesystem> // Needed for directory creation and absolute paths
#include <utility>

AppendUserStorage::AppendUserStorage(std::string userId) {
    this->userId = std::move(userId);
}

void AppendUserStorage::execute(DataManager *dataManager) {
    addUserToProsuct(dataManager);
    addProductToUser(dataManager);
}


void AppendUserStorage::addUserToProsuct(DataManager* dataManager) {
    std::map<std::string, std::set<std::string>> data = dataManager->getMapUserToProducts();

    std::string directoryPath = "data";
    std::string filePath = directoryPath + "/dataUserToProduct.txt";

    if (!std::filesystem::exists(directoryPath)) {
        std::filesystem::create_directories(directoryPath);
    }

    std::ofstream outFile(filePath, std::ios::out | std::ios::trunc);

    if (!outFile.is_open()) {
        std::cerr << "Error: Could not open the file to write user data at " << filePath << std::endl;
        return;
    }

    for (const auto& [currentUserId, products] : data) {
        outFile << "{" << currentUserId << " {";

        int i = 0;
        int total_products = static_cast<int>(products.size());

        // Use const std::string& here!
        for (const std::string& product : products) {
            outFile << product;
            if (i < total_products - 1) {
                outFile << ", ";
            }
            i++;
        }
        outFile << "}}\n";
    }

    outFile.flush();
    outFile.close();



}

void AppendUserStorage::addProductToUser(DataManager* dataManager) {
    std::map<std::string, std::set<std::string>> data = dataManager->getMapProductToUser();

    std::string directoryPath = "data";
    std::string filePath = directoryPath + "/dataProductToUser.txt";

    if (!std::filesystem::exists(directoryPath)) {
        std::filesystem::create_directories(directoryPath);
    }

    std::ofstream outFile(filePath, std::ios::out | std::ios::trunc);

    if (!outFile.is_open()) {
        std::cerr << "Error: Could not open the file to write user data at " << filePath << std::endl;
        return;
    }

    for (const auto& [currentProductId, users] : data) {
        outFile << "{" << currentProductId << " {";

        int i = 0;
        int total_users = static_cast<int>(users.size());

        // Use const std::string& here!
        for (const std::string& user : users) {
            outFile << user;
            if (i < total_users - 1) {
                outFile << ", ";
            }
            i++;
        }
        outFile << "}}\n";
    }

    outFile.flush();
    outFile.close();



}


