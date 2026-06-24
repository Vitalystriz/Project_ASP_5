# Technical contract for `assignment2`
## Server/ Client integration, command's modification 
##  Class Responsibilities & Operational Contracts

### 1.1 `TcpServer` (Networking Layer - Black Box)
* **Ownership Rule:** Does **not** own, instantiate, or reference `SocketMenu`, `App`, or `DataManager`. It holds a singular reference to `IRequestHandler&`.
* **Physical Task:** Manages OS-level POSIX socket operations (`socket()`, `bind()`, `listen()`, `accept()`, `recv()`, `send()`).
* **Execution Contract:** When data arrives over the socket descriptor (`client_fd`), it reads the buffer up to the `\n` boundary, packs it into a `std::string`, and pushes it into `handler.handleRequest(packet)`. It immediately writes the returned string back to the socket.

### 1.2 `Initialization` (The System Orchestrator & Mediator)
* **Ownership Rule:** Inherits from `IRequestHandler`. It acts as the absolute Mediator and owns the lifecycle of the stateful `DataManager`, the local `SocketMenu` parser instance, and the `App` coordination engine.
* **Execution Contract:** Implements `handleRequest(string)`. When triggered by the server, it executes the following synchronous pipeline:
    1. `socketMenu.feedRawString(raw_buffer)` — Loads the payload into the parser.
    2. `app.runOnce()` — Dispatches command extraction and execution.
    3. `return socketMenu.getFormedResponse()` — Extracts the output and returns it up to the server.

### 1.3 `SocketMenu` (Text Parsing Automaton)
* **Ownership Rule:** Implements `IMenu`. It remains completely free of networking primitives (`sys/socket.h`, file descriptors, or port identifiers).
* **Execution Contract:** Parses raw text. `feedRawString` splits the first word into an internal command identifier and the remaining slice into arguments. When an executable command runs `printResults(msg)`, this class buffers that string into a dedicated `output_response` variable, appending standard protocol newline markers.

### 1.4 `App` (The Command Dispatcher)
* **Execution Contract:** Invokes `menu->nextCommand()`. If the returned ID exists within the commands registry map, it invokes `execute()` on that target command object within a protected `try-catch` scope. If parsing failure pointers arise, it immediately fallbacks to `menu->displayError("400 Bad Request")`.

---

## 2. Text-Based Network Communication Protocol
All requests and responses exchanged through the `IRequestHandler` gateway must follow a strict newline-terminated text contract.

### 2.1 Client-to-Server Command Signatures
* **POST:** `POST <userId> <productId>\n`
* **PATCH:** `PATCH <userId> <productId>\n`
* **DELETE:** `DELETE <userId> <productId>\n`
* **GET (Recommend):** `GET <userId>\n`

### 2.2 Server-to-Client Response Signatures

#### Success Paths:
* **Upon data creation (POST):** `201 Created\n`
* **Upon data alteration/deletion (PATCH / DELETE):** `204 No Content\n`
* **Upon computational request (GET):** `200 Ok\n\n<comma-separated-recommendation-IDs>\n`

#### Error Paths:
* **Syntactical errors or unknown action structures:** `400 Bad Request\n`
* **Entity not found in sparse matrix index lookup (e.g., patching a non-existent user):** `404 Not Found\n`