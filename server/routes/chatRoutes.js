// const express = require('express');
// const router = express.Router();
// const Medicine = require('../models/Medicine');

// // Parse dose request from user input without O
// router.post('/parse-dose', async (req, res) => {
//   try {
//     const { message } = req.body;
//     console.log('Parsing message:', message);
    
//     const messageLower = message.toLowerCase();
//     let parsedData = { medicine: null, weight: null, age: null, age_unit: null };
    
//     // Extract medicine name
//     const medicines = await Medicine.find({});
//     for (const med of medicines) {
//       const medNameLower = med.name.toLowerCase();
//       const aliases = med.aliases || [];
      
//       if (messageLower.includes(medNameLower) || 
//           aliases.some(alias => messageLower.includes(alias.toLowerCase()))) {
//         parsedData.medicine = med.id;
//         break;
//       }
//     }
    
//     // Extract weight
//     const weightMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilogram)/i);
//     if (weightMatch) {
//       parsedData.weight = parseFloat(weightMatch[1]);
//     }
    
//     // Extract age
//     const yearMatch = message.match(/(\d+)\s*(?:years?|yrs?|year)/i);
//     if (yearMatch) {
//       parsedData.age = parseInt(yearMatch[1]);
//       parsedData.age_unit = 'years';
//     } else {
//       const monthMatch = message.match(/(\d+)\s*(?:months?|mos?|month)/i);
//       if (monthMatch) {
//         parsedData.age = parseInt(monthMatch[1]);
//         parsedData.age_unit = 'months';
//       }
//     }
    
//     console.log('Parsed data:', parsedData);
//     res.json(parsedData);
//   } catch (error) {
//     console.error('Parse error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // General chat endpoint
// router.post('/message', async (req, res) => {
//   try {
//     const { message, context } = req.body;
//     const messageLower = message.toLowerCase();
    
//     let reply = '';
    
//     // Check if it's a dose calculation request
//     if (messageLower.includes('calculate') || messageLower.includes('dose')) {
//       const medicines = await Medicine.find({});
//       let foundMedicine = null;
      
//       for (const med of medicines) {
//         const medNameLower = med.name.toLowerCase();
//         if (messageLower.includes(medNameLower)) {
//           foundMedicine = med;
//           break;
//         }
//       }
      
//       if (foundMedicine) {
//         const weightMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilogram)/i);
//         if (weightMatch) {
//           const weight = parseFloat(weightMatch[1]);
//           const dose = weight * foundMedicine.dose_per_kg;
//           const finalDose = foundMedicine.max_single_dose_mg && dose > foundMedicine.max_single_dose_mg ? 
//                            foundMedicine.max_single_dose_mg : dose;
          
//           reply = `✅ I found ${foundMedicine.name} in our database.\n\n` +
//                   `💊 **Dose Calculation:**\n` +
//                   `• Weight: ${weight} kg\n` +
//                   `• Standard dose: ${foundMedicine.dose_per_kg} mg/kg\n` +
//                   `• Calculated dose: ${Math.round(dose * 10) / 10} mg\n` +
//                   `• Maximum single dose: ${foundMedicine.max_single_dose_mg || 'N/A'} mg\n` +
//                   `• Recommended dose: ${Math.round(finalDose * 10) / 10} mg\n` +
//                   `• Frequency: Every ${foundMedicine.frequency_hours} hours\n` +
//                   `• Daily max: ${foundMedicine.max_daily_dose_mg} mg\n\n` +
//                   `${foundMedicine.notes || ''}\n\n` +
//                   `⚠️ Please consult a healthcare professional before administering medication.`;
//         } else {
//           reply = `I found ${foundMedicine.name} in our database. Please provide the patient's weight in kg to calculate the correct dose. Example: "Calculate dose for 20kg child ${foundMedicine.name}"`;
//         }
//       } else {
//         reply = "I couldn't identify the medicine. Please specify the medicine name clearly. Available medicines include: Paracetamol, Ibuprofen, Amoxicillin, Azithromycin, Cetirizine, Salbutamol, Metformin, Omeprazole, and Dexamethasone.";
//       }
//     } 
//     // Check for calculators
//     else if (messageLower.includes('calculator') || messageLower.includes('calculate')) {
//       reply = "We have several clinical calculators available:\n\n" +
//               "📊 **Available Calculators:**\n" +
//               "• Creatinine Clearance (Cockcroft-Gault)\n" +
//               "• CKD-EPI eGFR\n" +
//               "• Mean Arterial Pressure (MAP)\n" +
//               "• CHA₂DS₂-VASc Score\n" +
//               "• BMI & Body Surface Area (BSA)\n\n" +
//               "You can access all calculators from the Calculators page in the navigation menu.";
//     }
//     // Check for medicine list
//     else if (messageLower.includes('list') || messageLower.includes('available')) {
//       const medicines = await Medicine.find({});
//       const medicineNames = medicines.map(m => m.name).join(', ');
//       reply = `📋 **Available Medicines in Database:**\n\n${medicineNames}\n\nTotal: ${medicines.length} medicines`;
//     }
//     // Default response
//     else {
//       reply = "👋 Hello! I'm your medical assistant. I can help you with:\n\n" +
//               "💊 **Dose Calculation:**\n" +
//               "• 'Calculate dose for 20kg child paracetamol'\n" +
//               "• 'Ibuprofen for 5 year old weighing 18kg'\n" +
//               "• 'Amoxicillin dose for 8 months baby 7kg'\n\n" +
//               "📊 **Clinical Calculators:**\n" +
//               "• 'Show me calculators'\n" +
//               "• 'How to use MAP calculator?'\n\n" +
//               "📋 **Medicine Information:**\n" +
//               "• 'List all medicines'\n" +
//               "• 'Information about paracetamol'\n\n" +
//               "What would you like to know?";
//     }
    
