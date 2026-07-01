export default function MealLogger({ meals, setMeals }) {
  
  const addMealRow = () => {
    setMeals([...meals, { food_item: '', quantity: '', is_branded: false, brand_name: '' }]);
  };

  const updateMeal = (index, field, value) => {
    const newMeals = [...meals];
    newMeals[index][field] = value;
    setMeals(newMeals);
  };

  return (
    <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold mb-4 text-gray-800">2. What to Eat</h2>
      
      {meals.map((meal, index) => (
        <div key={index} className="space-y-3 mb-4 p-4 border rounded-xl bg-gray-50">
          <input 
            className="w-full border p-2 rounded-lg bg-white" 
            placeholder="Food Item (e.g., Protein Oats)" 
            value={meal.food_item}
            onChange={(e) => updateMeal(index, 'food_item', e.target.value)}
          />
          <input 
            className="w-full border p-2 rounded-lg bg-white" 
            placeholder="Quantity (e.g., 50g or 2 bowls)" 
            value={meal.quantity}
            onChange={(e) => updateMeal(index, 'quantity', e.target.value)}
          />
          
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded text-blue-600"
              checked={meal.is_branded}
              onChange={(e) => updateMeal(index, 'is_branded', e.target.checked)}
            />
            <span>Is this a specific brand?</span>
          </label>
          
          {meal.is_branded && (
            <input 
              className="w-full border p-2 rounded-lg bg-white" 
              placeholder="Brand Name (e.g., Doctor's Choice)" 
              value={meal.brand_name}
              onChange={(e) => updateMeal(index, 'brand_name', e.target.value)}
            />
          )}
        </div>
      ))}
      
      <button 
        onClick={addMealRow} 
        className="w-full bg-blue-50 text-blue-700 py-2 rounded-xl font-semibold hover:bg-blue-100 transition"
      >
        + Add Another Item
      </button>
    </section>
  );
}
