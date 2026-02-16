# Используем Ubuntu 22.04 как базовый образ
FROM ubuntu:22.04

# Избегаем интерактивных запросов при установке пакетов
ENV DEBIAN_FRONTEND=noninteractive

# Обновляем пакеты и устанавливаем необходимые зависимости
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    sudo \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Создаем пользователя node с возможностью sudo
RUN useradd -m -s /bin/bash node && \
    echo "node ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Устанавливаем Node.js 22.x (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# Проверяем версию Node.js и npm
RUN node --version && npm --version

# Устанавливаем глобальные пакеты
RUN npm install -g http-server @vue/cli @vue/cli-service-global

# Переключаемся на пользователя node
USER node
WORKDIR /workspace

EXPOSE 8080 5173 8000