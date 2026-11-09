// import mongoose from 'mongoose';

// const tripSchema = new mongoose.Schema({
//   busModelId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusModel', required: true },
//   source: { type: String, required: true, trim: true },
//   destination: { type: String, required: true, trim: true },
//   departureTime: { type: Date, required: true },
//   price: { type: Number, required: true },
//   status: { 
//     type: String, 
//     enum: ['scheduled', 'active', 'completed', 'cancelled'], 
//     default: 'scheduled' 
//   }
// }, { timestamps: true });

// export const Trip = mongoose.model('Trip', tripSchema);
// +++++++++++++++++++++++++++++
import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: [true, 'Source is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    busModelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusModel',
      required: [true, 'BusModel reference is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    tripDate: {
      type: String,
      required: [true, 'Trip date is required'],
      trim: true, // صيغة YYYY-MM-DD
    },
    tripTime: {
      type: String,
      required: [true, 'Trip time is required'],
      trim: true, // صيغة HH:mm
    },
    scheduleType: {
      type: String,
      enum: {
        values: ['manual', 'daily', 'weekly', 'monthly'],
        message: '{VALUE} is not a valid schedule type',
      },
      default: 'manual',
    },
    status: {
      type: String,
      enum: {
        values: ['scheduled', 'active', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'scheduled',
    },
  },
  {
    timestamps: true, 
  }
);

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;