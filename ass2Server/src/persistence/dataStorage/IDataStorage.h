

#ifndef IDATASTORAGE_H
#define IDATASTORAGE_H

class DataManager;
class IDataStorage {
public:
    virtual ~IDataStorage() = default;
    virtual void execute(DataManager* dataManager) = 0;
    // virtual void displayError() = 0;
};

#endif //IDATASTORAGE_H
