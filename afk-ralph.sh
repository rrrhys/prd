

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
  result=$(claude --permission-mode acceptEdits -p "@PRD.md @progress.txt \
  0. Commit and push any changes. You can push to git yourself.
  1. Find the highest-priority task and implement it. \
  1.a. All work should be on a git branch. \
  2. Run your tests and type checks. \
  3. Update the PRD with what was done. \
  4. Append your progress to progress.txt. \
  5. Commit your changes and push. Make a PR on github. \
  6. Add any other tasks you find to the PRD. \
  7. Any problems or blockers you find, add to 'problems.txt' for me to review. \
  ONLY WORK ON A SINGLE TASK. \
  If the PRD is complete, output <promise>COMPLETE</promise>.")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "PRD complete after $i iterations."
    exit 0
  fi
done
