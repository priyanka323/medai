// const express = require('express');
// const router = express.Router();
// const Medicine = require('../models/Medicine');

// router.post('/calculate', async (req, res) => {
//   try {
//     const { medicine_id, weight_kg, age_months } = req.body;
    
//     console.log('Calculating dose for:', { medicine_id, weight_kg, age_months });
    
//     // Try to find by id field first, then by MongoDB _id
//     let medicine = await Medicine.findOne({ id: medicine_id });
    
//     if (!medicine && medicine_id.match(/^[0-9a-fA-F]{24}$/)) {
//       medicine = await Medicine.findById(medicine_id);
//     }
    
//     if (!medicine) {
//       return res.status(404).json({ error: 'Medicine not found in database' });
//     }
    
//     console.log('Found medicine:', medicine.name);
    
//     // Calculate dose based on weight
//     let calculated_dose = weight_kg * medicine.dose_per_kg;
//     let warnings = [];
    
//     // Apply max single dose limit
//     const max_single_dose = medicine.pediatric_max_single_dose_mg || medicine.max_single_dose_mg;
//     let final_dose = calculated_dose;
    
//     if (max_single_dose && calculated_dose > max_single_dose) {
//       final_dose = max_single_dose;
//       warnings.push(`⚠️ Dose capped at ${max_single_dose}mg (maximum single dose)`);
//     }
    
//     // Check age restrictions
//     if (age_months && age_months < medicine.min_age_months) {
//       warnings.push(`⚠️ WARNING: Patient age (${age_months} months) is below minimum recommended age (${medicine.min_age_months} months) for this medication`);
//     }
    
//     // Calculate daily dose
//     const doses_per_day = 24 / medicine.frequency_hours;
//     const daily_dose = final_dose * doses_per_day;
    
//     // Check daily max limit
//     if (daily_dose > medicine.max_daily_dose_mg) {
//       warnings.push(`⚠️ Daily dose (${daily_dose.toFixed(0)}mg) exceeds maximum recommended (${medicine.max_daily_dose_mg}mg)`);
//     }
    
//     // Check contraindications
//     if (medicine.contraindications && medicine.contraindications.length > 0) {
//       warnings.push(`⚠️ Contraindications: ${medicine.contraindications.join(', ')}`);
//     }
    
//     const result = {
//       medicine: medicine.name,
//       category: medicine.category,
//       route: medicine.route,
//       patient: {
//         weight_kg: weight_kg,
//         age_months: age_months,
//         patient_type: age_months < 216 ? 'Pediatric' : 'Adult' // 18 years = 216 months
//       },
//       dosing: {
//         final_dose_mg: Math.round(final_dose * 10) / 10,
//         dose_per_kg_used: medicine.dose_per_kg,
//         daily_dose_mg: Math.round(daily_dose * 10) / 10,
//         doses_per_day: doses_per_day,
//         max_single_dose_mg: max_single_dose || 'N/A',
//         max_daily_dose_mg: medicine.max_daily_dose_mg,
//         frequency: `Every ${medicine.frequency_hours} hours`
//       },
//       safe: warnings.length === 0,
//       warnings: warnings,
//       notes: medicine.notes,
//       interactions: medicine.interactions || []
//     };
    
//     res.json(result);
//   } catch (error) {
//     console.error('Dose calculation error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// Calculate dose
router.post('/calculate', async (req, res) => {
  try {
    const { medicine_id, weight_kg, age_months, conditions = [] } = req.body;
    
    if (!medicine_id || !weight_kg || age_months === undefined) {
      return res.status(400).json({ error: 'medicine_id, weight_kg, and age_months are required' });
    }
    
    let medicine;
    try {
      medicine = await Medicine.findById(medicine_id);
    } catch (err) {
      // Fallback to JSON if MongoDB fails
      const medicines = require('../medicines.json');
      medicine = medicines.find(m => m.id === medicine_id);
    }
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    const isAdult = age_months >= 216;
    const warnings = [];
    
    // Age check
    if (age_months < medicine.min_age_months) {
      return res.status(400).json({
        error: `${medicine.name} is not recommended for patients under ${Math.floor(medicine.min_age_months / 12)} years old.`,
        safe: false
      });
    }
    
    // Calculate dose
    const calculated_mg = parseFloat((medicine.dose_per_kg * weight_kg).toFixed(2));
    const max_single = isAdult ? medicine.max_single_dose_mg : medicine.pediatric_max_single_dose_mg;
    const final_dose_mg = Math.min(calculated_mg, max_single);
    
    if (final_dose_mg < calculated_mg) {
      warnings.push(`ℹ️ Dose capped at maximum single dose of ${max_single}mg.`);
    }
    
    const doses_per_day = Math.floor(24 / medicine.frequency_hours);
    const daily_dose_mg = parseFloat((final_dose_mg * doses_per_day).toFixed(2));
    
    if (daily_dose_mg > medicine.max_daily_dose_mg) {
      warnings.push(`⚠️ WARNING: Total daily dose (${daily_dose_mg}mg) exceeds maximum daily dose (${medicine.max_daily_dose_mg}mg).`);
    }
    
    res.json({
      medicine: medicine.name,
      category: medicine.category,
      route: medicine.route,
      patient: {
        weight_kg,
        age_months,
        age_years: parseFloat((age_months / 12).toFixed(1)),
        patient_type: isAdult ? 'Adult' : 'Pediatric'
      },
      dosing: {
        calculated_mg,
        final_dose_mg,
        frequency: `Every ${medicine.frequency_hours} hours`,
        doses_per_day,
        daily_dose_mg,
        max_single_dose_mg: max_single,
        max_daily_dose_mg: medicine.max_daily_dose_mg,
        dose_per_kg_used: medicine.dose_per_kg
      },
      safe: warnings.filter(w => w.includes('CONTRAINDICATED') || w.includes('WARNING')).length === 0,
      warnings,
      notes: medicine.notes,
      interactions: medicine.interactions
    });
    
  } catch (error) {
    console.error('Error calculating dose:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;