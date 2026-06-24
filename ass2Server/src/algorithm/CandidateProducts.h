#ifndef CANDIDATEPRODUCTS_H
#define CANDIDATEPRODUCTS_H

#include "DataManager.h"
#include <string>
#include <map>
#include <set>

class CandidateProducts {
private:
    std::map<std::string, std::set<std::string>> candidateProductsMap;
public:
    CandidateProducts();
    void calculate(DataManager* dataManager, std::string targetProductId, std::string targetUserId);
    std::map<std::string, std::set<std::string>> getMap();
};

#endif //CANDIDATEPRODUCTS_H