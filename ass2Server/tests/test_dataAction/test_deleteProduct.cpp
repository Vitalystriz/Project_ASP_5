#include <gtest/gtest.h>
#include "DataManager.h"
#include "persistence/dataAction/DeleteProductAction.h"

// Helper function to set up a DataManager with default test data
DataManager setupDataManager() {
    DataManager dm;
    std::map<std::string, std::set<std::string>> userToProducts = {
        {"1", {"100", "101", "102"}},
        {"2", {"101", "103"}},
        {"3", {"104"}}
    };
    std::map<std::string, std::set<std::string>> productToUser = {
        {"100", {"1"}},
        {"101", {"1", "2"}},
        {"102", {"1"}},
        {"103", {"2"}},
        {"104", {"3"}}
    };

    dm.setMapUserToProducts(userToProducts);
    dm.setMapProductToUsers(productToUser);
    return dm;
}

// 1. Test deleting a single product from a user who still has other products left
TEST(DeleteProductActionTest, RemoveSingleProductUserRetainsOthers) {
    DataManager data_manager = setupDataManager();

    std::vector<std::string> products_to_delete = {"100"};
    DeleteProductAction action(products_to_delete, "1");
    action.execute(&data_manager);

    auto u2p = data_manager.getMapUserToProducts();
    auto p2u = data_manager.getMapProductToUser();

    // User 1 should still exist, but without product 100
    EXPECT_TRUE(u2p.count("1") > 0);
    EXPECT_EQ(u2p["1"], std::set<std::string>({"101", "102"}));

    // Product 100 should be completely removed since only user 1 had it
    EXPECT_TRUE(p2u.count("100") == 0);
}

// 2. Test deleting a shared product (product should remain for other users)
TEST(DeleteProductActionTest, RemoveSharedProduct) {
    DataManager data_manager = setupDataManager();

    std::vector<std::string> products_to_delete = {"101"};
    DeleteProductAction action(products_to_delete, "1"); // Delete from User 1
    action.execute(&data_manager);

    auto u2p = data_manager.getMapUserToProducts();
    auto p2u = data_manager.getMapProductToUser();

    // User 1 no longer has 101
    EXPECT_EQ(u2p["1"], std::set<std::string>({"100", "102"}));

    // Product 101 should still exist, but only map to User 2 now
    EXPECT_TRUE(p2u.count("101") > 0);
    EXPECT_EQ(p2u["101"], std::set<std::string>({"2"}));
}

// 3. Test deleting ALL products for a user (should trigger user cleanup)
TEST(DeleteProductActionTest, RemoveAllProductsTriggersUserCleanup) {
    DataManager data_manager = setupDataManager();

    std::vector<std::string> products_to_delete = {"104"};
    DeleteProductAction action(products_to_delete, "3"); // User 3 only has product 104
    action.execute(&data_manager);

    auto u2p = data_manager.getMapUserToProducts();
    auto p2u = data_manager.getMapProductToUser();

    // User 3 should be completely removed from the userToProducts map
    EXPECT_TRUE(u2p.count("3") == 0);

    // Product 104 should be completely removed from the productToUsers map
    EXPECT_TRUE(p2u.count("104") == 0);
}

// 4. Test deleting multiple products at once
TEST(DeleteProductActionTest, RemoveMultipleProductsAtOnce) {
    DataManager data_manager = setupDataManager();

    std::vector<std::string> products_to_delete = {"101", "103"};
    DeleteProductAction action(products_to_delete, "2"); // Deletes all of User 2's products
    action.execute(&data_manager);

    auto u2p = data_manager.getMapUserToProducts();
    auto p2u = data_manager.getMapProductToUser();

    // User 2 should be completely removed
    EXPECT_TRUE(u2p.count("2") == 0);

    // Product 101 should now only map to User 1
    EXPECT_EQ(p2u["101"], std::set<std::string>({"1"}));

    // Product 103 should be completely removed
    EXPECT_TRUE(p2u.count("103") == 0);
}

// 5. Test attempting to delete a product that does not exist
TEST(DeleteProductActionTest, RemoveNonExistentProduct) {
    DataManager data_manager = setupDataManager();

    std::vector<std::string> products_to_delete = {"999"};
    DeleteProductAction action(products_to_delete, "1");
    action.execute(&data_manager);

    auto u2p = data_manager.getMapUserToProducts();
    auto p2u = data_manager.getMapProductToUser();

    // Maps should remain exactly the same as before
    EXPECT_EQ(u2p["1"], std::set<std::string>({"100", "101", "102"}));
    EXPECT_TRUE(p2u.count("999") == 0);
}