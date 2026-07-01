export default function Calculators({ profile }) {
  // Wait until all essential data is entered before showing calculations
  if (!profile.age || !profile.gender || !profile.weight || !profile.height || !profile.activity_level) {
    return null;
  }

  const age = parseFloat(profile.age);
  const weight = parseFloat(profile.weight);
  const height = parseFloat(profile.height);
  const activity = parseFloat(profile.activity_level);

  // 1. BMI Calculation: Weight(kg) / (Height(m))^2
  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

  // 2. BMR (Basal Metabolic Rate) - Mifflin-St Jeor Equation
  let bmr = 0;
  if (profile.gender === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }

  // 3. TDEE (Total Daily Energy Expenditure)
  const tdee = Math.round(bmr * activity);

  return (
    <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-5 rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-lg font-bold mb-4 text-gray-100">Baseline Metrics</h2>
      <div className="grid grid-cols-3 gap-2 text-center">
        
        <div className="bg-gray-800 p-3 rounded-xl border border-gray-600">
          <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">BMI</span>
          <span className="text-xl font-extrabold text-blue-400">{bmi}</span>
        </div>
        
        <div className="bg-gray-800 p-3 rounded-xl border border-gray-600">
          <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">BMR</span>
          <span className="text-xl font-extrabold text-green-400">{Math.round(bmr)}</span>
          <span className="block text-[10px] text-gray-500 mt-1">kcal/day</span>
        </div>
        
        <div className="bg-gray-800 p-3 rounded-xl border border-gray-600">
          <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Maintain</span>
          <span className="text-xl font-extrabold text-purple-400">{tdee}</span>
          <span className="block text-[10px] text-gray-500 mt-1">kcal/day</span>
        </div>

      </div>
    </section>
  );
}