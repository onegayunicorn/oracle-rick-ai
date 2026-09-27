# Module Creator Guide

Generates a standalone installable package preconfigured for any voice ID.

## Python output
your-package/ pyproject.toml, README.md, your_package/__init__.py, client.py, cli.py

## Node output
your-package/ package.json, index.js, cli.js, README.md

## Usage
Dashboard -> Module Creator -> fill form -> download .tar.gz ->
`pip install .` or `npm install`. CLI: `your-pkg "text" -o out.mp3`.
