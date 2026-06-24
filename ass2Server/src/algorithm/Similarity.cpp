#include "Similarity.h"

Similarity::Similarity() {
    this->similarityMap = std::map<std::string, double>();
}

void Similarity::calculate(DataManager* dataManager, std::string targetUserId) {
    std::map<std::string, std::set<std::string>> matrix = dataManager->getMapUserToProducts();

    if (matrix.find(targetUserId)== matrix.end()) return;

    std::set<std::string> targetUserProducts= matrix[targetUserId];
    for (auto pair : matrix) {
        std::string userId=pair.first;
        std::set<std::string> products=pair.second;

        if (userId== targetUserId) continue;

        double commonProducts = 0.0;


        for (std::string product : products) {
            if (targetUserProducts.find(product) != targetUserProducts.end()) {
                commonProducts += 1.0;
            }
        }

        this->similarityMap[userId] = commonProducts;
    }
}

std::map<std::string, double> Similarity::getMap() {
    return this->similarityMap;
}