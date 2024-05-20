#!/bin/bash

CYAN='\033[0;36m'
RESET_COLOR='\033[0m'

INFO_FLAG="[${CYAN}INFO${RESET_COLOR}]"

export GOOGLE_CLOUD_PROJECT=link-manager-f612c
export PUBSUB_EMULATOR_HOST=0.0.0.0:8085

TOPICS=("delete_condominium" "delete_member" "delete_user")

PIDS=()
killAllBackgroundProcess() {
	for pids in "${PIDS[@]}"; do
		/bin/echo -e "${INFO_FLAG} Killing background process: ${pids}"
		kill "$pids";
	done
}
trap killAllBackgroundProcess EXIT

/bin/echo -e "${INFO_FLAG} Starting pubsub emulator:"
gcloud beta emulators pubsub start &
PIDS+=($!)

sleep 10

for topic in "${TOPICS[@]}"; do
	/bin/echo -e "${INFO_FLAG} Creating topic: ${topic}"
	node ./tools/tests/pubsub/createTopic.cjs ${topic}

	EXIT_CODE=$?
	if [ ${EXIT_CODE} -ne 0 ]; then
		/bin/echo -e "${INFO_FLAG} Could not create topics. Received: ${EXIT_CODE} as exit code"
	fi
done

/bin/echo -e "${INFO_FLAG} Starting intergration tests..."
pnpm test:integration
EXIT_CODE=$?
if [ ${EXIT_CODE} -ne 0 ]; then
	/bin/echo -e "${INFO_FLAG} Could execute tests. Received: ${EXIT_CODE} as exit code"
fi

/bin/echo -e "${INFO_FLAG} Done."
exit 0

