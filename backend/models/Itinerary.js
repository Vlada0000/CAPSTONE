import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    activities: [{ type: String }],
    notes: { type: String },
  },
  {
    timestamps: true,
    collection: 'itinerari',
  }
);

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;
