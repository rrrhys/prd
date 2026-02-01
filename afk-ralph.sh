

#!/bin/bash
set -e

# Auto-persist: if running in a terminal and not already under nohup, re-exec with nohup
if [ -t 0 ] && [ -z "$NOHUP_MODE" ]; then
  export NOHUP_MODE=1
  LOG_FILE="ralph-$(date +%Y%m%d-%H%M%S).log"
  echo "Starting in persistent mode. Output: $LOG_FILE"
  nohup "$0" "$@" > "$LOG_FILE" 2>&1 &
  echo "Process started with PID: $!"
  echo "Monitor with: tail -f $LOG_FILE"
  exit 0
fi

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

for ((i=1; i<=$1; i++)); do
  result=$(claude --permission-mode acceptEdits --dangerously-skip-permissions -p "@.prd/prd.json @.prd/readme.txt @progress.txt \
1. Read the PRD JSON file and progress file. Read the readme to understand how to work on the prd. \
2. Find the next incomplete task and implement it. \
3. Commit your changes. \
4. Update progress.txt with what you did. Add your comments to the comments field of prd.json and update the status. \
  5. Commit your changes and push. Make a PR on github. \
  6. Add any other tasks you find to the PRD. \
ONLY DO ONE TASK AT A TIME. \
  If the PRD is complete, output <promise>COMPLETE</promise>.")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "PRD complete after $i iterations."
    exit 0
  fi
done
