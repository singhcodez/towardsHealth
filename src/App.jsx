import { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import MealLogger from './components/MealLogger';
import ActivityLogger from './components/ActivityLogger';
import Dashboard from './components/Dashboard';

export default function App() {
  const [profile, setProfile] = useState({ profession: '' });
  const [meals, setMeals] = useState([{ food_item: '', quantity: '', is_branded: false, brand_name: '' }]);
  const [activities, setActivities] = useState([{ task: '', duration_minutes: '' }]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker Registered'))
        .catch(err => console.error('Service Worker registration failed:', err));
    }
  }, []);

  const analyzeDay = async () => {
    setLoading(true);
    
    const payload = {
      profession: profile.profession,
      weather: { temp: "38°C", condition: "Sunny" }, 
      meals,
      activities
    };

   try {
  const response = await fetch('/.netlify/functions/analyze', { method: 'POST', body: JSON.stringify(payload) });
  const data = await response.json();

  if (response.status === 200) {
    setAnalysis(data); // Success!
  } else {
    // Show the error message sent from the backend
    alert(data.error || "Something went wrong."); 
  }
} catch (error) {
  alert("Connection error: Ensure the app is connected to the internet.");
}
    finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <header className="text-center py-4">
        <h1 className="text-3xl font-extrabold text-blue-600">Towards Fitness</h1>
        <p className="text-sm text-gray-500 font-medium">Smart AI Health Logging</p>
      </header>

      <Onboarding profile={profile} setProfile={setProfile} />
      
      <MealLogger meals={meals} setMeals={setMeals} />
      
      <ActivityLogger activities={activities} setActivities={setActivities} />

      <button 
        onClick={analyzeDay}
        disabled={loading}
        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition mb-4 disabled:bg-gray-400"
      >
        {loading ? "Analyzing..." : "Analyze Day with AI"}
      </button>
      {/* Error Banner */}
      {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
        <strong className="font-bold">Notice: </strong>
       <span className="block sm:inline">{error}</span>
      </div>
      )}

      <Dashboard analysis={analysis} />
    </div>
  );
}
