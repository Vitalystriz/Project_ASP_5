#ifndef RECOMMENDATIONLIST_H
#define RECOMMENDATIONLIST_H

#include <vector>
#include <string>
#include <map>
#include <set>

class RecommendationList {
private:
    std::map<std::string, double> similarityMap;
    std::map<std::string, std::set<std::string>> candidateProductsMap;
public:
    // Takes the generated maps by value
    RecommendationList(std::map<std::string, double> simMap, std::map<std::string, std::set<std::string>> cpMap);

    std::vector<std::string> calculate();
};

#endif //RECOMMENDATIONLIST_H