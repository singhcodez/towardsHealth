import { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import MealLogger from './components/MealLogger';
import ActivityLogger from './components/ActivityLogger';
import Dashboard from './components/Dashboard';
import Calculators from './components/Calculators';
import History from './components/History';

export default function App() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('fitness_profile');
    return saved ? JSON.parse(saved) : { 
      profession: ''
      // ... default empty fields
    };
  });  const [meals, setMeals] = useState([{ food_item: '', quantity: '', is_branded: false, brand_name: '' }]);
  const [activities, setActivities] = useState([{ task: '', duration_minutes: '' }]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [history, setHistory] = useState(() => {
  const saved = localStorage.getItem('fitness_history');
  return saved ? JSON.parse(saved) : [];
});

// Inside your App component
const [weather, setWeather] = useState({ temp: "Unknown", condition: "Unknown" });
const [locationError, setLocationError] = useState("");
useEffect(() => {
const fetchWeather = async (lat, lon, cityName = null) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  let url = '';

  if (cityName) {
    // Manual fallback URL
    url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
  } else if (lat && lon) {
    // Geolocation URL
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  } else {
    return; // No location data available at all
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather fetch failed");
    
    const data = await response.json();
    setWeather({
      temp: `${Math.round(data.main.temp)}°C`,
      condition: data.weather[0].main
    });
  } catch (err) {
    console.error("Weather API Error:", err);
    // Optionally set a default fallback here so LangChain doesn't break
    setWeather({ temp: "Unknown", condition: "Unknown" }); 
  }
};
}, [profile.city, profile.lat, profile.lon]);


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
      weather: weather, 
      meals,
      activities
    };

try {
      const response = await fetch('/.netlify/functions/analyze', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      
      
      const data = await response.json();
      
      // --- NEW HISTORY LOGIC ---
    // 1. Get today's local date string (e.g., "2026-07-02")
    const today = new Date().toLocaleDateString('en-CA'); 

    setHistory((prevHistory) => {
      const newEntry = {
        date: today,
        calories_in: data.total_calories_in, // Map to Gemini's JSON keys
        calories_out: data.total_calories_out,
        verdict: data.verdict
      };

      // 2. Filter out any existing entry for TODAY (so a user can overwrite their daily log without duplicating)
      const filteredHistory = prevHistory.filter(entry => entry.date !== today);

      // 3. Add the new entry to the top, and slice to keep only the last 7 days
      const updatedHistory = [newEntry, ...filteredHistory].slice(0, 7);

      // 4. Save to localStorage
      localStorage.setItem('fitness_history', JSON.stringify(updatedHistory));
      
      return updatedHistory;
    });
    // --- END NEW HISTORY LOGIC ---

      
      
      // NEW: Force an error if the status isn't 200 OK
      if (!response.ok) {
        throw new Error(data.details || data.error || "Unknown backend error");
      }
      
      setAnalysis(data);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(`Backend Error: ${error.message}`); 
    } finally {
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
      <Calculators profile={profile} />
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
       <History history="{history}"/>
    </div>
  );
}
