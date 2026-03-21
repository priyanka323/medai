// const express = require('express');
// const router = express.Router();
// const Medicine = require('../models/Medicine');

// // Get all medicines
// router.get('/', async (req, res) => {
//   try {
//     const medicines = await Medicine.find({});
//     res.json(medicines);
//   } catch (error) {
//     console.error('Error fetching medicines:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Search medicines - MAIN SEARCH ENDPOINT
// router.get('/search', async (req, res) => {
//   try {
//     const { q } = req.query;
//     console.log('Search query:', q);
    
//     if (!q || q.length < 2) {
//       return res.json([]);
//     }
    
//     // Case-insensitive search using regex
//     const searchRegex = new RegExp(q, 'i');
    
//     const medicines = await Medicine.find({
//       $or: [
//         { name: searchRegex },
//         { category: searchRegex },
//         { aliases: { $in: [searchRegex] } }
//       ]
//     }).limit(20);
    
//     console.log(`Found ${medicines.length} medicines matching "${q}"`);
//     res.json(medicines);
//   } catch (error) {
//     console.error('Search error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get medicine by ID
// router.get('/:id', async (req, res) => {
//   try {
//     // Try to find by custom id field first, then by MongoDB _id
//     let medicine = await Medicine.findOne({ id: req.params.id });
    
//     if (!medicine && mongoose.Types.ObjectId.isValid(req.params.id)) {
//       medicine = await Medicine.findById(req.params.id);
//     }
    
//     if (!medicine) {
//       return res.status(404).json({ error: 'Medicine not found' });
//     }
//     res.json(medicine);
//   } catch (error) {
//     console.error('Error fetching medicine:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get medicines by category
// router.get('/category/:category', async (req, res) => {
//   try {
//     const categoryRegex = new RegExp(req.params.category, 'i');
//     const medicines = await Medicine.find({ category: categoryRegex });
//     res.json(medicines);
//   } catch (error) {
//     console.error('Error fetching by category:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get medicine statistics
// router.get('/stats/count', async (req, res) => {
//   try {
//     const count = await Medicine.countDocuments();
//     const categories = await Medicine.distinct('category');
//     res.json({ 
//       totalMedicines: count,
//       categories: categories,
//       categoriesCount: categories.length
//     });
//   } catch (error) {
//     console.error('Error fetching stats:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// Search medicines - MAIN SEARCH ENDPOINT
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    console.log('Search query received:', q);
    
    if (!q || q.length < 2) {
      return res.json([]);
    }
    
    // Case-insensitive search using regex
    const searchRegex = new RegExp(q, 'i');
    
    const medicines = await Medicine.find({
      $or: [
        { name: searchRegex },
        { category: searchRegex },
        { aliases: { $in: [searchRegex] } }
      ]
    }).limit(20);
    
    console.log(`Found ${medicines.length} medicines matching "${q}"`);
    res.json(medicines);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.json(medicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get medicine stats
router.get('/stats/count', async (req, res) => {
  try {
    const count = await Medicine.countDocuments();
    const categories = await Medicine.distinct('category');
    res.json({ 
      totalMedicines: count,
      categories: categories,
      categoriesCount: categories.length
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;