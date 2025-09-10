import mongoose from "mongoose";

const { Schema, model } = mongoose;

const incomeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required."],
    min: [0, "Amount must be a positive number."],
  },
  source: {
    type: String,
    required: [true, "Income source is required."],
    trim: true,
  },
  type: {
    type: String,
    enum: ["Salary", "Bonus", "Investment", "Freelance", "Gift", "Other"],
    required: [true, "Income type is required."],
  },
  date: {
    type: Date,
    required: [true, "Date is required."],
  },
  note: {
    type: String,
    trim: true,
  },
  
  month: Number,
  year: Number,
});


incomeSchema.pre("save", function (next) {
  const d = new Date(this.date);
  this.month = d.getMonth() + 1; 
  this.year = d.getFullYear();
  next();
});

const Income = model("Income", incomeSchema);

export default Income;