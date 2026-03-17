init:
	@mkdir -p /tmp/42eat-db
	@docker compose up -d
	@cd back && npx prisma migrate dev --name init && cd ..

run: init
	pnpm run dev

.PHONY: run