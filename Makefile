build:
	yarn tsc --build tsconfig.json

dkbuild:
	docker build -t bexs-banco .

install:
	yarn install

.PHONY: test
test:
	yarn jest
