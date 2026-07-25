# Local Docker workflow (host build → runtime image)
INFRA_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
ROOT_DIR := $(abspath $(INFRA_DIR)/..)
COMPOSE := docker compose -f $(INFRA_DIR)/docker-compose.yml
IMAGE ?= starter-app:latest

.PHONY: help pack up down logs health clean

help:
	@echo "Local Docker (build on host, run in container)"
	@echo "  make pack     pnpm build:docker + docker image"
	@echo "  make up       start container"
	@echo "  make down     stop container"
	@echo "  make logs     follow logs"
	@echo "  make health   curl /api/health"

pack:
	cd $(ROOT_DIR) && pnpm build:docker
	docker build -f $(INFRA_DIR)/Dockerfile -t $(IMAGE) $(ROOT_DIR)

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f app

health:
	@curl -sf http://localhost:3000/api/health && echo " OK" || echo " FAILED"

clean:
	$(COMPOSE) down --rmi local 2>/dev/null || true
