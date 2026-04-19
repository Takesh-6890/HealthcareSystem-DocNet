FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/HealthcareSystem.API/HealthcareSystem.API.csproj", "src/HealthcareSystem.API/"]
COPY ["src/HealthcareSystem.Application/HealthcareSystem.Application.csproj", "src/HealthcareSystem.Application/"]
COPY ["src/HealthcareSystem.Domain/HealthcareSystem.Domain.csproj", "src/HealthcareSystem.Domain/"]
COPY ["src/HealthcareSystem.Infrastructure/HealthcareSystem.Infrastructure.csproj", "src/HealthcareSystem.Infrastructure/"]
RUN dotnet restore "src/HealthcareSystem.API/HealthcareSystem.API.csproj"
COPY . .
RUN dotnet publish "src/HealthcareSystem.API/HealthcareSystem.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "HealthcareSystem.API.dll"]
