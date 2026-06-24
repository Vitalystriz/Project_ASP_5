#include "CandidateProducts.h"

CandidateProducts::CandidateProducts() {
    this->candidateProductsMap = std::map<std::string, std::set<std::string>>();
}

void CandidateProducts::calculate(DataManager* dataManager, std::string targetProductId, std::string targetUserId) {
    std::map<std::string, std::set<std::string>> productToUser = dataManager->getMapProductToUser();
    std::map<std::string, std::set<std::string>> userToProducts = dataManager->getMapUserToProducts();

    if (userToProducts.find(targetUserId) == userToProducts.end()) return;
    if (productToUser.find(targetProductId) == productToUser.end()) return;

    std::set<std::string> targetUserWatchedProducts = userToProducts[targetUserId];
    std::set<std::string> usersWhoWatchedTargetProduct = productToUser[targetProductId];

    for (std::string userId : usersWhoWatchedTargetProduct) {

        if (userId == targetUserId) continue;

        std::set<std::string> userProducts = userToProducts[userId];

        for (std::string product : userProducts) {
            if (product != targetProductId) {

                if (targetUserWatchedProducts.find(product) == targetUserWatchedProducts.end()) {
                    this->candidateProductsMap[product].insert(userId);
                }
            }
        }
    }
}

std::map<std::string, std::set<std::string>> CandidateProducts::getMap() {
    return this->candidateProductsMap;
}