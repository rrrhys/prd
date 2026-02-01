# Work Manager

**Version 1.0.0**

A kanban board application for visualizing and managing work items from a JSON-based PRD (Product Requirements Document) system.

## Features

- 📋 Visual kanban board with 5 workflow columns (backlog, marked for dev, in dev, dev done, uat done)
- 🎯 Drag-and-drop functionality to move tickets between statuses
- 🔄 RESTful API for ticket management
- ✏️ Modal-based ticket creation and editing
- 🎨 Priority color coding (red=high, orange=med, green=low)
- 📊 Story point tracking
- 💬 Comment history for each ticket
- ⚙️ Configurable project name and port

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone or copy this repository:
```bash
git clone <repository-url>
cd work-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Configuration

The application can be configured via `.prd/config.json`:

```json
{
  "projectName": "Work Manager",
  "port": 3000
}
```

- **projectName**: Displayed in browser tab and header
- **port**: Server port (useful for running multiple instances)

## Usage

### Adding Tickets

1. Click the **"Add Ticket"** button
2. Fill in the required fields (title, description, effort, priority, assignee)
3. Click **Save**

### Editing Tickets

1. Click on any ticket card
2. Modify fields as needed
3. Add comments to track progress
4. Click **Save**

### Moving Tickets

- **Drag and drop**: Drag ticket cards between columns
- **Manual edit**: Click ticket and change status dropdown

## Project Structure

```
work-manager/
├── .prd/
│   ├── prd.json              # Ticket data (main PRD file)
│   ├── prd.json.example      # Example ticket structure
│   ├── config.json           # Configuration (project name, port)
│   ├── readme.txt            # PRD system documentation
│   └── setup_instructions.md # Detailed setup guide
├── public/
│   ├── index.html            # Kanban board UI
│   ├── styles.css            # Styling
│   └── app.js               # Frontend logic
├── server.js                # Express backend API
├── package.json             # Dependencies
└── README.md                # This file
```

## API Endpoints

- `GET /api/config` - Retrieve configuration
- `GET /api/tickets` - Retrieve all tickets
- `POST /api/tickets` - Create a new ticket
- `PATCH /api/tickets/:id` - Update an existing ticket

See [setup_instructions.md](.prd/setup_instructions.md) for detailed API documentation.

## PRD System

Work Manager uses a JSON-based PRD (Product Requirements Document) system. Each ticket contains:

- **id**: Unique identifier (auto-generated)
- **title**: Brief description
- **description**: Detailed explanation
- **status**: Current workflow stage
- **effort**: Story points (1, 2, 3, 5, 8, 13, 21, etc.)
- **priority**: low, med, or high
- **assignee**: Name or username
- **createdDate**: Creation date (YYYY-MM-DD)
- **comments**: Array of progress notes

## Workflow Statuses

1. **backlog** - Ticket identified but not yet prioritized
2. **marked for dev** - Ready to be picked up by a developer
3. **in dev** - Active development in progress
4. **dev done** - Development complete, ready for testing
5. **uat done** - User acceptance testing complete

## Documentation

- [Setup Instructions](.prd/setup_instructions.md) - Comprehensive setup guide for using Work Manager in your own projects
- [PRD System Documentation](.prd/readme.txt) - Details on the JSON-based PRD format
- [Example PRD](.prd/prd.json.example) - Sample ticket structure

## Customization

### Changing Colors

Edit `public/styles.css` and update CSS custom properties:

```css
:root {
  --color-primary: #3b82f6;  /* Blue */
  --priority-high: #ef4444;   /* Red */
  --priority-med: #f59e0b;    /* Orange */
  --priority-low: #10b981;    /* Green */
}
```

### Adding Custom Statuses

1. Update `.prd/readme.txt` to document new statuses
2. Update `server.js` validation for POST and PATCH endpoints
3. Add new columns in `public/index.html`
4. Update CSS for new columns in `public/styles.css`

## Running Multiple Instances

To run Work Manager for multiple projects simultaneously:

1. Copy the directory to separate locations
2. Edit `.prd/config.json` in each instance with unique ports
3. Start each server independently

Example:
- Project A: port 3000
- Project B: port 3001
- Project C: port 3002

## Technologies Used

- **Backend**: Node.js + Express.js
- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with Grid and Flexbox
- **Data Storage**: JSON file-based
- **Drag and Drop**: HTML5 Drag and Drop API

## Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `body-parser` - Request body parsing

## License

ISC

## Version History

### 1.0.0 (2026-02-01)
- Initial release
- Complete kanban board with drag-and-drop
- RESTful API for ticket management
- Priority color coding and story points
- Comment history tracking
- Configurable project name and port

## Contributing

This tool is designed to be copied and customized for individual projects. Feel free to modify it to suit your needs.

## Support

For issues or questions:
- Review [setup_instructions.md](.prd/setup_instructions.md)
- Check [readme.txt](.prd/readme.txt) for PRD system documentation
- Inspect code comments in `server.js`, `app.js`, and `index.html`

---

**Built with ❤️ for efficient project management**
