init:
	@mkdir -p /tmp/42eat-db
	@docker compose up -d

run: init
	pnpm run dev

.PHONY: run