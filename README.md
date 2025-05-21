# Blood Donation Support System Backend

[![NestJS](https://img.shields.io/badge/NestJS-v11.0.1-red.svg)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.15.0-green.svg)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-v7.0.0-red.svg)](https://redis.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.7.3-blue.svg)](https://www.typescriptlang.org/)

## Description | Mô tả

A robust backend system for managing blood donation operations, built with NestJS, MongoDB, and Redis. This system provides APIs for blood donation management, donor tracking, and inventory management.

Hệ thống backend mạnh mẽ để quản lý hoạt động hiến máu, được xây dựng bằng NestJS, MongoDB và Redis. Hệ thống này cung cấp các API để quản lý hiến máu, theo dõi người hiến và quản lý kho.

## Features | Tính năng

- RESTful API endpoints
- MongoDB database integration
- Redis caching
- Swagger API documentation
- Docker containerization
- Environment-based configuration
- Security features (Helmet, Compression)
- Input validation
- Error handling
- Testing setup (Unit, E2E)

## Prerequisites | Yêu cầu

- Node.js (v20 or higher)
- Docker and Docker Compose
- MongoDB
- Redis

## Installation | Cài đặt

1. Clone the repository:

```bash
git clone <repository-url>
cd blood-system-be
```

2. Install dependencies:

```bash
npm install
```

3. Create environment files:

```bash
cp .env.example .env
cp .env.example .env.docker
```

4. Update the environment variables in both `.env` and `.env.docker` files.

## Running the Application | Chạy ứng dụng

### Development | Phát triển

```bash
# Start the application
npm run start:dev

# Run tests
npm run test
npm run test:e2e
```

### Production | Sản xuất

Using Docker Compose:

```bash
docker-compose up -d
```

## API Documentation | Tài liệu API

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:${APP_PORT}/api
```

## Project Structure | Cấu trúc dự án

```
src/
├── config/         # Configuration files
├── modules/        # Feature modules
├── common/         # Shared resources
├── main.ts         # Application entry point
└── app.module.ts   # Root module
```

## Testing | Kiểm thử

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Contributing | Đóng góp

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License | Giấy phép

This project is licensed under the MIT License.
