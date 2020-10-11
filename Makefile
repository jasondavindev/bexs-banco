build:
	yarn tsc --build tsconfig.json

dkbuild:
	docker build -t bexs-banco .
