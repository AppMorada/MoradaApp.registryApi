#!/bin/sh

CYAN='\033[0;36m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
RESET_COLOR='\033[0m'

INFO_FLAG="[${CYAN}INFO${RESET_COLOR}]"
BULLET_PT="${CYAN}${RESET_COLOR}"
WARN_FLAG="[${ORANGE}WARN${RESET_COLOR}]"

/usr/bin/clear

SHA256=$(find src -not -wholename *.spec.ts -type f -exec sha256sum {} \; | sha256sum | sed 's/...$//')
TIME=$(( $(date +%s%N)/1000000 ))

if ! test -f ./project-metadata.dev.json || ! test -d ./dist; then
    /bin/echo -e "${WARN_FLAG} Impossible to find any trustable dist source. Building the project..."
    pnpm nest build

    METADATA_FILE="{\n\t\"sha256Token\": \"${SHA256}\",\n\t\"iat\": ${TIME}\n}"
    printf "%b\t" $METADATA_FILE | tee "./project-metadata.dev.json" > /dev/null
fi

/bin/echo -e "${INFO_FLAG} Executing the following commands in parallel:"
/bin/echo -e "  ${BULLET_PT}  ${ORANGE}firestore.sh${RESET_COLOR}"
/bin/echo -e "  ${BULLET_PT}  ${ORANGE}build:watch.sh${RESET_COLOR}"
/bin/echo -e "  ${BULLET_PT}  ${ORANGE}functions.sh${RESET_COLOR}"

BUILD_CMD="sh -c ./tools/build:watch.sh"
FIRESTORE_CMD="sh -c ./tools/firestore.sh"

REGISTRY_FN_CMD="npm-watch functions:registryapi"

pnpm dotenv -e .env -- \
    concurrently \
    -n buildproj,firestore,fn:registryapi --timings -c "magenta.bold,yellow.bold,green.bold" \
    "${BUILD_CMD}" \
    "${FIRESTORE_CMD}" \
    "${REGISTRY_FN_CMD}"
