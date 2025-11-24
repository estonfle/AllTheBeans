# All The Beans

This is a full-stack application designed to market coffee products, featuring a "Bean of the Day" mechanic, user authentication, and a complete ordering system.

## 🚀 Technology Choices & Architecture

In building this solution, I prioritized **scalability, testability, and separation of concerns**. Here is a breakdown of the architectural decisions I made:

### Backend (.NET 8)
*   **Onion Architecture:** I structured the solution into four distinct layers (`Domain`, `Application`, `Infrastructure`, `API`). This ensures that my core business logic depends on abstractions rather than concrete database implementations or HTTP frameworks.
*   **Repository Pattern:** I implemented the Repository pattern to abstract data access. This allows the application logic to remain agnostic of the underlying database technology.
*   **Dependency Injection (DI):** I used the built-in .NET DI container to manage dependencies, making the code loosely coupled and highly testable.
*   **Code-First Approach:** The database schema is generated from the C# models. I included a Seeding logic that populates the database from the provided `beans.json` file upon the first run.
*   **Global Error Handling:** I avoided try-catch blocks in Controllers. Instead, I implemented a global `IExceptionHandler` that catches exceptions and returns standardized `ProblemDetails` JSON responses.
*   **Authentication & Security:** I used **ASP.NET Core Identity** for user management and **JWT (JSON Web Tokens)** for stateless authentication. I configured the API to require unique email addresses and secured endpoints using the `[Authorize]` attribute.

### Frontend (React 19 + TypeScript)
*   **Vite:** I chose Vite for its superior build performance and developer experience compared to Create React App.
*   **Material UI (MUI):** I used MUI to create a responsive, polished, and accessible UI grid system.
*   **Axios & Interceptors:** I implemented a central API client with Axios. I configured **Interceptors** to automatically attach JWT tokens to requests and to catch global errors (like 401 Unauthorized or 500 Server Errors) and broadcast them to the UI.
*   **Context API:** I used React Context for state management across the application:
    *   `AuthContext`: Manages login state and JWT decoding.
    *   `CartContext`: Manages the multi-item shopping cart logic locally before checkout.
    *   `NotificationContext`: A global event listener that displays Toast/Snackbar messages for success or error feedback.
*   **Image Optimization:** To improve performance, I implemented a utility that leverages the Unsplash API to dynamically resize images. This creates a "Lazy Loading" effect where we fetch small thumbnails for the grid and higher-quality images only for the details popup.

---

## 🛠️ Prerequisites

*   **Docker** (Recommended for running the full stack)
*   **.NET 8 SDK** (If running locally)
*   **Node.js 20+** (If running locally)

---

## 🐳 Running with Docker (Recommended)

I have containerized both the Frontend (Nginx) and the Backend (.NET) along with a volume for the SQLite database.

1.  Navigate to the root directory of the project.
2.  Run the following command:
    ```bash
    docker compose up --build
    ```
3.  Once the build finishes, access the application:
    *   **Frontend:** [http://localhost:3000](http://localhost:3000)
    *   **Backend Swagger:** [http://localhost:5089/swagger](http://localhost:5089/swagger)

*Note: The database file `AllTheBeans.db` will be persisted in a `db_data` folder in your project root.*

---

## 💻 Running Locally (Manual)

If you prefer to run the applications without Docker, follow these steps.

### 1. Backend
1.  Navigate to the `AllTheBeans-Backend` folder.
2.  Restore and run the project:
    ```bash
    dotnet restore
    dotnet run --project AllTheBeans.API
    ```
3.  The API will be available at `http://localhost:5089`.
4.  *Note:* The database will be created automatically on the first run.

### 2. Frontend
1.  Navigate to the `AllTheBeans-Frontend` folder.
2.  Install dependencies and start the dev server:
    ```bash
    npm install
    npm run dev
    ```
3.  The UI will be available at `http://localhost:5173`.

---

## 🧪 Running Tests

I have implemented comprehensive unit tests for both the backend logic and frontend components.

### Backend Tests
I used **xUnit**, **Moq**, and **FluentAssertions** (v6.12.0) to test the Services.
*   **Coverage:** Tests the "Bean of the Day" logic (ensuring randomness and non-repetition), Order calculations, and Security checks (preventing users from modifying others' orders).

To run backend tests:
```bash
cd Backend/AllTheBeans.Tests
dotnet test
```

### Frontend Tests
I used **Vitest** and **React Testing Library** to test components and state logic.
*   **Coverage:** Tests the Cart calculations, Authentication state management, and page rendering (including mocking API calls).

To run frontend tests:
```bash
cd Frontend
npm test
```

---

## ✨ Key Features

1.  **Bean of the Day:** Logic ensures a random bean is selected daily and never repeats the previous day's selection.
2.  **Advanced Search:** Server-side filtering and pagination (9 items per page) for performance.
3.  **Authentication:** Full Registration and Login flow using Email/Password.
4.  **Ordering System:**
    *   Add multiple items to a persistent cart.
    *   Checkout process saving order history.
    *   Ability to **Modify** (edit quantities) or **Cancel** active orders.
5.  **Performance:** Client-side debouncing on search and server-side pagination ensures the app remains fast even with large datasets.