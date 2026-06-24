#include "RecommendationList.h"
#include <algorithm>
#include <utility>

RecommendationList::RecommendationList(std::map<std::string, double> simMap, std::map<std::string, std::set<std::string>> cpMap) {
    this->similarityMap = std::move(simMap);
    this->candidateProductsMap = std::move(cpMap);
}

bool compareRecommendations(std::pair<std::string, double> x, std::pair<std::string, double> y) {
    if (x.second!=y.second) {
        return x.second > y.second;
    }
    return x.first < y.first;
}

std::vector<std::string> RecommendationList::calculate() {
    std::vector<std::pair<std::string, double>> scoredProducts;

    for (auto pair : this->candidateProductsMap) {
        std::string productId = pair.first;
        std::set<std::string> users = pair.second;

        double totalRelevance = 0.0;

        for (std::string userId : users) {
            totalRelevance += this->similarityMap[userId];
        }

        scoredProducts.push_back(std::make_pair(productId, totalRelevance));
    }


    std::sort(scoredProducts.begin(), scoredProducts.end(), compareRecommendations);

    std::vector<std::string> results;

    int count = 0;
    for (auto pair : scoredProducts) {
        if (count>= 10) {
            break;
        }
        results.push_back(pair.first);
        count++;
    }

    return results;
}
