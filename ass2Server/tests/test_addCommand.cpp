#include <gtest/gtest.h>
#include "menu/SocketMenu.h"
#include "command/AddCommand.h"
#include "DataManager.h"

class AddCommandIntegrationTest : public ::testing::Test {
protected:
    DataManager dataManager;
    void SetUp() override {}
};

TEST_F(AddCommandIntegrationTest, E2E_AddUserAndProducts) {
    SocketMenu menu;
    menu.feedRawString("POST 1 101 102\n");

    EXPECT_EQ(menu.nextCommand(), "POST");

    AddCommand addCommand(&dataManager);
    addCommand.execute(menu.getArgs());

    auto userToProducts = dataManager.getMapUserToProducts();
    auto productToUsers = dataManager.getMapProductToUser();

    ASSERT_TRUE(userToProducts.find("1") != userToProducts.end());
    EXPECT_EQ(userToProducts["1"], std::set<std::string>({"101", "102"}));

    ASSERT_TRUE(productToUsers.find("101") != productToUsers.end());
    EXPECT_EQ(productToUsers["101"], std::set<std::string>({"1"}));

    ASSERT_TRUE(productToUsers.find("102") != productToUsers.end());
    EXPECT_EQ(productToUsers["102"], std::set<std::string>({"1"}));
}

TEST_F(AddCommandIntegrationTest, E2E_AddProductsToExistingUser) {
    std::map<std::string, std::set<std::string>> initialData = {{"1", {"99"}}};
    dataManager.setMapUserToProducts(initialData);

    SocketMenu menu;
    menu.feedRawString("POST 1 100\n");
    menu.nextCommand();

    AddCommand addCommand(&dataManager);
    addCommand.execute(menu.getArgs());

    auto userToProducts = dataManager.getMapUserToProducts();

    ASSERT_TRUE(userToProducts.find("1") != userToProducts.end());
    std::set<std::string> expected_products = {"99"};
    EXPECT_EQ(userToProducts["1"], expected_products);
}

TEST_F(AddCommandIntegrationTest, E2E_AddRepeatingProductsToExistingUser) {
    std::map<std::string, std::set<std::string>> initialData = {{"1", {"99", "100", "103"}}};
    dataManager.setMapUserToProducts(initialData);

    SocketMenu menu;
    menu.feedRawString("POST 1 100 104\n");
    menu.nextCommand();

    AddCommand addCommand(&dataManager);
    addCommand.execute(menu.getArgs());

    auto userToProducts = dataManager.getMapUserToProducts();

    ASSERT_TRUE(userToProducts.find("1") != userToProducts.end());
    std::set<std::string> expected_products = {"99", "100", "103"};
    EXPECT_EQ(userToProducts["1"], expected_products);
}
