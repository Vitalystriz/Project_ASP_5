#include <gtest/gtest.h>
#include "algorithm/CandidateProducts.h"
#include "DataManager.h"

TEST(RecommendationAccuracy, StepB_CandidateProductsWeight) {
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

    // Calculate productToUser map dynamically
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

    CandidateProducts cp;
    cp.calculate(&dataManager, "104", "1");
    std::map<std::string, std::set<std::string>> cpMap = cp.getMap();

    // Verify mapping for product "105"
    // Users who watched 104 and 105 (excluding target user 1): 2, 3, 8
    EXPECT_TRUE(cpMap.find("105") != cpMap.end());
    std::set<std::string> expectedUsersFor105 = {"2", "3", "8"};
    EXPECT_EQ(cpMap["105"], expectedUsersFor105);

    // Verify mapping for product "106"
    // Users who watched 104 and 106 (excluding target user 1): 2, 8
    EXPECT_TRUE(cpMap.find("106") != cpMap.end());
    std::set<std::string> expectedUsersFor106 = {"2", "8"};
    EXPECT_EQ(cpMap["106"], expectedUsersFor106);
}
