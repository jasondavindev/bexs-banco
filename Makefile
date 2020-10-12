build:
	yarn tsc --build tsconfig.json

run:
	docker-compose up

run/cli:
	docker run --rm -v ${PWD}:/app -w /app -it node:14 yarn ts-node src/cli example/input_file.csv

install:
	docker run --rm -v ${PWD}:/app -w /app node:14 yarn install

.PHONY: test
test:
	docker run --rm -v ${PWD}:/app -w /app node:14 yarn test
