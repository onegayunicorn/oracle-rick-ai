.PHONY: all setup build-pwa build-apk serve clean

all: setup build-pwa serve

setup:
	./scripts/setup.sh

build-pwa:
	./scripts/build-pwa.sh examples/sample-app.exe builds/myapp

build-apk:
	./scripts/build-apk.sh builds/myapp

serve:
	./scripts/serve-local.sh

clean:
	rm -rf builds/* dist/*
