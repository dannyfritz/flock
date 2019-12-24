#!/usr/bin/env bash
rm -rf ./docs/api
typedoc --mode modules --theme ./theme --readme none --tsconfig ../src/tsconfig.json --out ./docs/api --excludePrivate --excludeNotExported --hideSources --hideBreadcrumbs --plugin typedoc-plugin-markdown ../src
mv ./docs/api/classes/* ./docs/api/
rm -rf ./docs/api/README.md ./docs/api/modules ./docs/api/classes
