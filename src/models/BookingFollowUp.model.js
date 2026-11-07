import mongoose from 'mongoose';

const bookingFollowUpSchema = new mongoose.Schema({
  scheduleChangeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TripScheduleChange', required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  previousStatus: { type: String, default: 'confirmed' },
  followUpStatus: { type: String, enum: ['pending', 'contacted', 'completed'], default: 'pending' },
  customerDecision: { type: String, enum: ['accepted', 'declined', 'no_response'], default: 'no_response' },
  contactedAt: { type: Date, default: null },
  decisionAt: { type: Date, default: null }
}, { timestamps: true });

export const BookingFollowUp = mongoose.model('BookingFollowUp', bookingFollowUpSchema, 'BookingFollowUps');
