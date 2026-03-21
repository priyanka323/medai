import React, { useState } from 'react';
import { Card } from '../components/UI';
import { Activity, Gauge, Brain, Scale, Heart, ChevronDown, ChevronUp } from 'lucide-react';
//, TrendingUp it need add in above
// Calculator Components
const CrClCalculator = () => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [sex, setSex] = useState('male');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const crNum = parseFloat(creatinine);

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(crNum) || ageNum <= 0 || weightNum <= 0 || crNum <= 0) {
      setResult(null);
      return;
    }

    let crcl = ((140 - ageNum) * weightNum) / (72 * crNum);
    if (sex === 'female') crcl *= 0.85;

    setResult({
      value: crcl.toFixed(1),
      unit: 'mL/min',
      interpretation: crcl < 60 ? 'Reduced kidney function – adjust medications' : 'Normal'
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="number" placeholder="Age (years)" className="input" value={age} onChange={(e) => setAge(e.target.value)} />
        <input type="number" placeholder="Weight (kg)" className="input" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <input type="number" placeholder="Creatinine (mg/dL)" className="input" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} />
        <select className="input" value={sex} onChange={(e) => setSex(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <button className="btn-primary w-full" onClick={calculate}>Calculate CrCl</button>
      {result && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{result.value} {result.unit}</div>
          <div className="text-sm">{result.interpretation}</div>
        </div>
      )}
    </div>
  );
};

const CkdEpiCalculator = () => {
  const [age, setAge] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [sex, setSex] = useState('male');
  const [race, setRace] = useState('non-black');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const ageNum = parseFloat(age);
    const crNum = parseFloat(creatinine);
    if (isNaN(ageNum) || isNaN(crNum) || ageNum <= 0 || crNum <= 0) return;

    let gfr;
    const k = sex === 'female' ? 0.7 : 0.9;
    const a = sex === 'female' ? -0.329 : -0.411;
    const b = sex === 'female' ? -1.209 : -1.209;
    const exponent = crNum <= k ? a : b;
    const constFactor = sex === 'female' ? 144 : 141;

    gfr = constFactor * Math.pow(crNum / k, exponent) * Math.pow(0.993, ageNum);
    if (race === 'black') gfr *= 1.159;

    const rounded = Math.round(gfr);
    let interpretation = '';
    if (rounded >= 90) interpretation = 'Normal or high';
    else if (rounded >= 60) interpretation = 'Mildly decreased';
    else if (rounded >= 45) interpretation = 'Mild to moderate decreased';
    else if (rounded >= 30) interpretation = 'Moderate to severe decreased';
    else if (rounded >= 15) interpretation = 'Severely decreased';
    else interpretation = 'Kidney failure';

    setResult({ value: rounded, unit: 'mL/min/1.73m²', interpretation });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="number" placeholder="Age (years)" className="input" value={age} onChange={(e) => setAge(e.target.value)} />
        <input type="number" placeholder="Creatinine (mg/dL)" className="input" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} />
        <select className="input" value={sex} onChange={(e) => setSex(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select className="input" value={race} onChange={(e) => setRace(e.target.value)}>
          <option value="non-black">Non-Black</option>
          <option value="black">Black</option>
        </select>
      </div>
      <button className="btn-primary w-full" onClick={calculate}>Calculate eGFR</button>
      {result && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{result.value} {result.unit}</div>
          <div className="text-sm">{result.interpretation}</div>
        </div>
      )}
    </div>
  );
};

const MapCalculator = () => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const sys = parseFloat(systolic);
    const dias = parseFloat(diastolic);
    if (isNaN(sys) || isNaN(dias) || sys <= 0 || dias <= 0 || sys <= dias) return;
    const map = dias + (sys - dias) / 3;
    setResult({
      value: map.toFixed(1),
      unit: 'mmHg',
      interpretation: map < 70 ? 'Low MAP – risk of organ hypoperfusion' : map > 100 ? 'Elevated MAP' : 'Normal'
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input type="number" placeholder="Systolic BP" className="input" value={systolic} onChange={(e) => setSystolic(e.target.value)} />
        <input type="number" placeholder="Diastolic BP" className="input" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} />
      </div>
      <button className="btn-primary w-full" onClick={calculate}>Calculate MAP</button>
      {result && (
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{result.value} {result.unit}</div>
          <div className="text-sm">{result.interpretation}</div>
        </div>
      )}
    </div>
  );
};

