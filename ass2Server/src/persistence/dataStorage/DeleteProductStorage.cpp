
#include "DeleteProductStorage.h"
#include <fstream>
#include <iostream>
#include <filesystem>
#include <utility>

DeleteProductStorage::DeleteProductStorage(std::string userId) {
    this->userId = std::move(userId);
}

void DeleteProductStorage::execute(DataManager *dataManager) {
    writeUserToProduct(dataManager);
    writeProductToUser(dataManager);
}

void DeleteProductStorage::writeUserToProduct(DataManager* dataManager) {
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

    for (const auto& [currentUserId, currentProducts] : data) {
        if (currentProducts.empty()) {
            continue;
        }

        outFile << "{" << currentUserId << " {";

        int i = 0;
        int total_products = static_cast<int>(currentProducts.size());

        for (const std::string& product : currentProducts) {
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

void DeleteProductStorage::writeProductToUser(DataManager* dataManager) {
    std::map<std::string, std::set<std::string>> data = dataManager->getMapProductToUser();

    std::string directoryPath = "data";
    std::string filePath = directoryPath + "/dataProductToUser.txt";

    if (!std::filesystem::exists(directoryPath)) {
        std::filesystem::create_directories(directoryPath);
    }

    std::ofstream outFile(filePath, std::ios::out | std::ios::trunc);

    if (!outFile.is_open()) {
        std::cerr << "Error: Could not open the file to write product data at " << filePath << std::endl;
        return;
    }

    for (const auto& [currentProductId, users] : data) {
        if (users.empty()) {
            continue;
        }

        outFile << "{" << currentProductId << " {";

        int i = 0;
        int total_users = static_cast<int>(users.size());

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