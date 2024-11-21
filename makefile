.PHONY: clean

clean:
	docker volume ls
	docker compose down -v
	docker volume prune -f
	docker volume ls
