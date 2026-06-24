cmake_minimum_required(VERSION 3.14)
project(my_project)

# GoogleTest requires at least C++17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
        googletest
        URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_executable(runTests
        # --- Test Files ---
        test_main.cpp
        test_nextCommand.cpp
        test_getArgs.cpp
        test_Initialization.cpp
        test_helpCommand.cpp
        test_dataAction/test_appendProduct.cpp
        test_dataAction/test_appendUser.cpp
        test_addCommand.cpp

        test_TcpServer.cpp


        test_calcSimilarity.cpp
        test_calcWeight.cpp
        test_finalList.cpp

        test_SocketMenu/test_nextCommand.cpp
        test_SocketMenu/test_getArgs.cpp

        # --- Source Files (Everything EXCEPT node-backend/run/main.cpp) ---
        ../src/run/Initialization.cpp
        ../src/run/App.cpp

        ../src/menu/ConsoleMenu.cpp

        ../src/command/DisplayErrorClass.cpp
        ../src/command/HelpCommand.cpp
        ../src/command/AddCommand.cpp
        ../src/command/PatchCommand.cpp
        ../src/command/DeleteCommand.cpp
        ../src/command/RecommendCommand.cpp


        ../src/algorithm/CandidateProducts.cpp
        ../src/algorithm/RecommendationList.cpp
        ../src/algorithm/Similarity.cpp

        ../src/DataManager.cpp
        ../src/persistence/dataAction/AppendUserAction.cpp
        ../src/persistence/dataAction/AppendProductAction.cpp
        ../src/persistence/dataAction/DeleteProductAction.cpp
        ../src/persistence/dataStorage/AppendUserStorage.cpp
        ../src/persistence/dataStorage/AppendUserStorage.cpp
        ../src/persistence/dataStorage/DeleteProductStorage.cpp
        ../src/run/LoadingData.cpp
        ../src/menu/SocketMenu.cpp

        ../src/run/TcpServer.cpp
        test_SocketMenu/test_Initialization_for_server_mode.cpp
        test_TcpServer.cpp
        test_dataAction/test_deleteProduct.cpp
        test_patchCommand.cpp
        test_deleteCommand.cpp


)

target_include_directories(runTests PRIVATE ../src)
target_link_libraries(runTests GTest::gtest)