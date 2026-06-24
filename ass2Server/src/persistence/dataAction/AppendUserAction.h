

#ifndef APPENDUSERACTION_H
#define APPENDUSERACTION_H

#include "IDataAction.h"

class AppendUserAction : public IDataAction {
private:
    std::string userId;
    std::vector<std::string> products;
  public:
    explicit AppendUserAction(std::string userId, std::vector<std::string> products);
    void execute(DataManager* dataManager) override;
    void displayError() override;
};

#endif //APPENDUSERACTION_H
