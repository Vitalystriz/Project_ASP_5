
#include <gtest/gtest.h>
#include "menu/ConsoleMenu.h"



#include <gtest/gtest.h>
#include <sstream>

namespace {
    // Helper function to simulate input.
    // Wrapped in an anonymous namespace to prevent linker conflicts with test_nextCommand.cpp
    void setInput(const std::string& input) {
        // Using a static stringstream to prevent memory leaks during tests
        static std::istringstream inputStream;
        inputStream.str(input);
        inputStream.clear(); // Clear any previous EOF flags
        std::cin.rdbuf(inputStream.rdbuf());
    }
}


// 1. Test that the map is empty when the menu is first created
TEST(ConsoleMenuGetArgsTest, InitialStateIsEmpty) {
    ConsoleMenu menu;
    auto args = menu.getArgs();

    EXPECT_TRUE(args.empty());
}

// 2. Test the 'add' command with a single product ID
TEST(ConsoleMenuGetArgsTest, AddCommandSingleProduct) {
    setInput("add 10 500\n");
    ConsoleMenu menu;
    menu.nextCommand();

    auto args = menu.getArgs();

    ASSERT_EQ(args.size(), 1);
    EXPECT_EQ(args["10"], std::vector<std::string>({"500"}));
}

// 3. Test the 'add' command with multiple product IDs
TEST(ConsoleMenuGetArgsTest, AddCommandMultipleProducts) {
    setInput("add 42 101 102 103 104\n");
    ConsoleMenu menu;
    menu.nextCommand();

    auto args = menu.getArgs();

    ASSERT_EQ(args.size(), 1);
    EXPECT_EQ(args["42"], std::vector<std::string>({"101", "102", "103", "104"}));
}

// 4. Test the 'recommend' command
TEST(ConsoleMenuGetArgsTest, RecommendCommand) {
    setInput("recommend 7 77\n");
    ConsoleMenu menu;
    menu.nextCommand();

    auto args = menu.getArgs();

    ASSERT_EQ(args.size(), 1);
    EXPECT_EQ(args["7"], std::vector<std::string >({"77"}));
}

// 5. Test that state is preserved correctly for multiple different users
TEST(ConsoleMenuGetArgsTest, MultipleCommandsDifferentUsers) {
    // Send two commands in sequence
    setInput("add 1 10\nadd 2 20 21\n");
    ConsoleMenu menu;

    menu.nextCommand(); // Consumes 'add 1 10'
    auto args1 = menu.getArgs();
    menu.nextCommand(); // Consumes 'add 2 20 21'
    auto args2 = menu.getArgs();

    ASSERT_EQ(args1.size(), 1);
    ASSERT_EQ(args2.size(), 1);

    // Verify user 1
    EXPECT_EQ(args1["1"], std::vector<std::string>({"10"}));
    // Verify user 2
    EXPECT_EQ(args2["2"], std::vector<std::string>({"20", "21"}));
}

// 6. Test that running the same user twice overwrites their previous arguments
TEST(ConsoleMenuGetArgsTest, OverwriteExistingUserArgs) {
    setInput("add 5 100\nadd 5 200 300\n");
    ConsoleMenu menu;

    menu.nextCommand(); // User 5 gets [100]
    menu.nextCommand(); // User 5 gets overwritten to [200, 300]

    auto args = menu.getArgs();

    ASSERT_EQ(args.size(), 1);
    EXPECT_EQ(args["5"], std::vector<std::string>({"200", "300"}));
}

// 7. Test that non-modifying commands (help, exit, invalid) do not alter the arguments
TEST(ConsoleMenuGetArgsTest, NonModifyingCommands) {
    setInput("help\ninvalid_command\nexit\n");
    ConsoleMenu menu;

    menu.nextCommand(); // help
    menu.nextCommand(); // invalid_command
    menu.nextCommand(); // exit

    auto args = menu.getArgs();

    EXPECT_TRUE(args.empty()); // Map should remain empty
}




