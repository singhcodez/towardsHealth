export default function Dashboard({ analysis }) {
  // Defensive check in case analysis is null
  if (!analysis) return null;

  return (
    <section className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg mb-8">
      <h2 className="text-xl font-bold mb-2">Daily AI Verdict</h2>
      <p className="mb-4 text-blue-100">{analysis.daily_verdict}</p>
      
      <div className="grid grid-cols-2 gap-4 text-sm bg-blue-700 p-4 rounded-xl">
        <div><strong className="block text-blue-200">Calories In</strong> {analysis.total_calories_in} kcal</div>
        <div><strong className="block text-blue-200">Calories Out</strong> {analysis.total_calories_out} kcal</div>
        <div><strong className="block text-blue-200">Protein</strong> {analysis.macros?.protein_g || 0}g</div>
        <div><strong className="block text-blue-200">Carbs/Fat</strong> {analysis.macros?.carbs_g || 0}g / {analysis.macros?.fat_g || 0}g</div>
      </div>
    </section>
  );
}
