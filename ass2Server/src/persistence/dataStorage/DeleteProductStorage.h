

#ifndef DELETEPRODUCTSTORAGE_H
#define DELETEPRODUCTSTORAGE_H


#include "persistence/dataStorage/IDataStorage.h"
#include "DataManager.h"
#include <string>
#include <vector>

class DeleteProductStorage : public IDataStorage {
private:
    std::string userId;

    void writeUserToProduct(DataManager* dataManager);
    void writeProductToUser(DataManager* dataManager);

public:
    DeleteProductStorage(std::string userId);

    void execute(DataManager* dataManager) override;
};



#endif //DELETEPRODUCTSTORAGE_H
