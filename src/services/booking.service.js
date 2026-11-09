// booking.service.js placeholder
import { BusModel } from "../models/BusModel.model";
import { Booking } from "../models/Booking.model";
import { Trip } from "../models/Trip.model";
export const createBooking = async (customerId, tripId, seatNumbers) => {
  // 1. Validate seats input
  if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
    throw new Error("At least one seat is required");
  }

  // 2. Find the trip
  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw new Error("Trip not found");
  }

  // 3. Check trip status
  if (!["scheduled", "active"].includes(trip.status)) {
    throw new Error("This trip is not available for booking");
  }

  
  // 4. Find bus model to get capacity
  const busModel = await BusModel.findById(trip.busModelId);

  if (!busModel) {
    throw new Error("Bus model not found");
  }

  // 5. Validate seat numbers
  const uniqueSeats = new Set(seatNumbers);

  if (
    seatNumbers.some(
      (seat) => !Number.isInteger(seat) || seat < 1 || seat > busModel.capacity,
    ) ||
    uniqueSeats.size !== seatNumbers.length
  ) {
    throw new Error("Invalid seat numbers");
  }

  // 6. Find existing active bookings for this trip
  const existingBookings = await Booking.find({
    tripId,
    status: { $in: ["reserved", "confirmed"] },
  });

  // 7. Collect all already booked seats
  const bookedSeats = existingBookings.flatMap(
    (booking) => booking.seatNumbers,
  );

  // 8. Check if requested seats are already booked
  const isSeatBooked = seatNumbers.some((seat) => bookedSeats.includes(seat));

  if (isSeatBooked) {
    throw new Error("One or more seats are already booked");
  }

  // 9. Check available capacity
  const availableSeats = busModel.capacity - trip.reservedSeats;

  if (seatNumbers.length > availableSeats) {
    throw new Error("Not enough available seats");
  }

  // 10. Create booking
  const booking = await Booking.create({
    tripId,
    customerId,
    seatNumbers,
  });

  // 11. Update reserved seats count
  trip.reservedSeats += seatNumbers.length;
  await trip.save();

  return booking;
};

export const getAllBookings = async () => {
  const bookings = await Booking.find()
    .populate("customerId", "name phone username")
    .populate("tripId");

  return bookings;
};
export const getBookingById = async (bookingId) => {
  const booking = await Booking.findById(bookingId)
    .populate("customerId", "name phone username")
    .populate("tripId");

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};
export const getCustomerBookings = async (customerId) => {
  const bookings = await Booking.find({ customerId }).populate("tripId");

  return bookings;
};
export const updateBooking = async (bookingId, customerId, newSeatNumbers) => {
  // 1. Find booking
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  // 2. Check booking owner
  if (booking.customerId.toString() !== customerId.toString()) {
    throw new Error("You cannot update this booking");
  }

  // 3. Check booking status
  if (booking.status !== "reserved") {
    throw new Error("Only reserved bookings can be updated");
  }

  // 4. Validate input
  if (!Array.isArray(newSeatNumbers) || newSeatNumbers.length === 0) {
    throw new Error("At least one seat is required");
  }

  // 5. Find trip and bus model
  const trip = await Trip.findById(booking.tripId);

  if (!trip) {
    throw new Error("Trip not found");
  }

  const busModel = await BusModel.findById(trip.busModelId);

  if (!busModel) {
    throw new Error("Bus model not found");
  }

  // 6. Validate seat numbers
  if (
    newSeatNumbers.some(
      (seat) => !Number.isInteger(seat) || seat < 1 || seat > busModel.capacity,
    ) ||
    new Set(newSeatNumbers).size !== newSeatNumbers.length
  ) {
    throw new Error("Invalid seat numbers");
  }

  // 7. Find other active bookings for this trip
  const otherBookings = await Booking.find({
    tripId: booking.tripId,
    _id: { $ne: bookingId },
    status: { $in: ["reserved", "confirmed"] },
  });

  // 8. Collect seats from other bookings
  const otherBookedSeats = otherBookings.flatMap((item) => item.seatNumbers);

  // 9. Check seat conflicts
  const hasConflict = newSeatNumbers.some((seat) =>
    otherBookedSeats.includes(seat),
  );

  if (hasConflict) {
    throw new Error("One or more seats are already booked");
  }

  // 10. Calculate seat count difference
  const oldSeatCount = booking.seatNumbers.length;
  const newSeatCount = newSeatNumbers.length;

  const difference = newSeatCount - oldSeatCount;

  // 11. Check capacity if adding seats
  if (difference > 0) {
    const availableSeats = busModel.capacity - trip.reservedSeats;

    if (difference > availableSeats) {
      throw new Error("Not enough available seats");
    }
  }

  // 12. Update booking
  booking.seatNumbers = newSeatNumbers;
  await booking.save();

  // 13. Update trip reserved seats
  trip.reservedSeats += difference;
  await trip.save();

  return booking;
};
export const cancelBooking = async (bookingId, customerId) => {
  // 1. Find booking
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found");
  }

  // 2. Check booking owner
  if (booking.customerId.toString() !== customerId.toString()) {
    throw new Error("You cannot cancel this booking");
  }

  // 3. Check booking status
  if (booking.status !== "reserved") {
    throw new Error("Only reserved bookings can be cancelled");
  }

  // 4. Find trip
  const trip = await Trip.findById(booking.tripId);

  if (!trip) {
    throw new Error("Trip not found");
  }

  // 5. Calculate reserved seats
  const numberOfSeats = booking.seatNumbers.length;

  // 6. Update booking status
  booking.status = "cancelled";
  await booking.save();

  // 7. Decrease trip reserved seats
  trip.reservedSeats -= numberOfSeats;
  await trip.save();

  return booking;
};
