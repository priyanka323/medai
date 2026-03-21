const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

router.post('/calculate', async (req, res) => {
  try {
    const { medicine_id, weight_kg, age_months } = req.body;
    
    console.log('Calculating dose for:', { medicine_id, weight_kg, age_months });
    
    // Try to find by id field first, then by MongoDB _id
    let medicine = await Medicine.findOne({ id: medicine_id });
    
    if (!medicine && medicine_id.match(/^[0-9a-fA-F]{24}$/)) {
      medicine = await Medicine.findById(medicine_id);
    }
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found in database' });
    }
    
    console.log('Found medicine:', medicine.name);
    
    // Calculate dose based on weight
    let calculated_dose = weight_kg * medicine.dose_per_kg;
    let warnings = [];
    
    // Apply max single dose limit
    const max_single_dose = medicine.pediatric_max_single_dose_mg || medicine.max_single_dose_mg;
    let final_dose = calculated_dose;
    
    if (max_single_dose && calculated_dose > max_single_dose) {
      final_dose = max_single_dose;
      warnings.push(`⚠️ Dose capped at ${max_single_dose}mg (maximum single dose)`);
    }
    
    // Check age restrictions
    if (age_months && age_months < medicine.min_age_months) {
      warnings.push(`⚠️ WARNING: Patient age (${age_months} months) is below minimum recommended age (${medicine.min_age_months} months) for this medication`);
    }
    
    // Calculate daily dose
    const doses_per_day = 24 / medicine.frequency_hours;
    const daily_dose = final_dose * doses_per_day;
    
    // Check daily max limit
    if (daily_dose > medicine.max_daily_dose_mg) {
      warnings.push(`⚠️ Daily dose (${daily_dose.toFixed(0)}mg) exceeds maximum recommended (${medicine.max_daily_dose_mg}mg)`);
    }
    
    // Check contraindications
    if (medicine.contraindications && medicine.contraindications.length > 0) {
      warnings.push(`⚠️ Contraindications: ${medicine.contraindications.join(', ')}`);
    }
    
    const result = {
      medicine: medicine.name,
      category: medicine.category,
      route: medicine.route,
      patient: {
        weight_kg: weight_kg,
        age_months: age_months,
        patient_type: age_months < 216 ? 'Pediatric' : 'Adult' // 18 years = 216 months
      },
      dosing: {
        final_dose_mg: Math.round(final_dose * 10) / 10,
        dose_per_kg_used: medicine.dose_per_kg,
        daily_dose_mg: Math.round(daily_dose * 10) / 10,
        doses_per_day: doses_per_day,
        max_single_dose_mg: max_single_dose || 'N/A',
        max_daily_dose_mg: medicine.max_daily_dose_mg,
        frequency: `Every ${medicine.frequency_hours} hours`
      },
      safe: warnings.length === 0,
      warnings: warnings,
      notes: medicine.notes,
      interactions: medicine.interactions || []
    };
    
    res.json(result);
  } catch (error) {
    console.error('Dose calculation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;