const ChadsVascCalculator = () => {
  const [riskFactors, setRiskFactors] = useState({
    chf: false, hypertension: false, age75: false, diabetes: false,
    stroke: false, vascular: false, age65_74: false, female: false
  });

  const updateFactor = (factor) => setRiskFactors(prev => ({ ...prev, [factor]: !prev[factor] }));

  const calculateScore = () => {
    let score = 0;
    if (riskFactors.chf) score += 1;
    if (riskFactors.hypertension) score += 1;
    if (riskFactors.age75) score += 2;
    if (riskFactors.diabetes) score += 1;
    if (riskFactors.stroke) score += 2;
    if (riskFactors.vascular) score += 1;
    if (riskFactors.age65_74) score += 1;
    if (riskFactors.female) score += 1;
    return score;
  };

  const score = calculateScore();
  const getRecommendation = () => {
    if (score === 0) return 'Low risk – consider no anticoagulation (if male)';
    if (score === 1) return 'Low–moderate risk – consider anticoagulation';
    return 'High risk – anticoagulation recommended';
  };

  const factors = [
    { key: 'chf', label: 'C – Congestive heart failure' },
    { key: 'hypertension', label: 'H – Hypertension' },
    { key: 'age75', label: 'A₂ – Age ≥75 years (2 points)' },
    { key: 'diabetes', label: 'D – Diabetes mellitus' },
    { key: 'stroke', label: 'S₂ – Prior stroke/TIA (2 points)' },
    { key: 'vascular', label: 'V – Vascular disease' },
    { key: 'age65_74', label: 'A – Age 65–74 years' },
    { key: 'female', label: 'Sc – Female sex' },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {factors.map(f => (
          <label key={f.key} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <input type="checkbox" checked={riskFactors[f.key]} onChange={() => updateFactor(f.key)} className="w-4 h-4" />
            <span className="text-sm">{f.label}</span>
          </label>
        ))}
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">Score: {score}</div>
        <div className="text-sm">{getRecommendation()}</div>
      </div>
    </div>
  );
};

const BmiBsaCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;

    const bmi = w / ((h / 100) ** 2);
    let bmiCategory = '';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal weight';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';

    const bsa = 0.007184 * Math.pow(w, 0.425) * Math.pow(h, 0.725);

    setResult({ bmi: bmi.toFixed(1), bmiCategory, bsa: bsa.toFixed(2), unit: 'm²' });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input type="number" placeholder="Weight (kg)" className="input" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <input type="number" placeholder="Height (cm)" className="input" value={height} onChange={(e) => setHeight(e.target.value)} />
      </div>
      <button className="btn-primary w-full" onClick={calculate}>Calculate</button>
      {result && (
        <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
          <div className="flex justify-between">
            <div>
              <div className="text-sm">BMI</div>
              <div className="text-2xl font-bold text-teal-600">{result.bmi}</div>
              <div className="text-xs">{result.bmiCategory}</div>
            </div>
            <div className="text-right">
              <div className="text-sm">BSA (DuBois)</div>
              <div className="text-2xl font-bold text-teal-600">{result.bsa} {result.unit}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const calculators = [
  { id: 'crcl', name: 'Creatinine Clearance (Cockcroft-Gault)', description: 'Estimates renal function for drug dosing', icon: Heart, component: CrClCalculator },
  { id: 'ckd-epi', name: 'CKD-EPI eGFR', description: 'Estimates GFR using creatinine equation', icon: Activity, component: CkdEpiCalculator },
  { id: 'map', name: 'Mean Arterial Pressure (MAP)', description: 'Calculates average arterial pressure', icon: Gauge, component: MapCalculator },
  { id: 'chads-vasc', name: 'CHA₂DS₂-VASc Score', description: 'Stroke risk assessment in atrial fibrillation', icon: Brain, component: ChadsVascCalculator },
  { id: 'bmi-bsa', name: 'BMI & Body Surface Area', description: 'Body mass index and DuBois BSA', icon: Scale, component: BmiBsaCalculator },
];

export default function CalculatorsPage() {
  const [openCalculator, setOpenCalculator] = useState(null);

  const toggleCalculator = (id) => {
    setOpenCalculator(openCalculator === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Clinical Calculators
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Evidence-based tools to support clinical decisions
        </p>
      </div>

      <div className="space-y-4">
        {calculators.map((calc) => {
          const Icon = calc.icon;
          const isOpen = openCalculator === calc.id;
          const CalculatorComponent = calc.component;

          return (
            <Card key={calc.id} className="overflow-hidden">
              <button
                onClick={() => toggleCalculator(calc.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{calc.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{calc.description}</p>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>

              {isOpen && (
                <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <CalculatorComponent />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}