add_executable(RecommendationApp
        DataManager.h
        command/ICommand.h
        menu/IMenu.h
        run/App.h
        run/Initialization.h
        menu/ConsoleMenu.h

        algorithm/Similarity.h
        algorithm/CandidateProducts.h
        algorithm/RecommendationList.h


        command/DisplayErrorClass.h
        command/HelpCommand.h
        command/AddCommand.h
        command/PatchCommand.cpp
        command/RecommendCommand.h
        command/DeleteCommand.h

        run/main.cpp
        run/Initialization.cpp
        run/App.cpp
        run/IRequestHandler.h
        run/TcpServer.h

        menu/ConsoleMenu.cpp

        command/DisplayErrorClass.cpp
        command/HelpCommand.cpp
        command/AddCommand.cpp
        command/RecommendCommand.cpp

        DataManager.cpp


        persistence/dataAction/IDataAction.h
        persistence/dataAction/DeleteProductAction.h
        persistence/dataAction/AppendUserAction.h
        persistence/dataAction/AppendUserAction.cpp
        persistence/dataAction/AppendProductAction.cpp
        persistence/dataAction/AppendProductAction.h
        persistence/dataStorage/IDataStorage.h
        persistence/dataStorage/AppendUserStorage.cpp
        persistence/dataStorage/AppendUserStorage.h
        persistence/dataStorage/DeleteProductStorage.h
        run/LoadingData.cpp
        run/LoadingData.h
        algorithm/CandidateProducts.cpp
        algorithm/Similarity.cpp
        algorithm/RecommendationList.cpp
        menu/SocketMenu.cpp
        menu/SocketMenu.h
        run/TcpServer.cpp
        command/PatchCommand.cpp
        persistence/dataAction/DeleteProductAction.cpp

        command/DeleteCommand.cpp
        persistence/dataStorage/DeleteProductStorage.cpp


)


target_include_directories(RecommendationApp PRIVATE .)