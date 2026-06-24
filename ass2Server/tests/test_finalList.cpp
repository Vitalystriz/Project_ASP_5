#include <gtest/gtest.h>
#include "algorithm/Similarity.h"
#include "algorithm/CandidateProducts.h"
#include "algorithm/RecommendationList.h"
#include "DataManager.h"

TEST(RecommendationAccuracy, StepG_FinalRankAndSorting) {
    // Step 1: Build the data map
    std::map<std::string, std::set<std::string>> userToProducts = {
        {"1", {"100", "101", "102", "103"}},
        {"2", {"101", "102", "104", "105", "106"}},
        {"3", {"100", "104", "105", "107", "108"}},
        {"4", {"101", "105", "106", "107", "109", "110"}},
        {"5", {"100", "102", "103", "105", "108", "111"}},
        {"6", {"100", "103", "104", "110", "111", "112", "113"}},
        {"7", {"102", "105", "106", "107", "108", "109", "110"}},
        {"8", {"101", "104", "105", "106", "109", "111", "114"}},
        {"9", {"100", "103", "105", "107", "112", "113", "115"}},
        {"10", {"100", "102", "105", "106", "107", "109", "110", "116"}}
    };

    std::map<std::string, std::set<std::string>> productToUser;
    for (auto pair : userToProducts) {
        std::string user = pair.first;
        std::set<std::string> products = pair.second;
        for (std::string product : products) {
            productToUser[product].insert(user);
        }
    }

    DataManager dataManager;
    dataManager.setMapUserToProducts(userToProducts);
    dataManager.setMapProductToUsers(productToUser);

    // Step 2: Calculate Similarity Map
    Similarity sim;
    sim.calculate(&dataManager, "1");
    std::map<std::string, double> simMap = sim.getMap();

    // Step 3: Calculate Candidate Products Mapping
    CandidateProducts cp;
    cp.calculate(&dataManager, "104", "1");
    std::map<std::string, std::set<std::string>> cpMap = cp.getMap();

    // Step 4: Sort and get final recommendation list passing by value
    RecommendationList recList(simMap, cpMap);
    std::vector<std::string> results = recList.calculate();

    // Expected order based on algorithm criteria
    std::vector<std::string> expected = {"105", "106", "111", "110", "112", "113", "107", "108", "109", "114"};

    ASSERT_EQ(results.size(), expected.size());

    // Loop through vector by value
    int i = 0;
    for (std::string result : results) {
        EXPECT_EQ(result, expected[i]);
        i++;
    }
}