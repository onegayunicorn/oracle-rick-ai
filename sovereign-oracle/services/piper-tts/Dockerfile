FROM debian:bookworm-slim
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates python3 python3-pip python3-venv \
    && rm -rf /var/lib/apt/lists/*
ARG TARGETARCH
RUN if [ "$TARGETARCH" = "arm64" ]; then \
      curl -L https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_aarch64.tar.gz -o /tmp/piper.tar.gz; \
    else \
      curl -L https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz -o /tmp/piper.tar.gz; \
    fi && \
    tar -xzf /tmp/piper.tar.gz -C /usr/local/ && \
    ln -s /usr/local/piper/piper /usr/local/bin/piper && \
    rm /tmp/piper.tar.gz
WORKDIR /app
COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt
COPY models/ /app/models/
COPY server.py ./
EXPOSE 8000
CMD ["python3", "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
