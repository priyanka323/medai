// const mongoose = require('mongoose');

// const medicineSchema = new mongoose.Schema({
//   id: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   category: { type: String, required: true },
//   dose_per_kg: { type: Number, required: true },
//   max_single_dose_mg: { type: Number, default: null },
//   max_daily_dose_mg: { type: Number, required: true },
//   frequency_hours: { type: Number, required: true },
//   min_age_months: { type: Number, default: 0 },
//   route: { type: String, required: true },
//   notes: { type: String },
//   pediatric_max_single_dose_mg: { type: Number, default: null },
//   contraindications: [{ type: String }],
//   interactions: [{ type: String }],
//   aliases: [{ type: String }]
// }, {
//   timestamps: true
// });

// // Add index for better search performance
// medicineSchema.index({ name: 'text', category: 'text', aliases: 'text' });

// module.exports = mongoose.model('Medicine', medicineSchema);
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  dose_per_kg: Number,
  max_single_dose_mg: Number,
  max_daily_dose_mg: Number,
  frequency_hours: Number,
  min_age_months: Number,
  route: String,
  notes: String,
  pediatric_max_single_dose_mg: Number,
  contraindications: [String],
  interactions: [String]
});

module.exports = mongoose.model('Medicine', medicineSchema);