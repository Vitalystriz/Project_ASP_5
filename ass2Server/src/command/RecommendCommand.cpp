//
// Created by vitaly on 29.04.2026.
//

#include "RecommendCommand.h"
#include "algorithm/Similarity.h"
#include "algorithm/CandidateProducts.h"
#include "algorithm/RecommendationList.h"
#include "DataManager.h"
#include <utility>
#include <vector>


RecommendCommand::RecommendCommand(DataManager* dm) {
    this->dataManager = dm;
}


std::string RecommendCommand::execute(std::map<std::string, std::vector<std::string>> map) {
    this->map = std::move(map);
    auto it = this->map.begin();
    if (it->second.size() != 1 || this->dataManager->getMapUserToProducts()[it->first].empty()) {
        return "404 Not Found";
    }
    std::string userId = it->first;
    std::string productId = it->second[0];



    Similarity similarity;
    similarity.calculate(dataManager, userId);

    CandidateProducts candidateProducts;
    candidateProducts.calculate(dataManager, productId, userId);


    RecommendationList recommendationList(similarity.getMap(), candidateProducts.getMap());
    std::vector<std::string> finalRecommendations = recommendationList.calculate();

    if (finalRecommendations.empty()) {
        return "404 Not Found";
    }

    std::string response = "200 Ok\n\n";
    for(const std::string& recommendation : finalRecommendations) {
        response += recommendation + " ";
    }

    return response;
}

std::map<std::string, std::vector<std::string>>  RecommendCommand::getArgs() {
    return this->map;
}


