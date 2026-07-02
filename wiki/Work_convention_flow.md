 # Work convention flow
# Application Page Flow & REST API Components Blueprint

This blueprint outlines the clean, backend-driven component hierarchy and interaction mechanics for the user journey, strictly separating Product definitions from Active Orders.

---

## 1. Visual Flow Diagram (Mermaid)

```mermaid
graph TD
    classDef epic1 fill:#f9f,stroke:#333,stroke-width:2px;
    classDef epic2 fill:#bbf,stroke:#333,stroke-width:2px;
    classDef epic3 fill:#f96,stroke:#333,stroke-width:2px;

    %% Authentication & Onboarding
    Start((User Entry)) --> PageReg[Registration Screen]
    PageReg -->|Success| PageLogin[Login Screen]
    PageLogin -->|JWT Secured Authed| PageRest[Restaurants Grid Screen]
    
    %% Restaurant Exploration
    PageRest -->|Click Restaurant Card| PageMenu[Restaurant Menu Screen]
    
    %% Product Presentation (Epic 2)
    PageMenu -->|Renders styled list| CompProductCard[ProductCard Component]
    CompProductCard -->|Click details| CompProductModal[Product Detail View Component]
    
    %% Recommendation Fetch
    CompProductModal -->|Triggers HTTP GET| APIRec["GET /api/restaurants/:resId/products/:prodId/recommendations"]
    APIRec -->|Displays sub-grid| CompProductCardRec[ProductCard Component for Recommendations]
    
    %% Active Ordering Flow (The Separation Trigger)
    CompProductModal -->|Click 'Add to Order'| APIOrder["POST /api/orders"]
    CompProductCardRec -->|Click 'Add to Order'| APIOrder
    
    %% Navigation to Final Cart
    CompNavbar(Navbar Header Component) -->|Click 'Go to Cart' Link| PageCart[Cart & Checkout Screen]
    
    %% Checkout Processing (Epic 3)
    PageCart -->|Renders list from server| CompOrderCard[OrderCard Component]
    CompOrderCard -->|Contains nested read-only item data| CompProductCardNested[ProductCard Component]
    CompOrderCard -->|Exposes quantity adjustments & controls| APIChanges["PATCH / DELETE /api/orders"]
    
    PageCart -->|Place Final Order| OrderFinalized((Order Completed))

    class PageReg,PageLogin,CompNavbar epic1;
    class PageMenu,CompProductCard,CompProductModal,CompProductCardRec epic2;
    class PageCart,CompOrderCard,CompProductCardNested epic3;