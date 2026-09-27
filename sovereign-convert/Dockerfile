FROM ubuntu:22.04
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip nodejs npm curl git openjdk-17-jdk-headless && \
    rm -rf /var/lib/apt/lists/*
RUN npm install -g @bubblewrap/cli
WORKDIR /app
COPY . /app
RUN pip3 install --no-cache-dir -r scripts/requirements.txt
EXPOSE 8090
CMD ["python3", "scripts/convert.py", "--serve", "--port", "8090"]
