import Contact from '../models/Contact.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact (public)
export const createMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    res.status(400);
    throw new Error('Name, email and message are all required.');
  }
  if (!EMAIL_RX.test(email.trim())) {
    res.status(400);
    throw new Error('Please provide a valid email address.');
  }

  const contact = await Contact.create({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  });
  res.status(201).json({ message: 'Message received. Thank you!', id: contact._id });
});

// GET /api/contact (admin)
export const getMessages = asyncHandler(async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
});

// PUT /api/contact/:id/read (admin)
export const markRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!contact) {
    res.status(404);
    throw new Error('Message not found');
  }
  res.json(contact);
});

// DELETE /api/contact/:id (admin)
export const deleteMessage = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('Message not found');
  }
  res.json({ message: 'Message deleted' });
});
