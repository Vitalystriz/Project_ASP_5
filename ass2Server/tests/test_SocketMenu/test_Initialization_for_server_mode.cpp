
#include <gtest/gtest.h>
#include "run/Initialization.h"

TEST(InitializationTestForServerMode, CreateCommandMapPopulatesCorrectlyWithNewCommands) {
    Initialization init;
    auto* data_manager = new DataManager();
    auto commandMap = init.createCommandMapForServerMode(data_manager);


    EXPECT_EQ(commandMap.size(), 7);

    EXPECT_TRUE(commandMap.find("EXIT") != commandMap.end());
    EXPECT_EQ(commandMap["EXIT"], nullptr);  // HelpCommand
    EXPECT_TRUE(commandMap.find("HELP") != commandMap.end());
    EXPECT_NE(commandMap["HELP"], nullptr);  // HelpCommand

    EXPECT_TRUE(commandMap.find("DELETE") != commandMap.end());
    EXPECT_NE(commandMap["DELETE"], nullptr);  // DeletCommand

    EXPECT_TRUE(commandMap.find("POST") != commandMap.end());
    EXPECT_NE(commandMap["POST"], nullptr);  // AddCommand

    EXPECT_TRUE(commandMap.find("PATCH") != commandMap.end());
    EXPECT_NE(commandMap["PATCH"], nullptr);  // PatchCommand

    EXPECT_TRUE(commandMap.find("GET") != commandMap.end());
    EXPECT_NE(commandMap["GET"], nullptr);  // RecommendCommand

    EXPECT_TRUE(commandMap.find("ERROR") != commandMap.end());
    EXPECT_NE(commandMap["ERROR"], nullptr);  // DisplayE

    for (auto const& [key, val] : commandMap) {
        delete val;
    }
    delete data_manager;
}