//     res.json({ reply });
//   } catch (error) {
//     console.error('Chat error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get medicine information
// router.post('/medicine-info', async (req, res) => {
//   try {
//     const { medicine_name } = req.body;
//     const medicine = await Medicine.findOne({ 
//       name: new RegExp(medicine_name, 'i') 
//     });
    
//     if (!medicine) {
//       return res.json({ 
//         reply: `I couldn't find "${medicine_name}" in our database. Please check the spelling or try another medicine.` 
//       });
//     }
    
//     const reply = `💊 **${medicine.name}**\n\n` +
//                   `📂 **Category:** ${medicine.category}\n` +
//                   `💉 **Route:** ${medicine.route}\n` +
//                   `⚖️ **Dose:** ${medicine.dose_per_kg} mg/kg\n` +
//                   `⏰ **Frequency:** Every ${medicine.frequency_hours} hours\n` +
//                   `📈 **Maximum Daily:** ${medicine.max_daily_dose_mg} mg\n` +
//                   `🔞 **Minimum Age:** ${medicine.min_age_months} months\n\n` +
//                   `📝 **Notes:** ${medicine.notes || 'No additional notes'}\n\n` +
//                   `⚠️ **Contraindications:** ${medicine.contraindications?.join(', ') || 'None listed'}\n` +
//                   `🔄 **Interactions:** ${medicine.interactions?.join(', ') || 'None listed'}`;
    
//     res.json({ reply });
//   } catch (error) {
//     console.error('Medicine info error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// Parse dose request from user input
router.post('/parse-dose', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Parsing message:', message);
    
    const messageLower = message.toLowerCase();
    let parsedData = { medicine: null, weight: null, age: null, age_unit: null };
    
    // Get all medicines from database
    const medicines = await Medicine.find({});
    
    // Extract medicine name - try multiple matching strategies
    for (const med of medicines) {
      const medNameLower = med.name.toLowerCase();
      const aliases = med.aliases || [];
      
      // Check for exact match or partial match
      if (messageLower.includes(medNameLower) || 
          aliases.some(alias => messageLower.includes(alias.toLowerCase()))) {
        parsedData.medicine = med.id;
        console.log('Found medicine:', med.name);
        break;
      }
    }
    
    // If still not found, try to match common misspellings
    if (!parsedData.medicine) {
      const commonMedicines = ['paracetamol', 'ibuprofen', 'amoxicillin', 'azithromycin', 'cetirizine', 'salbutamol', 'metformin', 'omeprazole', 'dexamethasone'];
      for (const med of commonMedicines) {
        if (messageLower.includes(med)) {
          parsedData.medicine = med;
          console.log('Found medicine from common list:', med);
          break;
        }
      }
    }
    
    // Extract weight
    const weightMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilogram|kgs)/i);
    if (weightMatch) {
      parsedData.weight = parseFloat(weightMatch[1]);
      console.log('Found weight:', parsedData.weight);
    }
    
    // Extract age
    const yearMatch = message.match(/(\d+)\s*(?:years?|yrs?|year|yo)/i);
    if (yearMatch) {
      parsedData.age = parseInt(yearMatch[1]);
      parsedData.age_unit = 'years';
      console.log('Found age:', parsedData.age, 'years');
    } else {
      const monthMatch = message.match(/(\d+)\s*(?:months?|mos?|month)/i);
      if (monthMatch) {
        parsedData.age = parseInt(monthMatch[1]);
        parsedData.age_unit = 'months';
        console.log('Found age:', parsedData.age, 'months');
      }
    }
    
    console.log('Parsed data:', parsedData);
    res.json(parsedData);
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ error: error.message });
  }
});

