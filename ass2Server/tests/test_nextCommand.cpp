//
// Created by vitaly on 02.05.2026.
//

#include "menu/ConsoleMenu.h"
#include <gtest/gtest.h>
#include <sstream>

// Helper function to simulate input
void setInput(const std::string& input) {
    static std::istringstream inputStream; // Allocated once, safely reused
    inputStream.str(input);
    inputStream.clear();
    std::cin.rdbuf(inputStream.rdbuf());
}

TEST(ConsoleMenuTest, ExitCommand) {
    setInput("error\n");
    ConsoleMenu menu;
    EXPECT_EQ(menu.nextCommand(), "error"); // Changed from 0
}

TEST(ConsoleMenuTest, EmptyInput) {
    setInput("\n");
    ConsoleMenu menu;
    EXPECT_EQ(menu.nextCommand(), "error"); // Changed from -1
}

TEST(ConsoleMenuTest, HelpCommand) {
    setInput("help\n");
    ConsoleMenu menu;
    EXPECT_EQ(menu.nextCommand(), "help"); // Changed from 1
}

TEST(ConsoleMenuTest, AddCommandWithValidArgs) {
    setInput("add 1 2 3 4\n");
    ConsoleMenu menu;
    EXPECT_EQ(menu.nextCommand(), "add"); // Changed from 2

    auto args = menu.getArgs();
    ASSERT_EQ(args.size(), 1);
    EXPECT_EQ(args["1"], std::vector<std::string>({"2", "3", "4"}));
}

TEST(ConsoleMenuTest, AddCommandWithNoArgs) {
    setInput("add\n");
    ConsoleMenu menu;
    EXPECT_EQ(menu.nextCommand(), "add"); // Changed from 2

    auto args = menu.getArgs();
    EXPECT_TRUE(args.empty());
}

TEST(ConsoleMenuTest, RecommendCommandWithValidArgs) {
    setInput("recommend 1 2\n");
    ConsoleMenu menu;
    EXPECT_EQ(menu.nextCommand(), "recommend"); // Changed from 3

    auto args = menu.getArgs();
    ASSERT_EQ(args.size(), 1);
    EXPECT_EQ(args["1"], std::vector<std::string>({"2"}));
}

TEST(ConsoleMenuTest, RecommendCommandWithNoArgs) {
    setInput("recommend\n");
    ConsoleMenu menu;
    EXPECT_EQ(menu.nextCommand(), "recommend"); // Changed from 3

    auto args = menu.getArgs();
    EXPECT_TRUE(args.empty());
}

TEST(ConsoleMenuTest, InvalidCommand) {
    setInput("invalid_command\n");
    ConsoleMenu menu;
    EXPECT_EQ(menu.nextCommand(), "error"); // Changed from -1
}