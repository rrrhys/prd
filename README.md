# Work Manager - Kanban Board for PRD Management

**Version 1.0.0** | Self-Contained Application

This folder contains a complete, self-contained kanban board application for managing Product Requirements Documents (PRD) in JSON format. Everything needed to run the application is in this folder - simply copy it to any project and run!

## Quick Start

```bash
# 1. Navigate to this folder
cd .prd

# 2. Install dependencies (first time only)
npm install

# 3. Start the server
npm start

# 4. Open your browser
# Navigate to http://localhost:3000
```

## What's Included

This folder is completely self-contained with:

- ✅ Backend server (`server.js`) - Express API with RESTful endpoints
- ✅ Frontend UI (`public/`) - Kanban board interface with drag-and-drop
- ✅ Configuration (`config.json`) - Customize project name and port
- ✅ Dependencies (`package.json`) - All npm packages defined
- ✅ Documentation (`readme.txt`, `setup_instructions.md`) - Complete guides
- ✅ Example files (`prd.json.example`) - Reference structure

## Features

- 📋 **5 Workflow Columns**: backlog → marked for dev → in dev → dev done → uat done
- 🖱️ **Drag & Drop**: Move tickets between statuses visually
- ✏️ **Full CRUD**: Create, read, update tickets via UI or API
- 🎨 **Priority Colors**: Red (high), orange (med), green (low)
- 📊 **Story Points**: Track effort estimates
- 💬 **Comments**: Add progress notes to any ticket
- ⚙️ **Configurable**: Change project name and port in `config.json`

## Files Overview

```
.prd/
├── server.js              # Backend Express server
├── package.json           # Dependencies and scripts
├── package-lock.json      # Dependency versions
├── config.json            # Configuration (port, project name)
├── prd.json               # Your tickets data (JSON array)
├── prd.json.example       # Example ticket structure
├── readme.txt             # PRD system documentation
├── setup_instructions.md  # Detailed setup guide
├── .gitignore             # Git ignore rules
├── README.md              # This file
└── public/                # Frontend files
    ├── index.html         # Kanban board UI
    ├── styles.css         # Styling
    └── app.js             # Frontend JavaScript
```

## Running on Different Port

Edit `config.json`:

```json
{
  "projectName": "My Project",
  "port": 4000
}
```

## Running Multiple Instances

You can run multiple instances for different projects by:

1. Copy the `.prd` folder to each project
2. Configure different ports in each `config.json`
3. Each instance will run independently

Example:
- Project A: `.prd/config.json` → port 3000
- Project B: `.prd/config.json` → port 3001
- Project C: `.prd/config.json` → port 3002

## API Endpoints

All endpoints are available at `http://localhost:{port}/api`

- **GET /api/tickets** - Get all tickets
- **POST /api/tickets** - Create a new ticket
- **PATCH /api/tickets/:id** - Update a ticket
- **GET /api/config** - Get project configuration

See `setup_instructions.md` for detailed API documentation.

## Technologies

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript (no frameworks!)
- **Storage**: JSON file (`prd.json`)
- **Dependencies**: express, cors, body-parser

## Documentation

For complete documentation, see:
- `setup_instructions.md` - Full installation and usage guide
- `readme.txt` - PRD system field specifications

## Version History

**v1.0.0** (2026-02-01)
- Initial release
- Complete kanban board with drag-and-drop
- RESTful API for ticket management
- Configurable project name and port
- Self-contained folder structure
