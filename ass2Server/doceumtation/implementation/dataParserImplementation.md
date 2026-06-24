# Data Parser design
Data parser is responsible for handling with information 
## It needs to maintain next operation:
1) Append user
2) Append product
3) Find appropriate recommendation (Algorithm's part)
4) Remove user (In the future)
5) Remove product (In the future)
## Separation between data management and maintenance **TXT** file
In order to afford flexibility and simplification of the algorithm's work we won't keep data in **TXT** file only, we will keep a matrix  (users as a rows and products as a columns) or vector of linked lists (like graphs btw). And then we write down difference directly to TXT file

We will have two interfaces

1) [IDataAction](Project_ASP/doceumtation/dataParser.md:17)
2) [IDataStorage](Project_ASP/doceumtation/dataParser.md:21)

## IDataAction
Classes implementing this *interface* are responsible for execution changes in matrix. 
They are getting *pointer* to the matrix as an argument of `execute` method

## IDataStorage
Classes implementing this *interface* are responsible for parsing these specific changes from matrix to **TXT** file
Also getting **pointer** to matrix as an argument