

#ifndef APPENDUSERSTORAGE_H
#define APPENDUSERSTORAGE_H

#include "IDataStorage.h"
#include "DataManager.h"
class AppendUserStorage : public IDataStorage{
private:
    std::string userId;
public:
    explicit AppendUserStorage( std::string userId);
    void execute(DataManager* dataManager) override;
    void addUserToProsuct(DataManager* data_manager);
    void addProductToUser(DataManager* data_manager);
};



#endif //APPENDUSERSTORAGE_H
