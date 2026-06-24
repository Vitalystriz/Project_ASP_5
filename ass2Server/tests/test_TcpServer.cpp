#include <gtest/gtest.h>
#include "run/TcpServer.h"
#include "run/IRequestHandler.h"

class MockRequestHandler : public IRequestHandler {
public:
    std::string handleRequest(std::string raw_request) override {
        if (raw_request == "marco") {
            return "polo\n";
        }
        return "error: unknown command\n";
    }
};

class TcpServerTest : public ::testing::Test {
protected:
    MockRequestHandler mockHandler;
    int testPort = 0; // Port 0 auto-assigns an available port
};

// Checks that the constructor initializes without crashing
TEST_F(TcpServerTest, InitializationDoesNotCrash) {
    TcpServer server(testPort, mockHandler);
    SUCCEED();
}

// Checks that the server successfully opens a socket and binds to it
// TEST_F(TcpServerTest, StartCreatesSocketAndBindsSuccessfully) {
//     TcpServer server(testPort, mockHandler);
//     server.start();
//     SUCCEED();
// }

//Checks that the handler correctly processes inputs and returns expected outputs
TEST_F(TcpServerTest, HandlerReturnsExpectedResponses) {
    EXPECT_EQ(mockHandler.handleRequest("marco"), "polo\n");
    EXPECT_EQ(mockHandler.handleRequest("random_text"), "error: unknown command\n");
}