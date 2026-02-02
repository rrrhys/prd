PRD (Product Requirements Document) System
==========================================

OVERVIEW
--------
This directory contains a JSON-based PRD system for managing project tasks in a
JIRA-like ticket format. The system uses a simple array of ticket objects stored
in JSON files.

FILES
-----
- prd.json          : The working PRD file containing actual project tickets
- prd.json.example  : Example file with placeholder tickets demonstrating structure
- readme.txt        : This documentation file

DATA STRUCTURE
--------------
The PRD file is a JSON array of ticket objects. Each ticket object contains the
following fields:

FIELD SPECIFICATIONS
--------------------

id (number, required)
  - Unique numeric identifier for the ticket
  - Must be unique across all tickets
  - Should increment sequentially (1, 2, 3, ...)
  - Cannot be changed once assigned

title (string, required)
  - Brief, descriptive title for the ticket
  - Should clearly summarize the task

description (string, required)
  - Detailed description of the task
  - Include acceptance criteria, context, and any relevant details

status (string, required)
  - Current state of the ticket
  - MUST be one of the following values:
    * "backlog"        - Ticket is in the backlog, not yet ready for development
    * "marked for dev" - Ticket is ready and marked for development
    * "in dev"         - Ticket is actively being developed
    * "dev done"       - Development is complete, ready for UAT
    * "uat done"       - User acceptance testing is complete

effort (number, required)
  - Story points estimate for the ticket
  - Represents relative effort/complexity
  - Typically uses Fibonacci-like scale: 1, 2, 3, 5, 8, 13, 21

priority (string, required)
  - Priority level for the ticket
  - MUST be one of the following values:
    * "low"   - Low priority
    * "med"   - Medium priority
    * "high"  - High priority

assignee (string, required)
  - Name or identifier of the person assigned to this ticket
  - Can be a name, username, or email

createdDate (string, required)
  - Date the ticket was created
  - MUST use ISO date format: YYYY-MM-DD
  - Example: "2026-01-15"

comments (array, required)
  - Array of comment strings for tracking progress notes and updates
  - Each comment is a simple string
  - Can be empty array [] if no comments yet
  - Add new comments as work progresses
  - **TIME TRACKING**: Include time estimates in comments:
    * When starting: "estimated X hours for mid-level dev"
    * When finishing: "estimated time taken: X hours for mid-level dev"
  - Examples:
    * "2026-01-16: Started implementation - estimated 3 hours for mid-level dev"
    * "Blocked on API access"
    * "2026-01-16: PR created - estimated time taken: 3.5 hours for mid-level dev"

prs (array, required)
  - Array of pull request URL strings
  - Each PR URL should be the full GitHub URL to the pull request
  - Can be empty array [] if no PRs yet
  - Add PR URLs as they are created during implementation
  - Multiple PRs can be listed if changes span multiple repositories (app, api)
  - Examples: "https://github.com/AwesomeProjectManagement/app/pull/296"

clientRef (string, optional)
  - Client reference identifier or ticket number from external system
  - Used to track the original request or bug report
  - Can be null or omitted if not applicable
  - Examples: "86d1me4xu", "JIRA-1234", "Support-5678"

EXAMPLE TICKET
--------------
{
  "id": 1,
  "title": "Implement user login feature",
  "description": "Create login page with username/password authentication. Include form validation and error handling.",
  "status": "dev done",
  "effort": 5,
  "priority": "high",
  "assignee": "john.doe",
  "createdDate": "2026-01-15",
  "comments": [
    "2026-01-16: Started implementation - estimated 3 hours for mid-level dev",
    "2026-01-16: Created login form component with validation",
    "2026-01-16: PR created - estimated time taken: 3.5 hours for mid-level dev"
  ],
  "prs": [
    "https://github.com/AwesomeProjectManagement/app/pull/123"
  ],
  "clientRef": null
}

USAGE GUIDELINES
----------------

For Humans:
1. Edit prd.json directly to add, modify, or remove tickets
2. Ensure all required fields are present and use valid values
3. Keep IDs unique and sequential
4. Use consistent date format (YYYY-MM-DD)
5. Move tickets through statuses as work progresses

For LLMs:
1. Read prd.json to understand current project state
2. When adding tickets, find the highest existing ID and increment by 1
3. Validate all field values against the specifications above
4. Preserve JSON formatting for readability
5. Use current date (YYYY-MM-DD format) for createdDate when creating new tickets
6. Ensure status transitions follow logical flow:
   backlog → marked for dev → in dev → dev done → uat done
7. **IMPORTANT - BEFORE STARTING ANY NEW TASK**: Check for open PRs needing attention
   - Before starting work on a new ticket, check if any tasks have:
     * Status NOT "uat done" AND
     * Non-empty "prs" array (indicating open PRs)
   - If such tasks exist, check those PRs for comments from Cursor bot or review feedback
   - Address any Cursor bot comments by making corrections and pushing new commits
   - Add a comment to the ticket noting what corrections were made
   - Only after addressing PR feedback should you start work on a new task
8. **IMPORTANT**: When you start working on a ticket, immediately update its status to "in dev"
   - This allows users to monitor which task you're currently working on
   - Update the status BEFORE you begin implementation work
   - Add a comment noting when you started work on the ticket
   - **TIME ESTIMATION**: Add an estimated "time required" for a mid-level developer
     Example: "2026-02-02: Started implementation - estimated 2 hours for mid-level dev"
9. **IMPORTANT**: When you complete a ticket implementation, create a Pull Request:
   - **Branch Strategy**: Start from the 'main' branch whenever possible to ensure each task
     has its own clean PR. Exception: If the task is a smaller part of a bigger feature that's
     already in progress on a branch, it's OK to continue on that branch. In this case,
     multiple related tasks may share the same PR.
   - Determine which repository the changes are in (app/ or api/)
   - Navigate to the appropriate repository directory
   - Commit your changes with a descriptive message
   - Push the branch to origin
   - Create a PR using gh CLI with a summary and test plan
   - Include "Fixes PRD task #X" in the PR description
   - Update the ticket status to "dev done"
   - Add the PR URL(s) to the "prs" array field
   - Add a comment noting the PR was created
   - **TIME TRACKING**: Add an "estimated time taken" for a mid-level developer
     Example: "2026-02-02: PR created - estimated time taken: 2.5 hours for mid-level dev"

WORKFLOW
--------
Typical ticket lifecycle:
1. Create ticket in "backlog" status
2. When ready for development, change to "marked for dev"
3. When developer starts work, change to "in dev"
4. When development complete, change to "dev done"
5. When UAT passes, change to "uat done"

STATUS DEFINITIONS
------------------
- backlog        : Ticket identified but not yet prioritized for immediate work
- marked for dev : Ticket ready to be picked up by a developer
- in dev         : Active development in progress
- dev done       : Development complete, ready for testing
- uat done       : User acceptance testing complete, ticket finished
