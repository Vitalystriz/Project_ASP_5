#include <gtest/gtest.h>
#include "menu/SocketMenu.h"
#include "command/PatchCommand.h"
#include "DataManager.h"

class PatchCommandIntegrationTest : public ::testing::Test {
protected:
    DataManager dataManager;

    void SetUp() override {
        // Pre-populate DataManager with a user for PATCH testing
        std::map<std::string, std::set<std::string>> u2p = {{"1", {"100", "101"}}};
        std::map<std::string, std::set<std::string>> p2u = {{"100", {"1"}}, {"101", {"1"}}};
        dataManager.setMapUserToProducts(u2p);
        dataManager.setMapProductToUsers(p2u);
    }
};

TEST_F(PatchCommandIntegrationTest, E2E_PatchExistingUser) {
    SocketMenu menu;
    menu.feedRawString("PATCH 1 102 103\n");

    EXPECT_EQ(menu.nextCommand(), "PATCH");

    PatchCommand patchCommand(&dataManager);
    std::string result = patchCommand.execute(menu.getArgs());

    EXPECT_EQ(result, "204 No Content");

    auto u2p = dataManager.getMapUserToProducts();
    EXPECT_EQ(u2p["1"], std::set<std::string>({"100", "101", "102", "103"}));
}

TEST_F(PatchCommandIntegrationTest, E2E_PatchNonExistentUser) {
    SocketMenu menu;
    menu.feedRawString("PATCH 99 102\n");
    menu.nextCommand();

    PatchCommand patchCommand(&dataManager);
    std::string result = patchCommand.execute(menu.getArgs());

    // PATCH should fail because user 99 doesn't exist
    EXPECT_EQ(result, "404 Not Found");

    auto u2p = dataManager.getMapUserToProducts();
    EXPECT_TRUE(u2p.count("99") == 0); // Ensure the user was NOT created
}