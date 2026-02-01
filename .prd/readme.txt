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
  - Examples: "Started implementation", "Blocked on API access", "PR submitted"

EXAMPLE TICKET
--------------
{
  "id": 1,
  "title": "Implement user login feature",
  "description": "Create login page with username/password authentication. Include form validation and error handling.",
  "status": "backlog",
  "effort": 5,
  "priority": "high",
  "assignee": "john.doe",
  "createdDate": "2026-01-15",
  "comments": []
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
