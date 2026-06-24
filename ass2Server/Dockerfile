# Stage 1: Build
FROM gcc:latest AS builder
RUN apt-get update && apt-get install -y cmake

WORKDIR /app/ass2Server
COPY . .

RUN mkdir build && cd build && cmake .. && make

# Stage 2: App Run (Main target)
FROM ubuntu:latest AS runtime
WORKDIR /app/ass2Server
COPY --from=builder /app/ass2Server/build/src/RecommendationApp .
RUN mkdir -p data # We create data in the beginning of every launch

CMD ["./RecommendationApp", "8080"]
