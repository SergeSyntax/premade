# Builder stage
FROM python:3.9-slim as builder

WORKDIR /opt/mongo-init/

# Copy requirements.txt and install dependencies
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --target ./dependencies

# Copy application code
COPY ./app ./app

# Final stage using distroless Python
FROM gcr.io/distroless/python3

WORKDIR /opt/mongo-init/

# Copy application and dependencies from the builder stage
COPY --from=builder /opt/mongo-init /opt/mongo-init

# Set PYTHONPATH for the application and dependencies
ENV PYTHONPATH="/opt/mongo-init:/opt/mongo-init/dependencies"

# Command to run the application
CMD ["/opt/mongo-init/app/main.py"]
