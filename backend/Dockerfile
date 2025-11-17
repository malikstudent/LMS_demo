FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    curl \
    zip \
    unzip \
    git \
    mysql-client \
    oniguruma-dev

# Install PHP extensions
RUN docker-php-ext-install -j$(nproc) pdo_mysql mbstring

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

# Copy all files
COPY . .

# Create necessary directories
RUN mkdir -p bootstrap/cache storage/app/public/assignments storage/logs public && \
    chmod -R 775 storage bootstrap/cache public && \
    chmod -R 755 artisan

# Install composer dependencies
RUN echo "Installing dependencies..." && \
    composer install --optimize-autoloader --no-interaction 2>&1 | tail -20 || true && \
    echo "Composer install status: $?"

# Generate artisan key if needed
RUN if [ ! -f .env ]; then cp .env.example .env; fi || true && \
    php artisan key:generate 2>&1 || true

# Set final permissions
RUN chown -R www-data:www-data . || true

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
