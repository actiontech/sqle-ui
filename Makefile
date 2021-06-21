test:
	docker run --rm -v $PWD:/app docker-registry:5000/actiontech/yarn_build_v15 -c "cd /app && yarn test"