// General chat endpoint
router.post('/message', async (req, res) => {
  try {
    const { message } = req.body;
    const messageLower = message.toLowerCase();
    
    console.log('Chat message received:', message);
    
    let reply = '';
    
    // Check if it's a dose calculation request
    if (messageLower.includes('calculate') || messageLower.includes('dose') || messageLower.includes('for')) {
      // Try to find medicine
      const medicines = await Medicine.find({});
      let foundMedicine = null;
      let medicineName = '';
      
      // Check all medicines
      for (const med of medicines) {
        const medNameLower = med.name.toLowerCase();
        if (messageLower.includes(medNameLower)) {
          foundMedicine = med;
          medicineName = med.name;
          console.log('Found medicine:', medicineName);
          break;
        }
      }
      
      // Check common medicine names
      if (!foundMedicine) {
        const commonNames = ['paracetamol', 'ibuprofen', 'amoxicillin', 'azithromycin', 'cetirizine', 'salbutamol'];
        for (const name of commonNames) {
          if (messageLower.includes(name)) {
            foundMedicine = await Medicine.findOne({ id: name });
            if (foundMedicine) {
              console.log('Found medicine from common list:', name);
              break;
            }
          }
        }
      }
      
      if (foundMedicine) {
        // Extract weight
        const weightMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilogram|kgs)/i);
        if (weightMatch) {
          const weight = parseFloat(weightMatch[1]);
          const dose = weight * foundMedicine.dose_per_kg;
          const maxSingle = foundMedicine.pediatric_max_single_dose_mg || foundMedicine.max_single_dose_mg;
          const finalDose = maxSingle && dose > maxSingle ? maxSingle : dose;
          
          reply = `✅ **Dose Calculated!**\n\n` +
                  `💊 **Medicine:** ${foundMedicine.name}\n` +
                  `⚖️ **Weight:** ${weight} kg\n` +
                  `📊 **Standard Dose:** ${foundMedicine.dose_per_kg} mg/kg\n` +
                  `💊 **Calculated Dose:** ${Math.round(finalDose * 10) / 10} mg\n` +
                  `⏰ **Frequency:** Every ${foundMedicine.frequency_hours} hours\n` +
                  `📈 **Daily Max:** ${foundMedicine.max_daily_dose_mg} mg\n\n` +
                  `📝 **Note:** ${foundMedicine.notes || 'Take as prescribed'}\n\n` +
                  `⚠️ **Contraindications:** ${foundMedicine.contraindications?.join(', ') || 'None'}\n\n` +
                  `✨ Click "Apply" below to use this medication in the calculator.`;
        } else {
          reply = `I found **${foundMedicine.name}** in our database!\n\n` +
                  `📊 **Dosing Information:**\n` +
                  `• Dose: ${foundMedicine.dose_per_kg} mg/kg\n` +
                  `• Frequency: Every ${foundMedicine.frequency_hours} hours\n` +
                  `• Max Daily: ${foundMedicine.max_daily_dose_mg} mg\n` +
                  `• Route: ${foundMedicine.route}\n\n` +
                  `Please provide the patient's weight to calculate the exact dose.\n` +
                  `Example: "Calculate dose for ${weight ? weight : '20'}kg child ${foundMedicine.name}"`;
        }
      } else {
        // List available medicines
        const availableMeds = await Medicine.find({}).limit(10);
        const medList = availableMeds.map(m => m.name.split('(')[0].trim()).join(', ');
        
        reply = `⚠️ I couldn't identify the medicine in your request.\n\n` +
                `**Available medicines in database:**\n${medList}\n\n` +
                `**Example requests:**\n` +
                `• "Calculate dose for 20kg child paracetamol"\n` +
                `• "Ibuprofen for 5 year old weighing 18kg"\n` +
                `• "Amoxicillin 7kg baby"\n\n` +
                `Please specify the medicine name and weight clearly.`;
      }
    } 
    // Check for medicine list
    else if (messageLower.includes('list') || messageLower.includes('available') || messageLower.includes('medicines')) {
      const medicines = await Medicine.find({});
      const medList = medicines.map(m => `• ${m.name}`).join('\n');
      reply = `📋 **Available Medicines in Database (${medicines.length} total):**\n\n${medList}\n\n💡 Type "calculate dose for [weight]kg [medicine]" to get a dose calculation.`;
    }
    // Check for medicine info
    else if (messageLower.includes('info') || messageLower.includes('tell me about') || messageLower.includes('what is')) {
      // Try to find medicine name in the message
      const medicines = await Medicine.find({});
      let foundMed = null;
      
      for (const med of medicines) {
        const medNameLower = med.name.toLowerCase();
        if (messageLower.includes(medNameLower) || 
            (med.aliases && med.aliases.some(a => messageLower.includes(a.toLowerCase())))) {
          foundMed = med;
          break;
        }
      }
      
      if (foundMed) {
        reply = `💊 **${foundMed.name}**\n\n` +
                `📂 **Category:** ${foundMed.category}\n` +
                `💉 **Route:** ${foundMed.route}\n` +
                `⚖️ **Dose:** ${foundMed.dose_per_kg} mg/kg\n` +
                `⏰ **Frequency:** Every ${foundMed.frequency_hours} hours\n` +
                `📈 **Maximum Daily:** ${foundMed.max_daily_dose_mg} mg\n` +
                `🔞 **Minimum Age:** ${foundMed.min_age_months} months\n\n` +
                `📝 **Notes:** ${foundMed.notes || 'No additional notes'}\n\n` +
                `⚠️ **Contraindications:** ${foundMed.contraindications?.join(', ') || 'None listed'}\n` +
                `🔄 **Interactions:** ${foundMed.interactions?.join(', ') || 'None listed'}`;
      } else {
        reply = `I can provide information about medicines. Try: "Tell me about paracetamol" or "What is ibuprofen?"`;
      }
    }
    // Help
    else if (messageLower.includes('help')) {
      reply = `👋 **How I can help you:**\n\n` +
              `💊 **Calculate Doses:**\n` +
              `• "Calculate dose for 20kg child paracetamol"\n` +
              `• "Ibuprofen for 5 year old weighing 18kg"\n` +
              `• "Amoxicillin 7kg baby"\n\n` +
              `📊 **Medicine Information:**\n` +
              `• "Tell me about paracetamol"\n` +
              `• "What is ibuprofen?"\n\n` +
              `📋 **List Medicines:**\n` +
              `• "List all medicines"\n` +
              `• "What medicines are available?"\n\n` +
              `Try one of these examples!`;
    }
    // Default
    else {
      reply = `👋 Hello! I'm your medical assistant. I can help you with:\n\n` +
              `💊 **Calculate doses:** "Calculate dose for 20kg child paracetamol"\n\n` +
              `📋 **Medicine info:** "Tell me about ibuprofen"\n\n` +
              `📊 **List medicines:** "List all medicines"\n\n` +
              `What would you like to know?`;
    }
    
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get medicine information
router.post('/medicine-info', async (req, res) => {
  try {
    const { medicine_name } = req.body;
    const medicine = await Medicine.findOne({ 
      name: new RegExp(medicine_name, 'i') 
    });
    
    if (!medicine) {
      return res.json({ 
        reply: `I couldn't find "${medicine_name}" in our database. Try "List all medicines" to see what's available.` 
      });
    }
    
    const reply = `💊 **${medicine.name}**\n\n` +
                  `📂 **Category:** ${medicine.category}\n` +
                  `💉 **Route:** ${medicine.route}\n` +
                  `⚖️ **Dose:** ${medicine.dose_per_kg} mg/kg\n` +
                  `⏰ **Frequency:** Every ${medicine.frequency_hours} hours\n` +
                  `📈 **Maximum Daily:** ${medicine.max_daily_dose_mg} mg\n` +
                  `🔞 **Minimum Age:** ${medicine.min_age_months} months\n\n` +
                  `📝 **Notes:** ${medicine.notes || 'No additional notes'}\n\n` +
                  `⚠️ **Contraindications:** ${medicine.contraindications?.join(', ') || 'None listed'}\n` +
                  `🔄 **Interactions:** ${medicine.interactions?.join(', ') || 'None listed'}`;
    
    res.json({ reply });
  } catch (error) {
    console.error('Medicine info error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;