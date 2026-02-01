# Work Manager - Setup Instructions

This document explains how to set up the Work Manager PRD tool in your own projects.

## What is Work Manager?

Work Manager is a kanban board application that visualizes and manages work items from a JSON-based PRD (Product Requirements Document) system. It provides:

- A visual kanban board with 5 workflow columns (backlog, marked for dev, in dev, dev done, uat done)
- Drag-and-drop functionality to move tickets between statuses
- RESTful API for ticket management
- Modal-based ticket creation and editing
- Priority color coding and story point tracking
- Comment history for each ticket

## Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- A code editor (VS Code, Sublime, etc.)
- Git (optional, for version control)

## Installation Steps

### 1. Copy the .prd Folder

Copy the entire `.prd/` folder to your new project. Everything you need is self-contained in this folder:

```
your-project/
└── .prd/
    ├── prd.json              # Your project's tickets (start with empty array: [])
    ├── prd.json.example      # Example ticket structure
    ├── config.json           # Configuration (project name, port)
    ├── readme.txt            # PRD system documentation
    ├── setup_instructions.md # This file
    ├── package.json          # Dependencies
    ├── package-lock.json     # Dependency lock file
    ├── server.js             # Express backend API
    ├── .gitignore            # Git ignore rules
    ├── public/               # Frontend files
    │   ├── index.html        # Kanban board UI
    │   ├── styles.css        # Styling
    │   └── app.js            # Frontend logic
    └── node_modules/         # (generated after npm install)
```

### 2. Install Dependencies

Navigate to the `.prd/` directory and install dependencies:

```bash
cd your-project/.prd
npm install
```

This will install:
- `express` - Web framework
- `cors` - CORS middleware
- `body-parser` - Request body parsing

### 3. Initialize Your PRD

Create your initial `prd.json` file in the `.prd/` directory. Start with an empty array or copy from the example:

**Option A: Start empty**
```json
[]
```

**Option B: Use example structure**
```json
[
  {
    "id": 1,
    "title": "Example ticket",
    "description": "This is an example ticket to demonstrate the structure.",
    "status": "backlog",
    "effort": 3,
    "priority": "med",
    "assignee": "your-name",
    "createdDate": "2026-02-01",
    "comments": []
  }
]
```

### 4. Start the Server

From the `.prd/` directory, run the server:

```bash
npm start
```

Or for development with auto-reload (if you have nodemon):

```bash
npm run dev
```

The server will start on **http://localhost:3000** (or the port specified in `config.json`)

### 5. Access the Kanban Board

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the kanban board with 5 columns.

## Using Work Manager

### Adding Tickets

1. Click the **"Add Ticket"** button in the top-right corner
2. Fill in the required fields:
   - **Title**: Brief description of the task
   - **Description**: Detailed explanation with acceptance criteria
   - **Effort**: Story points (1, 2, 3, 5, 8, 13, 21, etc.)
   - **Priority**: low, med, or high
   - **Assignee**: Name or username
   - **Status**: Defaults to 'backlog'
3. Click **Save**

### Editing Tickets

1. Click on any ticket card
2. Modify the fields as needed
3. Add comments in the "Add New Comment" field to track progress
4. Click **Save**

### Moving Tickets

**Drag and Drop**: Simply drag a ticket card to a different column to update its status.

**Manual Edit**: Click the ticket and change the status dropdown.

### Workflow Statuses

- **backlog**: Ticket identified but not yet prioritized
- **marked for dev**: Ready to be picked up by a developer
- **in dev**: Active development in progress
- **dev done**: Development complete, ready for testing
- **uat done**: User acceptance testing complete

## Configuration File

Work Manager uses `.prd/config.json` to configure the project. This file controls:
- **projectName**: The name displayed in the browser tab and header
- **port**: The port the server runs on

**Default config.json:**
```json
{
  "projectName": "Work Manager",
  "port": 3000
}
```

### Changing Project Name

To customize the project name:

1. Open `.prd/config.json`
2. Change the `projectName` value:
```json
{
  "projectName": "My Awesome Project",
  "port": 3000
}
```
3. Restart the server

The new name will appear in the browser tab and header.

### Changing Port

To change the port:

1. Open `.prd/config.json`
2. Change the `port` value:
```json
{
  "projectName": "Work Manager",
  "port": 4000
}
```
3. Restart the server
4. Access the app at `http://localhost:4000`

