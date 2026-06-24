# Algorithm Implementation
## 1) Similarity class 
### Fields 
- **similarityMap** `<userId, similarity>`. It maps every user to his similarity number. One to One connection 
### Methods 
- Calculate **similarityMap**
## 2) CandidateProducts class
### Fields 
- **candidateProductsMap** `<productId, userId>`. It maps product to users who watched itself and product with `target productId`. Except target `userId`. One to many

- It means we take all products from users who watched `target productId` and map them to these users