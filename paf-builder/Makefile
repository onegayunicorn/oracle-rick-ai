.PHONY: test build clean
test:
	python -m pytest tests/ -q
build:
	python -m paf_builder --input examples/demo --name DemoApp --version 0.1.0
clean:
	rm -rf builds/*
