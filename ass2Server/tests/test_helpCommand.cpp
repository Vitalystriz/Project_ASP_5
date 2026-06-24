

#include <gtest/gtest.h>
#include "command/HelpCommand.h"
#include <sstream>
#include <iostream>

TEST(HelpCommandTest, ExecutePrintsCorrectMenu) {

    std::stringstream buffer;


    std::streambuf* oldCoutBuffer = std::cout.rdbuf(buffer.rdbuf());


    HelpCommand helpCommand;
    helpCommand.execute();


    std::cout.rdbuf(oldCoutBuffer);


    std::string output = buffer.str();


    EXPECT_TRUE(output.find("--- Recommendation System CLI ---") != std::string::npos);
    EXPECT_TRUE(output.find("- help") != std::string::npos);
    EXPECT_TRUE(output.find("- add <userId> <productId1> <productId2> ...") != std::string::npos);
    EXPECT_TRUE(output.find("- recommend <userId> <productId>") != std::string::npos);
    EXPECT_TRUE(output.find("- exit") != std::string::npos);
}
