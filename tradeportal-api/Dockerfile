# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy all projects to restore dependencies
COPY ["TradePortal.Api/TradePortal.Api.csproj", "TradePortal.Api/"]
COPY ["TradePortal.Application/TradePortal.Application.csproj", "TradePortal.Application/"]
COPY ["TradePortal.Domain/TradePortal.Domain.csproj", "TradePortal.Domain/"]
COPY ["TradePortal.Infrastructure/TradePortal.Infrastructure.csproj", "TradePortal.Infrastructure/"]

RUN dotnet restore "TradePortal.Api/TradePortal.Api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/TradePortal.Api"
RUN dotnet build "TradePortal.Api.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "TradePortal.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Important: Create uploads directory to ensure it exists
RUN mkdir -p /app/wwwroot/uploads

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "TradePortal.Api.dll"]