## Running Multiple Instances

If you need to run Work Manager for multiple projects simultaneously:

1. Copy the entire directory to separate locations
2. Edit `.prd/config.json` in each instance with a unique port and project name
3. Start each server independently

Example:
- **Project A** (`config.json`): `{ "projectName": "Frontend App", "port": 3000 }`
- **Project B** (`config.json`): `{ "projectName": "Backend API", "port": 3001 }`
- **Project C** (`config.json`): `{ "projectName": "Mobile App", "port": 3002 }`

## API Endpoints

Work Manager provides a REST API for ticket management:

### GET /api/config
Retrieve the configuration (project name).

**Response**: Configuration object
```json
{
  "projectName": "Work Manager"
}
```

### GET /api/tickets
Retrieve all tickets.

**Response**: JSON array of ticket objects

### POST /api/tickets
Create a new ticket.

**Request Body**:
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "effort": "number (required)",
  "priority": "low|med|high (required)",
  "assignee": "string (required)",
  "status": "string (optional, defaults to 'backlog')"
}
```

**Response**: Created ticket object with auto-generated ID and createdDate

### PATCH /api/tickets/:id
Update an existing ticket (supports partial updates).

**Request Body**: Any fields to update (all optional)
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "effort": "number (optional)",
  "priority": "low|med|high (optional)",
  "assignee": "string (optional)",
  "status": "string (optional)",
  "newComment": "string (optional)"
}
```

**Response**: Updated ticket object

**Note**: `id` and `createdDate` are immutable and cannot be changed.

## Customization

### Changing Project Name

The project name is configured in `.prd/config.json`. See the **Configuration File** section above for details.

### Modifying Colors

Edit `public/styles.css` and update the CSS custom properties:

```css
:root {
  --color-primary: #3b82f6;  /* Blue - change to your brand color */
  --priority-high: #ef4444;   /* Red */
  --priority-med: #f59e0b;    /* Orange */
  --priority-low: #10b981;    /* Green */
}
```

### Adding Custom Statuses

To add custom workflow statuses:

1. Update `.prd/readme.txt` to document new statuses
2. Update `server.js` validation arrays for POST and PATCH endpoints
3. Add new columns in `public/index.html`
4. Update CSS for new columns in `public/styles.css`

## Backup and Version Control

### Git Integration

Initialize git in your project directory:

```bash
git init
git add .
git commit -m "Initial Work Manager setup"
```

The `.gitignore` file is already configured to exclude `node_modules/`.

### Backing Up PRD Data

Your tickets are stored in `.prd/prd.json`. To backup:

```bash
# Manual backup
cp .prd/prd.json .prd/prd.json.backup

# Or commit to git
git add .prd/prd.json
git commit -m "Update PRD with latest tickets"
```

## Troubleshooting

### Server won't start

**Error**: `Error: listen EADDRINUSE :::3000`
- **Solution**: Port 3000 is already in use. Change the port in `server.js` or kill the process using port 3000.

### Tickets not loading

1. Check that `.prd/prd.json` exists and contains valid JSON
2. Open browser console (F12) and check for errors
3. Verify the server is running on port 3000
4. Check server console for error messages

### Drag and drop not working

1. Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
2. Check browser console for JavaScript errors
3. Verify `app.js` is loaded correctly (check Network tab in browser dev tools)

### Changes not saving

1. Check server console for API errors
2. Verify `.prd/prd.json` file has write permissions
3. Check browser console for JavaScript errors during save

## Production Deployment

For production use, consider:

1. **Environment Variables**: Use `.env` file for configuration
2. **Process Manager**: Use PM2 or similar to keep the server running
3. **Reverse Proxy**: Use Nginx to proxy requests
4. **HTTPS**: Set up SSL certificates for secure connections
5. **Database**: Consider migrating from JSON file to PostgreSQL/MongoDB for better concurrency

Example PM2 setup:

```bash
npm install -g pm2
pm2 start server.js --name "work-manager"
pm2 save
pm2 startup
```

## Support

For issues or questions:
- Review the `.prd/readme.txt` file for PRD system documentation
- Check the code comments in `server.js`, `app.js`, and `index.html`
- Ensure all dependencies are installed with `npm install`

## License

This Work Manager tool is provided as-is for use in your projects.

---

**Version**: 1.0.0
**Last Updated**: 2026-02-01
