#include "LoadingData.h"
#include <fstream>
#include <sstream>
#include <iostream>
#include <filesystem>

void LoadingData::load(DataManager* dataManager) {
    std::map<std::string, std::set<std::string>> userToProducts = parseFile("data/dataUserToProduct.txt");
    std::map<std::string, std::set<std::string>> productToUser = parseFile("data/dataProductToUser.txt");

    dataManager->setMapUserToProducts(userToProducts);
    dataManager->setMapProductToUsers(productToUser);
}

std::map<std::string, std::set<std::string>> LoadingData::parseFile(const std::string& filepath) {
    std::map<std::string, std::set<std::string>> parsedData;
    std::filesystem::path pathObj(filepath);


    // Check if the file exists. If it doesn't, create the directory and the empty file.
    if (!std::filesystem::exists(pathObj)) {
        // Create the parent directory if it doesn't exist
        if (pathObj.has_parent_path() && !std::filesystem::exists(pathObj.parent_path())) {
            std::filesystem::create_directories(pathObj.parent_path());
        }

        // Create the empty text file
        std::ofstream newFile(filepath);
        if (newFile.is_open()) {
            newFile.close();
        }

        // Return the empty map since there's no data to read yet
        return parsedData;
    }

    std::ifstream file(filepath);


    if (!file.is_open()) {
        return parsedData;
    }

    std::string line;
    while (std::getline(file, line)) {
        size_t firstSpace= line.find(' ');
        if (firstSpace== std::string::npos || line.length() < 3) continue;

        // Extract the key (ignoring the first '{')
        std::string key= line.substr(1, firstSpace - 1);

        // Find the list of values enclosed in inner { }
        size_t startList= line.find('{', firstSpace);
        size_t endList= line.find('}', startList);

        if (startList != std::string::npos && endList != std::string::npos) {
            // Extrct just the inners comma-separated string
            std::string valuesStr = line.substr(startList + 1, endList - startList - 1);

            std::set<std::string> valuesSet;
            std::stringstream ss(valuesStr);
            std::string value;

            // Split the string by comma
            while (std::getline(ss, value, ',')) {
                // Trim any leading or trailing spaces from the value
                size_t start = value.find_first_not_of(" ");
                size_t end = value.find_last_not_of(" ");

                if (start != std::string::npos && end != std::string::npos) {
                    valuesSet.insert(value.substr(start, end - start + 1));
                }
            }
            parsedData[key] = valuesSet;
        }
    }

    file.close();
    return parsedData;
}
