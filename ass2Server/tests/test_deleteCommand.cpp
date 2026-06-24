#include <gtest/gtest.h>
#include "menu/SocketMenu.h"
#include "command/DeleteCommand.h"
#include "DataManager.h"

class DeleteCommandIntegrationTest : public ::testing::Test {
protected:
    DataManager dataManager;

    void SetUp() override {
        std::map<std::string, std::set<std::string>> u2p = {{"1", {"100", "101", "102"}}};
        std::map<std::string, std::set<std::string>> p2u = {{"100", {"1"}}, {"101", {"1"}}, {"102", {"1"}}};
        dataManager.setMapUserToProducts(u2p);
        dataManager.setMapProductToUsers(p2u);
    }
};

TEST_F(DeleteCommandIntegrationTest, E2E_DeleteExistingProduct) {
    SocketMenu menu;
    menu.feedRawString("DELETE 1 101\n");

    EXPECT_EQ(menu.nextCommand(), "DELETE");

    DeleteCommand deleteCommand(&dataManager);
    std::string result = deleteCommand.execute(menu.getArgs());

    EXPECT_EQ(result, "204 No Content");

    auto u2p = dataManager.getMapUserToProducts();
    EXPECT_EQ(u2p["1"], std::set<std::string>({"100", "102"})); // 101 should be gone
}

TEST_F(DeleteCommandIntegrationTest, E2E_DeleteNonExistentUser) {
    SocketMenu menu;
    menu.feedRawString("DELETE 99 101\n"); // User 99 doesn't exist
    menu.nextCommand();

    DeleteCommand deleteCommand(&dataManager);
    std::string result = deleteCommand.execute(menu.getArgs());

    EXPECT_EQ(result, "404 Not Found");
}

TEST_F(DeleteCommandIntegrationTest, E2E_DeleteProductNotOwnedByUser) {
    SocketMenu menu;
    menu.feedRawString("DELETE 1 999\n"); // User 1 exists, but doesn't own product 999
    menu.nextCommand();

    DeleteCommand deleteCommand(&dataManager);
    std::string result = deleteCommand.execute(menu.getArgs());

    EXPECT_EQ(result, "404 Not Found");
}

TEST_F(DeleteCommandIntegrationTest, E2E_DeleteMultipleProducts) {
    SocketMenu menu;
    menu.feedRawString("DELETE 1 100 102\n");
    menu.nextCommand();

    DeleteCommand deleteCommand(&dataManager);
    std::string result = deleteCommand.execute(menu.getArgs());

    EXPECT_EQ(result, "204 No Content");

    auto u2p = dataManager.getMapUserToProducts();
    EXPECT_EQ(u2p["1"], std::set<std::string>({"101"})); // Only 101 should be left
}