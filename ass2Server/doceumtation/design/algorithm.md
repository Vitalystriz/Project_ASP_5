# Product Recommendation Algorithm Guide

This document describes the recommendation algorithm for Exercise 1 in the Advanced Systems Programming course. The system aims to suggest relevant products to a user based on the behavior of other users with similar tastes.

## Algorithm Overview
The recommendation is based on a specific user (`userid`) and a specific product they are interested in (`productid`). The goal is to provide up to 10 recommendations for additional products.

## Step-by-Step Calculation

### 1. Calculate User Similarity
First, determine the similarity between the target user (User A) and every other user in the system.
* **Metric:** Similarity is defined by the number of common products both users have watched.
* **Example:** If User 1 watched products {100, 101, 102, 103} and User 5 watched {100, 102, 103, 105, 108, 111}, their similarity score is **3** (for products 100, 102, and 103).

### 2. Filter Relevant Users
Identify all users (excluding User A) who have watched the target `productid`.

### 3. Calculate Product Relevance Scores
For every **other** product watched by the filtered users identified in Step 2, calculate a "Total Relevance" score:
* **Formula:** The relevance of a product is the sum of the similarity scores of all users who watched that product.
* **Example Calculation:**
    * Target: User 1, Product 104.
    * Users who watched 104 are: 2, 3, 6, and 8.
    * To find the relevance of product **105**:
        * User 2 watched 105 (Similarity to User 1: **2**)
        * User 3 watched 105 (Similarity to User 1: **1**)
        * User 8 watched 105 (Similarity to User 1: **1**)
        * **Total Relevance for 105** = 2 + 1 + 1 = **4**.

### 4. Ranking and Output
* **Sort Order:** Products are ranked primarily by their **Total Relevance** score in descending order.
* **Tie-breaking:** If two products have the same relevance score, they must be sorted by their **product ID in ascending order**.
* **Limit:** The output should contain a maximum of 10 products.

## Example Output
Based on the provided appendix data for User 1 and Product 104, the output would be:
`105 106 111 110 112 113 107 108 109 114`.

---
*Note: This algorithm must be implemented as part of a CLI tool in C++.*