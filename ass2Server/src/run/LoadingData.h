#ifndef LOADINGDATA_H
#define LOADINGDATA_H

#include "DataManager.h"
#include <string>
#include <map>
#include <set>

class LoadingData {
private:

    std::map<std::string, std::set<std::string>> parseFile(const std::string& filepath);

public:
    LoadingData() = default;

    void load(DataManager* dataManager);
};

#endif //LOADINGDATA_H