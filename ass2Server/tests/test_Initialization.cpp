//
// Created by vitaly on 27.04.2026.
//
// tests/test_Initialization.cpp

#include <gtest/gtest.h>
#include "run/Initialization.h"

TEST(InitializationTest, CreateCommandMapPopulatesCorrectly) {
    Initialization init;
    auto* data_manager = new DataManager();
    auto commandMap = init.createCommandMapForCLIMode(data_manager);


    EXPECT_EQ(commandMap.size(), 5);

    EXPECT_TRUE(commandMap.find("exit") != commandMap.end());
    EXPECT_EQ(commandMap["exit"], nullptr);  // HelpCommand
    EXPECT_TRUE(commandMap.find("help") != commandMap.end());
    EXPECT_NE(commandMap["help"], nullptr);  // HelpCommand

    EXPECT_TRUE(commandMap.find("add") != commandMap.end());
    EXPECT_NE(commandMap["add"], nullptr);  // AddCommand

    EXPECT_TRUE(commandMap.find("recommend") != commandMap.end());
    EXPECT_NE(commandMap["recommend"], nullptr);  // RecommendCommand

    EXPECT_TRUE(commandMap.find("error") != commandMap.end());
    EXPECT_NE(commandMap["error"], nullptr);  // DisplayE

    for (auto const& [key, val] : commandMap) {
        delete val;
    }
    delete data_manager;
}