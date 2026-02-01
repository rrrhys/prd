const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from public/ directory
app.use(express.static('public'));

// API Routes

// GET /api/tickets - Read all tickets from prd.json
app.get('/api/tickets', (req, res) => {
  const prdPath = path.join(__dirname, '.prd', 'prd.json');

  fs.readFile(prdPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading prd.json:', err);
      return res.status(500).json({
        error: 'Failed to read tickets data',
        message: err.message
      });
    }

    try {
      const tickets = JSON.parse(data);
      res.json(tickets);
    } catch (parseErr) {
      console.error('Error parsing prd.json:', parseErr);
      res.status(500).json({
        error: 'Failed to parse tickets data',
        message: parseErr.message
      });
    }
  });
});

// POST /api/tickets - Create a new ticket
app.post('/api/tickets', (req, res) => {
  const prdPath = path.join(__dirname, '.prd', 'prd.json');

  // Validate required fields
  const { title, description, effort, priority, assignee } = req.body;

  if (!title || !description || effort === undefined || !priority || !assignee) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Required fields: title, description, effort, priority, assignee'
    });
  }

  // Validate status values (if provided)
  const validStatuses = ['backlog', 'marked for dev', 'in dev', 'dev done', 'uat done'];
  const status = req.body.status || 'backlog';
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status value',
      message: 'Status must be one of: backlog, marked for dev, in dev, dev done, uat done'
    });
  }

  // Validate priority values
  const validPriorities = ['low', 'med', 'high'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      error: 'Invalid priority value',
      message: 'Priority must be one of: low, med, high'
    });
  }

  // Validate effort is a number
  if (typeof effort !== 'number' || effort < 0) {
    return res.status(400).json({
      error: 'Invalid effort value',
      message: 'Effort must be a positive number'
    });
  }

  // Read existing tickets
  fs.readFile(prdPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading prd.json:', err);
      return res.status(500).json({
        error: 'Failed to read tickets data',
        message: err.message
      });
    }

    try {
      const tickets = JSON.parse(data);

      // Find highest existing ID and increment
      const maxId = tickets.reduce((max, ticket) => Math.max(max, ticket.id), 0);
      const newId = maxId + 1;

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // Create new ticket
      const newTicket = {
        id: newId,
        title,
        description,
        status, // Already validated above
        effort,
        priority,
        assignee,
        createdDate: today,
        comments: []
      };

      // Add new ticket to array
      tickets.push(newTicket);

      // Write updated data back to file
      fs.writeFile(prdPath, JSON.stringify(tickets, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing prd.json:', writeErr);
          return res.status(500).json({
            error: 'Failed to save new ticket',
            message: writeErr.message
          });
        }

        // Return the newly created ticket
        res.status(201).json(newTicket);
      });

    } catch (parseErr) {
      console.error('Error parsing prd.json:', parseErr);
      res.status(500).json({
        error: 'Failed to parse tickets data',
        message: parseErr.message
      });
    }
  });
});

// PATCH /api/tickets/:id - Update an existing ticket
app.patch('/api/tickets/:id', (req, res) => {
  const prdPath = path.join(__dirname, '.prd', 'prd.json');
  const ticketId = parseInt(req.params.id, 10);

  // Validate ticket ID is a valid number
  if (isNaN(ticketId)) {
    return res.status(400).json({
      error: 'Invalid ticket ID',
      message: 'Ticket ID must be a valid number'
    });
  }

  // Validate status value if provided
  if (req.body.status !== undefined) {
    const validStatuses = ['backlog', 'marked for dev', 'in dev', 'dev done', 'uat done'];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({
        error: 'Invalid status value',
        message: 'Status must be one of: backlog, marked for dev, in dev, dev done, uat done'
      });
    }
  }

  // Validate priority value if provided
  if (req.body.priority !== undefined) {
    const validPriorities = ['low', 'med', 'high'];
    if (!validPriorities.includes(req.body.priority)) {
      return res.status(400).json({
        error: 'Invalid priority value',
        message: 'Priority must be one of: low, med, high'
      });
    }
  }

  // Validate effort if provided
  if (req.body.effort !== undefined) {
    if (typeof req.body.effort !== 'number' || req.body.effort < 0) {
      return res.status(400).json({
        error: 'Invalid effort value',
        message: 'Effort must be a positive number'
      });
    }
  }

  // Read existing tickets
  fs.readFile(prdPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading prd.json:', err);
      return res.status(500).json({
        error: 'Failed to read tickets data',
        message: err.message
      });
    }

    try {
      const tickets = JSON.parse(data);

      // Find the ticket by ID
      const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);

      if (ticketIndex === -1) {
        return res.status(404).json({
          error: 'Ticket not found',
          message: `No ticket found with ID ${ticketId}`
        });
      }

      // Get the existing ticket
      const existingTicket = tickets[ticketIndex];

      // Handle new comment separately (append to comments array)
      let updatedComments = existingTicket.comments || [];
      if (req.body.newComment) {
        updatedComments = [...updatedComments, req.body.newComment];
      }

      // Update ticket with partial data (only fields provided in request)
      // Exclude newComment from spread (it's not a ticket field)
      const { newComment, ...updateData } = req.body;

      const updatedTicket = {
        ...existingTicket,
        ...updateData,
        id: existingTicket.id, // Preserve ID (cannot be changed)
        createdDate: existingTicket.createdDate, // Preserve createdDate (cannot be changed)
        comments: updatedComments // Use updated comments array
      };

      // Replace the ticket in the array
      tickets[ticketIndex] = updatedTicket;

      // Write updated data back to file
      fs.writeFile(prdPath, JSON.stringify(tickets, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing prd.json:', writeErr);
          return res.status(500).json({
            error: 'Failed to update ticket',
            message: writeErr.message
          });
        }

        // Return the updated ticket
        res.json(updatedTicket);
      });

    } catch (parseErr) {
      console.error('Error parsing prd.json:', parseErr);
      res.status(500).json({
        error: 'Failed to parse tickets data',
        message: parseErr.message
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
