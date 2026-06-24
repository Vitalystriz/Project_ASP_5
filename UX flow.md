
## Route Configurations (React Router Blueprint)

| **Route Path**            | **Screen / Page Component** | **Access Level**         | **Primary Epic Owner** |
| ------------------------- | --------------------------- | ------------------------ | ---------------------- |
| `/register`               | `Register.jsx`              | Public                   | **Member 1** (Epic 1)  |
| `/login`                  | `Login.jsx`                 | Public                   | **Member 1** (Epic 1)  |
| `/restaurants`            | `Restaurants.jsx`           | Protected (Requires JWT) | **Member 2** (Epic 2)  |
| `/restaurant/:id`         | `RestaurantPage.jsx`        | Protected (Requires JWT) | **Member 2** (Epic 2)  |
| `restaraunt/:id/products` | `ProductCard.jsx`           | Protected (Requires JWT) | **Member 2+3**         |
| `/orders/:id`             | `OrderPage.jsx`             | Protected (Requires JWT  | **Member 3**           |
| `orders/`                 | `HistoryOrdersPage.jsx`     | Protected (Requires JWT  | **Member 3**           |

## 2. Step-by-Step UX Flow & Component Breakdown

### Step 1: Entry & Onboarding (Epic 1)

- After completing registration, the user authenticates through `Login.jsx` and receives a JWT token.
    
- The application routes the user directly to the primary landing dashboard (`/restaurants`).
    

### Step 2: Exploring Restaurants (Epic 2)

- **Screen:** `Restaurants.jsx`
    
- **Components:**
    
    - `Navbar.jsx`: Standard header visible across all private routes. Contains a specialized **"Go to Cart" button** (Your Epic 3 link) which routes directly to `/cart`.
        
    - `RestaurantGrid.jsx`: A responsive grid container mapping out matching establishments.
        
    - `RestaurantCard.jsx`: Individual clickable card modules. Clicking a card navigates dynamically to `/restaurant/:id`.
        

### Step 3: Menu & Product Details with Recommendations 

- **Screen:** `RestaurantPage.jsx`
    
- **Components:**
    
    - `MenuGrid.jsx`: Loads and displays all food/drink items sold by the chosen restaurant.
        
    - `ProductCardModal.jsx`: Opened when clicking any specific menu product item.
        
        - **The Item Recommendations (Your Task):** As soon as this modal opens, it triggers a `fetch` request using both the restaurant UUID and product UUID to get recommendations directly from your backend:
            
            `GET http://localhost:5000/api/restaurants/:restaurantId/products/:productId/recommendations`
            
        - The output populates a list displaying items calculation-matched by your C++ recommendation engine backend.
            
        - **"Add to Order" Button Logic (Your Task):** Clicking this button on _either_ the main item or any recommended item fires an asynchronous API request:
            
            `POST http://localhost:5000/api/orders`
            
            _(This saves the selection directly to the database state on the Node.js server)._
            

### Step 4: Reviewing & Finalizing the Order
`OrderItem` component 

- **Screen:** `OrderPage.jsx` (Accessed via the Navbar link) 
    
- **Components:**
    
    - `ProductCartList.jsx`: Fetches the current temporary order's data states back from the server.
        
    - `ProductCartItemRow.jsx`: Displays item rows, allowing final confirmation of item tallies, quantity increments, or absolute item removal.
        
    - `CheckoutSubmit.jsx`: Final action panel verifying the calculated aggregate subtotal sums and submitting the finalized invoice data configuration to clear the system cache and conclude the order loop.
### Step 5: History of orders - personal account
- **Screen:** `HistoryOrdersPage.jsx` (Accessed via the Navbar link) 
-  **Components:**
    
    - `OrderList.jsx`: Fetches all orders in state fulfilled - after checkout 
        
    - `OrderItem.jsx`: Displays item rows, allowing to see item's data.
      The same component which we see in `OrderPage.jsx`
        
