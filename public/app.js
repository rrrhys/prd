/**
 * Work Manager - Kanban Board Application
 * Main JavaScript file for fetching and displaying tickets
 */

// API base URL
const API_BASE = '/api/tickets';

// DOM elements
let modal;
let modalTitle;
let ticketForm;
let ticketIdInput;

// Column elements
const columns = {};

/**
 * Initialize the application on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  setupEventListeners();
  fetchAndDisplayTickets();
});

/**
 * Cache DOM element references
 */
function initializeElements() {
  modal = document.getElementById('ticket-modal');
  modalTitle = document.getElementById('modal-title');
  ticketForm = document.getElementById('ticket-form');
  ticketIdInput = document.getElementById('ticket-id');

  // Cache column elements
  columns.backlog = document.getElementById('backlog-column');
  columns['marked for dev'] = document.getElementById('marked-for-dev-column');
  columns['in dev'] = document.getElementById('in-dev-column');
  columns['dev done'] = document.getElementById('dev-done-column');
  columns['uat done'] = document.getElementById('uat-done-column');
}

/**
 * Set up event listeners for buttons and modal
 */
function setupEventListeners() {
  // Add Ticket button
  const addTicketBtn = document.getElementById('add-ticket-btn');
  if (addTicketBtn) {
    addTicketBtn.addEventListener('click', openAddTicketModal);
  }

  // Close modal button
  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Modal overlay click to close
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Cancel button
  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  // Form submit
  if (ticketForm) {
    ticketForm.addEventListener('submit', handleFormSubmit);
  }
}

/**
 * Fetch all tickets from the API and display them
 */
async function fetchAndDisplayTickets() {
  try {
    const response = await fetch(API_BASE);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tickets = await response.json();
    displayTickets(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    showError('Failed to load tickets. Please refresh the page.');
  }
}

/**
 * Group tickets by status and render them in columns
 * @param {Array} tickets - Array of ticket objects
 */
function displayTickets(tickets) {
  // Clear all columns
  Object.values(columns).forEach(column => {
    if (column) {
      column.innerHTML = '';
    }
  });

  // Group tickets by status
  const ticketsByStatus = {
    'backlog': [],
    'marked for dev': [],
    'in dev': [],
    'dev done': [],
    'uat done': []
  };

  tickets.forEach(ticket => {
    if (ticketsByStatus[ticket.status]) {
      ticketsByStatus[ticket.status].push(ticket);
    }
  });

  // Render tickets in each column
  Object.entries(ticketsByStatus).forEach(([status, statusTickets]) => {
    const column = columns[status];
    if (!column) return;

    if (statusTickets.length === 0) {
      column.innerHTML = '<div class="empty-state">No tickets</div>';
    } else {
      statusTickets.forEach(ticket => {
        const ticketCard = createTicketCard(ticket);
        column.appendChild(ticketCard);
      });
    }
  });

  // Update ticket counts in column headers
  updateColumnCounts(ticketsByStatus);
}

/**
 * Create a ticket card element
 * @param {Object} ticket - Ticket object
 * @returns {HTMLElement} Ticket card element
 */
function createTicketCard(ticket) {
  const card = document.createElement('div');
  card.className = 'ticket-card';
  card.dataset.ticketId = ticket.id;
  card.draggable = true;

  // Priority class for styling
  const priorityClass = `priority-${ticket.priority}`;

  card.innerHTML = `
    <div class="ticket-header">
      <span class="ticket-id">#${ticket.id}</span>
    </div>
    <h3 class="ticket-title">${escapeHtml(ticket.title)}</h3>
    <div class="ticket-meta">
      <span class="badge badge-priority ${priorityClass}">${ticket.priority}</span>
      <span class="badge badge-effort">📊 ${ticket.effort}</span>
      <span class="ticket-assignee">👤 ${escapeHtml(ticket.assignee)}</span>
    </div>
  `;

  // Click to edit
  card.addEventListener('click', () => openEditTicketModal(ticket));

  return card;
}

/**
 * Update ticket count badges in column headers
 * @param {Object} ticketsByStatus - Tickets grouped by status
 */
function updateColumnCounts(ticketsByStatus) {
  const countElements = {
    'backlog': document.getElementById('count-backlog'),
    'marked for dev': document.getElementById('count-marked-for-dev'),
    'in dev': document.getElementById('count-in-dev'),
    'dev done': document.getElementById('count-dev-done'),
    'uat done': document.getElementById('count-uat-done')
  };

  Object.entries(countElements).forEach(([status, element]) => {
    if (element) {
      const count = ticketsByStatus[status]?.length || 0;
      element.textContent = count;
    }
  });
}

/**
 * Open modal for adding a new ticket
 */
function openAddTicketModal() {
  if (!modal || !modalTitle || !ticketForm) return;

  modalTitle.textContent = 'Add New Ticket';
  ticketForm.reset();
  ticketIdInput.value = '';

  // Set default status to backlog
  const statusSelect = document.getElementById('ticket-status');
  if (statusSelect) {
    statusSelect.value = 'backlog';
  }

  modal.classList.add('active');
}

/**
 * Open modal for editing an existing ticket
 * @param {Object} ticket - Ticket object to edit
 */
function openEditTicketModal(ticket) {
  if (!modal || !modalTitle || !ticketForm) return;

  modalTitle.textContent = 'Edit Ticket';

  // Fill form with ticket data
  ticketIdInput.value = ticket.id;
  document.getElementById('ticket-title').value = ticket.title;
  document.getElementById('ticket-description').value = ticket.description;
  document.getElementById('ticket-effort').value = ticket.effort;
  document.getElementById('ticket-priority').value = ticket.priority;
  document.getElementById('ticket-assignee').value = ticket.assignee;
  document.getElementById('ticket-status').value = ticket.status;
  document.getElementById('ticket-comments').value = '';

  modal.classList.add('active');
}

/**
 * Close the modal
 */
function closeModal() {
  if (modal) {
    modal.classList.remove('active');
  }
  if (ticketForm) {
    ticketForm.reset();
  }
}

/**
 * Handle form submission (create or update ticket)
 * @param {Event} e - Submit event
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  const ticketId = ticketIdInput.value;
  const isEdit = ticketId !== '';

  const ticketData = {
    title: document.getElementById('ticket-title').value,
    description: document.getElementById('ticket-description').value,
    effort: parseInt(document.getElementById('ticket-effort').value),
    priority: document.getElementById('ticket-priority').value,
    assignee: document.getElementById('ticket-assignee').value,
    status: document.getElementById('ticket-status').value
  };

  try {
    let response;

    if (isEdit) {
      // Update existing ticket
      response = await fetch(`${API_BASE}/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketData)
      });
    } else {
      // Create new ticket
      response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketData)
      });
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save ticket');
    }

    // Success - close modal and refresh tickets
    closeModal();
    await fetchAndDisplayTickets();

  } catch (error) {
    console.error('Error saving ticket:', error);
    showError(error.message || 'Failed to save ticket. Please try again.');
  }
}

/**
 * Show error message to user
 * @param {string} message - Error message
 */
function showError(message) {
  // Simple alert for now - could be enhanced with a toast notification
  alert(message);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
