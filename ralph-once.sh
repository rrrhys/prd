#!/bin/bash

claude --permission-mode acceptEdits --dangerously-skip-permissions "@prd.json @readme.txt @progress.txt \
1. Read the PRD JSON file and progress file. Read the readme to understand how to work on the prd. \
2. Find the next incomplete task and implement it. \
3. Commit your changes. \
4. Update progress.txt with what you did. Add your comments to the comments field of prd.json and update the status. \
ONLY DO ONE TASK AT A TIME."
