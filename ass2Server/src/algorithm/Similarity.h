#ifndef SIMILARITY_H
#define SIMILARITY_H

#include "DataManager.h"
#include <string>
#include <map>
#include <set>

class Similarity {
private:
    std::map<std::string, double> similarityMap;
public:
    Similarity();
    void calculate(DataManager* dataManager, std::string targetUserId);
    std::map<std::string, double> getMap();
};

#endif //SIMILARITY_H