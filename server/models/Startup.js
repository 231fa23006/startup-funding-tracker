import mongoose from "mongoose";

const startupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    industry: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 1200 },
    fundingGoal: { type: Number, required: true, min: 1 },
    amountRaised: { type: Number, default: 0, min: 0 },
    founder: { type: String, trim: true, maxlength: 100, default: "Not specified" },
    website: { type: String, trim: true, maxlength: 200, default: "" }
  },
  { timestamps: true }
);

startupSchema.pre("validate", function () {
  if (this.amountRaised > this.fundingGoal) {
    this.invalidate("amountRaised", "Amount raised cannot exceed the funding goal.");
  }
});

export default mongoose.model("Startup", startupSchema);
