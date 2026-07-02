FROM python:3.11-slim-bookworm

WORKDIR /app
RUN apt-get update && apt-get install -y \
    libg1-mesa-glx\
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY . .
RUN pip install --no-cache-dir -r requirements.txt

Expose 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]