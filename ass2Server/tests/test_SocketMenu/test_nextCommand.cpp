//
// Created by geras on 18.05.2026.
//

#include "menu/SocketMenu.h"
#include <gtest/gtest.h>
#include <sstream>

// Helper function to simulate input
// void setInput(const std::string& input) {
//     static std::istringstream inputStream; // Allocated once, safely reused
//     inputStream.str(input);
//     inputStream.clear();
//     std::cin.rdbuf(inputStream.rdbuf());
// }

TEST(SocketMenuTest, ExitCommand) {
    SocketMenu menu;
    menu.feedRawString("sd");
    EXPECT_EQ(menu.nextCommand(), "ERROR"); // Changed from 0
}

TEST(SocketMenuTest, EmptyInput) {
    SocketMenu menu;
    menu.feedRawString("\n");
    EXPECT_EQ(menu.nextCommand(), "ERROR"); // Changed from -1
}

TEST(SocketMenuTest, HelpCommand) {
    SocketMenu menu;
    menu.feedRawString("HELP\n");
    EXPECT_EQ(menu.nextCommand(), "HELP"); // Changed from 1
}

TEST(SocketMenuTest, AddCommandWithValidArgs) {
    SocketMenu menu;
    menu.feedRawString("POST 1 2 3 4\n");
    EXPECT_EQ(menu.nextCommand(), "POST"); // Changed from 2

    auto args = menu.getArgs();
    ASSERT_EQ(args.size(), 1);
    EXPECT_EQ(args["1"], std::vector<std::string>({"2", "3", "4"}));
}

TEST(SocketMenuTest, AddCommandWithNoArgs) {
    SocketMenu menu;
    menu.feedRawString("POST\n");
    EXPECT_EQ(menu.nextCommand(), "POST"); // Changed from 2

    auto args = menu.getArgs();
    EXPECT_TRUE(args.empty());
}

TEST(SocketMenuTest, RecommendCommandWithValidArgs) {
    SocketMenu menu;
    menu.feedRawString("GET 1 2\n");
    EXPECT_EQ(menu.nextCommand(), "GET"); // Changed from 3

    auto args = menu.getArgs();
    ASSERT_EQ(args.size(), 1);
    EXPECT_EQ(args["1"], std::vector<std::string>({"2"}));
}

TEST(SocketMenuTest, RecommendCommandWithNoArgs) {
    SocketMenu menu;
    menu.feedRawString("GET\n");
    EXPECT_EQ(menu.nextCommand(), "GET"); // Changed from 3

    auto args = menu.getArgs();
    EXPECT_TRUE(args.empty());
}

TEST(SocketMenuTest, InvalidCommand) {
    SocketMenu menu;
    menu.feedRawString("invalid_command\n");
    EXPECT_EQ(menu.nextCommand(), "ERROR"); // Changed from -1
}