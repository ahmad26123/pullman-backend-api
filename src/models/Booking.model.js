import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seatNumber: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['reserved', 'confirmed', 'cancelled'], 
    default: 'reserved',
    required: true 
  },
  bookingDate: { type: Date, default: Date.now }
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
