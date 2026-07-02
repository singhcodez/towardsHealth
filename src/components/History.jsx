export default function History({ history }) {
  if (!history || history.length === 0) {
    return (
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mt-4">
        <h2 className="text-lg font-bold mb-3 text-gray-800">7-Day History</h2>
        <p className="text-sm text-gray-500 text-center py-4">
          No logs yet. Submit today's data to start tracking your progress!
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mt-4">
      <h2 className="text-lg font-bold mb-4 text-gray-800">7-Day History</h2>
      <div className="flex flex-col gap-3">
        {history.map((day, index) => {
          // Calculate the net difference
          const netCalories = day.calories_in - day.calories_out;
          const isDeficit = netCalories < 0;

          return (
            <div key={day.date} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-2">
              
              {/* Header: Date and Status Badge */}
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">{day.date}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  isDeficit ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {isDeficit ? 'Deficit' : 'Surplus'}: {Math.abs(netCalories)} kcal
                </span>
              </div>

              {/* Data Row */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>In: <strong>{day.calories_in}</strong></span>
                <span>Out: <strong>{day.calories_out}</strong></span>
              </div>

              {/* AI Verdict */}
              {day.verdict && (
                <p className="text-xs text-gray-500 italic border-t border-gray-200 pt-2 mt-1">
                  "{day.verdict}"
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
