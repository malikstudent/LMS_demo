#!/bin/bash

# LMS Utility Script for common operations

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if docker-compose is available
check_docker() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-compose is not installed"
        exit 1
    fi
}

# Start services
start() {
    print_info "Starting services..."
    check_docker
    docker-compose up -d --build
    print_success "Services started"
    print_info "Waiting for services to be ready..."
    sleep 10
    docker-compose ps
}

# Stop services
stop() {
    print_info "Stopping services..."
    check_docker
    docker-compose down
    print_success "Services stopped"
}

# Reset database
reset_db() {
    print_warning "This will delete all data in the database!"
    read -p "Are you sure? (yes/no): " -r
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_info "Resetting database..."
        docker-compose exec app php artisan migrate:fresh --seed
        print_success "Database reset and seeded"
    else
        print_info "Reset cancelled"
    fi
}

# Run tests
test_backend() {
    print_info "Running backend tests..."
    docker-compose exec app php artisan test
}

# View logs
logs() {
    local service=$1
    if [ -z "$service" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f $service
    fi
}

# Exec into container
exec_app() {
    docker-compose exec app bash
}

exec_frontend() {
    docker-compose exec frontend bash
}

exec_db() {
    docker-compose exec db mysql -u lmsuser -p lms
}

# Install package
install_package() {
    local package=$1
    if [ -z "$package" ]; then
        print_error "Please specify package name"
        exit 1
    fi
    print_info "Installing $package in frontend..."
    docker-compose exec frontend npm install $package
    print_success "$package installed"
}

# Help
show_help() {
    cat << EOF
LMS Utility Script

Usage: ./lms.sh <command> [options]

Commands:
    start                Start all services
    stop                 Stop all services
    reset-db            Reset database (⚠️  destructive)
    test                 Run backend tests
    logs [service]       View logs (app, frontend, db, nginx)
    exec-app            Execute into app container
    exec-frontend       Execute into frontend container
    exec-db             Execute into database container
    npm [package]       Install NPM package in frontend
    help                Show this help message

Examples:
    ./lms.sh start
    ./lms.sh logs app
    ./lms.sh npm axios
    ./lms.sh reset-db

EOF
}

# Main
case "${1:-help}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    reset-db)
        reset_db
        ;;
    test)
        test_backend
        ;;
    logs)
        logs "$2"
        ;;
    exec-app)
        exec_app
        ;;
    exec-frontend)
        exec_frontend
        ;;
    exec-db)
        exec_db
        ;;
    npm)
        install_package "$2"
        ;;
    help)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
