import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  busModelId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusModel', required: true },
  source: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  departureTime: { type: Date, required: true },
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'active', 'completed', 'cancelled'], 
    default: 'scheduled' 
  }
}, { timestamps: true });

export const Trip = mongoose.model('Trip', tripSchema);
