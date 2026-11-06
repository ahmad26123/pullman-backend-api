import mongoose from 'mongoose';

const busModelSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  capacity: { type: Number, required: true },
  layoutDetails: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

export const BusModel = mongoose.model('BusModel', busModelSchema);
