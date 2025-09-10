import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: ["Food", "Transport", "Bills", "Shopping", "Health", "Others"],
    required: true,
  },
  limit: { type: Number, required: true },
  month: Number,
  year: Number,
});

budgetSchema.pre("save", function (next) {
  const d = new Date();
  this.month = d.getMonth() + 1;
  this.year = d.getFullYear();
  next();
});

const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);


export default Budget;
