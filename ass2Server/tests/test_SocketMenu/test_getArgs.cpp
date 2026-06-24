#include <gtest/gtest.h>
#include "menu/SocketMenu.h"

// 1. Test that the map is empty when the menu is first created
TEST(SocketMenuGetArgsTest, InitialStateIsEmpty) {
    SocketMenu menu;
    auto args = menu.getArgs();

    EXPECT_TRUE(args.empty());
}

// 2. Test the 'POST' (add) command with a single product ID
TEST(SocketMenuGetArgsTest, PostCommandSingleProduct) {
    SocketMenu menu;
    menu.feedRawString("POST 10 500\n");
    menu.nextCommand();

    auto args = menu.getArgs();

    ASSERT_EQ(args.size(), 1);
    EXPECT_EQ(args["10"], std::vector<std::string>({"500"}));
}

// 3. Test the 'POST' (add) command with multiple product IDs
TEST(SocketMenuGetArgsTest, PostCommandMultipleProducts) {
    SocketMenu menu;
    menu.feedRawString("POST 42 101 102 103 104\n");
    menu.nextCommand();

    auto args = menu.getArgs();

    ASSERT_EQ(args.size(), 1);
    EXPECT_EQ(args["42"], std::vector<std::string>({"101", "102", "103", "104"}));
}

// 4. Test the 'GET' (recommend) command
TEST(SocketMenuGetArgsTest, GetCommand) {
    SocketMenu menu;
    menu.feedRawString("GET 7 77\n");
    menu.nextCommand();

    auto args = menu.getArgs();

    ASSERT_EQ(args.size(), 1);
    EXPECT_EQ(args["7"], std::vector<std::string>({"77"}));
}

// 5. Test that state is preserved correctly for multiple different users
TEST(SocketMenuGetArgsTest, MultipleCommandsDifferentUsers) {
    SocketMenu menu;

    // Send first command
    menu.feedRawString("POST 1 10\n");
    menu.nextCommand();
    auto args1 = menu.getArgs();

    // Send second command
    menu.feedRawString("POST 2 20 21\n");
    menu.nextCommand();
    auto args2 = menu.getArgs();

    ASSERT_EQ(args1.size(), 1);
    ASSERT_EQ(args2.size(), 1);

    // Verify user 1
    EXPECT_EQ(args1["1"], std::vector<std::string>({"10"}));
    // Verify user 2
    EXPECT_EQ(args2["2"], std::vector<std::string>({"20", "21"}));
}

// 6. Test that running the same user twice gives the updated arguments for that request
TEST(SocketMenuGetArgsTest, OverwriteExistingUserArgs) {
    SocketMenu menu;

    menu.feedRawString("POST 5 100\n");
    menu.nextCommand(); // User 5 gets [100]

    menu.feedRawString("POST 5 200 300\n");
    menu.nextCommand(); // Request arguments update to [200, 300]

    auto args = menu.getArgs();

    ASSERT_EQ(args.size(), 1);
    EXPECT_EQ(args["5"], std::vector<std::string>({"200", "300"}));
}

// 7. Test that non-modifying commands (help, exit, invalid) clear the arguments
TEST(SocketMenuGetArgsTest, NonModifyingCommands) {
    SocketMenu menu;

    menu.feedRawString("HELP\n");
    menu.nextCommand();

    menu.feedRawString("INVALID_COMMAND\n");
    menu.nextCommand();

    menu.feedRawString("EXIT\n");
    menu.nextCommand();

    auto args = menu.getArgs();

    EXPECT_TRUE(args.empty()); // Map should remain empty
}