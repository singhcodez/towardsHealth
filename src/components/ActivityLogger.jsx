export default function ActivityLogger({ activities, setActivities }) {
  
  const addActivityRow = () => {
    setActivities([...activities, { task: '', duration_minutes: '' }]);
  };

  const updateActivity = (index, field, value) => {
    const newActs = [...activities];
    newActs[index][field] = value;
    setActivities(newActs);
  };

  return (
    <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold mb-4 text-gray-800">3. What to Do</h2>
      
      {activities.map((activity, index) => (
        <div key={index} className="flex gap-2 mb-3">
          <input 
            className="w-2/3 border p-2 rounded-lg bg-gray-50" 
            placeholder="Activity (e.g., Plyo Jump Squats)" 
            value={activity.task}
            onChange={(e) => updateActivity(index, 'task', e.target.value)}
          />
          <input 
            className="w-1/3 border p-2 rounded-lg bg-gray-50" 
            placeholder="Minutes" 
            type="number"
            value={activity.duration_minutes}
            onChange={(e) => updateActivity(index, 'duration_minutes', e.target.value)}
          />
        </div>
      ))}
      
      <button 
        onClick={addActivityRow} 
        className="w-full bg-green-50 text-green-700 py-2 rounded-xl font-semibold hover:bg-green-100 transition"
      >
        + Add Activity
      </button>
    </section>
  );
}
