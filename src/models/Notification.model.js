import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, required: true }, // SCHEDULE_CHANGE, BOOKING_UPDATE
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedTripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null },
  relatedBookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema, 'Notifications');
