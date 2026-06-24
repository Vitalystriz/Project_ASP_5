#include <gtest/gtest.h>
#include "algorithm/Similarity.h"
#include "DataManager.h"

TEST(RecommendationAccuracy, StepA_UserSimilarity) {
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

    DataManager dataManager;
    dataManager.setMapUserToProducts(userToProducts);


    Similarity sim;
    sim.calculate(&dataManager, "1");
    std::map<std::string, double> scores = sim.getMap();

    EXPECT_EQ(scores["2"], 2.0);
    EXPECT_EQ(scores["3"], 1.0);
    EXPECT_EQ(scores["4"], 1.0);
    EXPECT_EQ(scores["5"], 3.0);
    EXPECT_EQ(scores["6"], 2.0);
    EXPECT_EQ(scores["7"], 1.0);
    EXPECT_EQ(scores["8"], 1.0);
    EXPECT_EQ(scores["9"], 2.0);
    EXPECT_EQ(scores["10"], 2.0);
}