//
// Created by vitaly on 03.05.2026.
//

#ifndef DATAMANAGER_H
#define DATAMANAGER_H

#include <map>
#include <vector>
#include <set>

#include <string> // Don't forget to include string!

class DataManager {
private:
    std::map<std::string, std::set<std::string>> userToProducts;
    std::map<std::string, std::set<std::string>> productToUser;
public:
    void setMapUserToProducts(std::map<std::string, std::set<std::string>>);
    void setMapProductToUsers(std::map<std::string, std::set<std::string>>);
    std::map<std::string, std::set<std::string>> getMapUserToProducts();
    std::map<std::string, std::set<std::string>> getMapProductToUser();
};




#endif //DATAMANAGER_H
