# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the Solution file (if you have one) or manually copy project files
# We copy project files individually to leverage Docker caching for 'dotnet restore'

COPY ["AllTheBeans.API/AllTheBeans.API.csproj", "AllTheBeans.API/"]
COPY ["AllTheBeans.Application/AllTheBeans.Application.csproj", "AllTheBeans.Application/"]
COPY ["AllTheBeans.Domain/AllTheBeans.Domain.csproj", "AllTheBeans.Domain/"]
COPY ["AllTheBeans.Infrastructure/AllTheBeans.Infrastructure.csproj", "AllTheBeans.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "AllTheBeans.API/AllTheBeans.API.csproj"

# Copy the rest of the source code
COPY . .

# Build and Publish
WORKDIR "/src/AllTheBeans.API"
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Create a folder for the SQLite DB to ensure permissions
RUN mkdir -p /app/data

# Copy the build artifacts
COPY --from=build /app/publish .

# Expose the port .NET 8 uses by default in Docker
EXPOSE 8080

ENTRYPOINT ["dotnet", "AllTheBeans.API.dll"]