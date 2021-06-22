test:
	docker run --rm -v ${shell pwd}:/app docker-registry:5000/actiontech/sqle-ui-unit-test
