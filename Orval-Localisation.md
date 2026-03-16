# Orval and .NET API Integration

Orval uses the OpenAPI `operationId` to name its functions. If the .NET API doesn't provide one, Orval defaults to combining the HTTP verb and the route.

We can easily tell Swashbuckle to generate clean `operationIds` right inside the .NET controller by using the `Name` property on the HTTP attributes:

```csharp
[HttpGet(Name = "getAllBeans")]
```

**Routes conventional REST format (**`GetAllItems` → `/get-all-items`)**

It's a good practice to use new `RouteTokenTransformerConvention` to convert routes to conventional REST format. Otherwise we end up with long difficult to read endpoints.

Add this line to force all query parameters to be camelCase

```csharp
DescribeAllParametersInCamelCase()
```

OpenAPI (Swagger) specification does not support generic types.
When the .NET API generates the swagger.json file, Swashbuckle flattens PageResultDto<Entity> into a specific, concrete object and names it EntityPageResultDto. Orval is simply reading exactly what Swagger gives it.

### Clean up the requestBody and the responses in Swagger for MSW generation

**MSW handlers** mock network requests at the **network layer**, intercepting actual HTTP calls made by the application (e.g., `fetch`, `axios`) during tests or development. This allows us to simulate various API responses—success, errors, delays—without relying on a real backend. It's ideal for testing how the app behaves under different network conditions and ensures consistency across development and testing environments.

By default, when Swashbuckle (.NET's Swagger generator) creates the swagger.json, it declares that the endpoints can return data in three different formats: text/plain, application/json, and text/json.

When Orval's MSW generator reads the file, it trips over the text/plain content type. It gets confused, thinks the endpoint returns raw text, and **silently skips generating the TypeScript imports** for the DTOs in the .msw.ts files

This forces Swagger to ONLY generate 'application/json' responses. It prevents the 'text/plain' bug in Orval's MSW generator!

`new ProducesAttribute("application/json")`

Cleans up the requestBody in Swagger

`new ConsumesAttribute("application/json")`

**MSW** for API mocking in integration and end-to-end tests, and `vi.mocked` for unit testing where we want to isolate logic from dependencies.

- **setupServer(...getAuthMock()):** We don't have to manually write http.post(...) interceptors for every endpoint. Orval bundles all the endpoints of the Auth controller into getAuthMock().

- **getLoginMockHandler(customResponse):** This is the real magic of Orval's MSW generator. If we pass an object into this function, Orval safely overrides the faker data and guarantees the test uses exactly what we provided.

- **Network Isolation:** Because MSW intercepts the fetch/XHR requests at the Node network level, the axios-instance.ts will actually fire off an HTTP request, but it will never hit the real .NET API. It's completely isolated.

- **Type Safety:** The entire test is strictly typed. If we try to pass an invalid customResponse into getLoginMockHandler, TypeScript will throw an error because it strictly expects AuthResponseDto.

# Replace try / catch in controllers with GlobalExceptionHandler

The IExceptionHandler interface was added to the .NET ecosystem in .NET 8It was introduced as a modern, structured, and modular way to handle exceptions globally within ASP.NET Core applications, providing an alternative to creating custom exception-handling middleware or using try-catch blocks throughout the codebase.

This intercepts any error that happens anywhere in the application, logs it, and returns a clean JSON error response to the frontend.

**Advantages**

- **Separation of Concerns:** The Controllers focus on HTTP, the Services focus on Business Logic, and the Exception Handler focuses on Errors.

- **Security:** It prevents "Yellow Screens of Death" or stack traces from leaking to the user (hackers).

- **Consistency:** Every error in the app returns the exact same JSON structure (ProblemDetails), making it easy for the Frontend to handle errors uniformly.

Register Handler

```csharp
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

Use Handler
app.UseExceptionHandler(); 
```

# Fetching Data

**Vue Query**

- **Caching & Deduplication:** If two components request the same data, it only makes one network call.
- **Stale Time:**We can tell it, "This data is good for 5 minutes, don't ever refetch it before then."
- **Dependent Queries:** "Don't run Query B until Query A finishes and gives me an ID."
- **Background Refetching:** Automatically updates stale data in the background (e.g., when the user refocuses the browser window).
- **Built-in States:** Gives us reactive isLoading, isError, isFetching, and data out of the box.
- **Optimistic Updates:** Allows the UI to update instantly before the server confirms the mutation.

**Axios with (Interceptors)**
- Automatically attaching Bearer [token] to the Authorization header on every request.
- Automatically catching 401 Unauthorized responses to trigger a silent token refresh, then retrying the failed request.
- Global error handling (e.g., showing a toast notification if the server returns a 500).

**VueUse useFetch**
- Is literally just a reactive wrapper around the browser's native fetch() API. It gives isFetching and data refs and interdeptors but it does not cache data globally. If two components call it, it makes two network requests. 
- Use isFetching, isFinish

# Localisation
- **Advantages of Localisation:** easy to add from ground up, improves development experience, autocomplete, reusability, less typos, easy to update titles, etc.

Create .json in locals/en on the frontend, SharedResources.cs and .resx files in the Resources folder on backend.

Localise built-in DataAnnotations (e.g. [Required],[MaxLength])
```csharp
.AddDataAnnotationsLocalization()
```

Configure Request Localisation
```csharp
var supportedCultures = new[] { "en-GB", "en" };
```

Make English UK the default
```csharp
var localizationOptions = new RequestLocalizationOptions()
.SetDefaultCulture("en-GB");
```

Use Handler
```csharp
app.UseRequestLocalization(localizationOptions);
```