.PHONY: test build clean
test:
	python -m pytest tests/ -q
build:
	python -m portable_suite build --input examples/demo --name DemoSuite --version 0.1.0
clean:
	rm -rf builds/*
