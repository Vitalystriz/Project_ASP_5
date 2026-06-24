#include <gtest/gtest.h>
#include "DataManager.h"
#include "persistence/dataAction/AppendUserAction.h"
#include <iostream>


TEST(AppendUserTest, UserToProductMapEmptyProducts) {
    std::map<std::string, std::set<std::string>> data = {{"1", {"102", "103"}}, {"4", {"105", "106"}}};

    DataManager data_manager;
    data_manager.setMapUserToProducts(data);

    std::vector<std::string> empty_addition = {};
    AppendUserAction append_user_action("5", empty_addition);


    std::stringstream buffer;
    std::streambuf* oldCoutBuffer = std::cout.rdbuf(buffer.rdbuf());

    append_user_action.execute(&data_manager);


    std::cout.rdbuf(oldCoutBuffer);
    std::string output = buffer.str();


    EXPECT_TRUE(output.find("Products list is empty") != std::string::npos);


    auto updated_map = data_manager.getMapUserToProducts();
    EXPECT_TRUE(updated_map.find("5") == updated_map.end());
}


TEST(AppendUserTest, UserToProductMapUpdate) {
    std::map<std::string, std::set<std::string>> data = {{"1", {"102", "103"}},
        {"4", {"105", "106"}}};

    DataManager data_manager;
    data_manager.setMapUserToProducts(data);

    // Must provide a valid, non-empty vector to bypass the error check
    std::vector<std::string> valid_addition = {"999"};
    AppendUserAction append_user_action("5", valid_addition);
    append_user_action.execute(&data_manager);

    std::map<std::string, std::set<std::string>> updated_data = {{"1", {"102", "103"}},
       {"4", {"105", "106"}}, {"5", {"999"}}};

    EXPECT_EQ(data_manager.getMapUserToProducts(), updated_data);
}


TEST(AppendUserTest, UserToProductMapEmpty) {
    std::map<std::string, std::set<std::string>> data = {};

    DataManager data_manager;
    data_manager.setMapUserToProducts(data);

    std::vector<std::string> valid_addition = {"999"};
    AppendUserAction append_user_action("2", valid_addition);
    append_user_action.execute(&data_manager);

    std::map<std::string, std::set<std::string>> updated_data = {{"2", {"999"}}};
    EXPECT_EQ(data_manager.getMapUserToProducts(), updated_data);
}


TEST(AppendUserTest, UserToProductNotEQ) {
    std::map<std::string, std::set<std::string>> data = {};

    DataManager data_manager;
    data_manager.setMapUserToProducts(data);

    std::vector<std::string> valid_addition = {"999"};
    AppendUserAction append_user_action("2", valid_addition);
    append_user_action.execute(&data_manager);

    data["5"] = {};
    EXPECT_NE(data_manager.getMapUserToProducts(), data);
}


TEST(AppendUserTest, UserToProductAlreadyExists) {
    std::map<std::string, std::set<std::string>> data = {{"1", {"102", "103"}},
        {"4", {"105", "106"}}};

    DataManager data_manager;
    data_manager.setMapUserToProducts(data);

    std::vector<std::string> valid_addition = {"999"};
    AppendUserAction append_user_action("1", valid_addition); // User 1 already exists

    std::map<std::string, std::set<std::string>> updated_data = {{"1", {"102", "103", "999"}},
        {"4", {"105", "106"}}};

    std::stringstream buffer;
    std::streambuf* oldCoutBuffer = std::cout.rdbuf(buffer.rdbuf());

    append_user_action.execute(&data_manager);

    std::cout.rdbuf(oldCoutBuffer);
    std::string output = buffer.str();


    EXPECT_EQ(data_manager.getMapUserToProducts(), updated_data);
}