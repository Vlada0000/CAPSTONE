import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    category: { type: String },
  },
  {
    timestamps: true,
    collection: 'spese',
  }
);

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
