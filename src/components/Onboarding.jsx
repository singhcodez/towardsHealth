import { useState } from 'react';

export default function Onboarding({ profile, setProfile }) {
  const [locationDenied, setLocationDenied] = useState(false);

  // Updates state AND local storage simultaneously
  const updateProfile = (field, value) => {
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);
    localStorage.setItem('fitness_profile', JSON.stringify(newProfile));
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationDenied(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newProfile = {
          ...profile,
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          city: '' // Clear manual city if precise GPS is acquired
        };
        setProfile(newProfile);
        localStorage.setItem('fitness_profile', JSON.stringify(newProfile));
        setLocationDenied(false);
      },
      (error) => {
        console.warn("Location denied:", error);
        setLocationDenied(true);
      }
    );
  };

  return (
    <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold mb-4 text-gray-800">1. Personal Profile</h2>
      <div className="grid grid-cols-2 gap-3">
        
        {/* Basic Stats */}
        <input 
          className="border p-2 rounded-lg bg-gray-50 focus:outline-blue-500" 
          placeholder="Age" type="number"
          value={profile.age || ''}
          onChange={(e) => updateProfile('age', e.target.value)}
        />
        <select 
          className="border p-2 rounded-lg bg-gray-50 focus:outline-blue-500"
          value={profile.gender || ''}
          onChange={(e) => updateProfile('gender', e.target.value)}
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* Body Metrics */}
        <input 
          className="border p-2 rounded-lg bg-gray-50 focus:outline-blue-500" 
          placeholder="Weight (kg)" type="number"
          value={profile.weight || ''}
          onChange={(e) => updateProfile('weight', e.target.value)}
        />
        <input 
          className="border p-2 rounded-lg bg-gray-50 focus:outline-blue-500" 
          placeholder="Height (cm)" type="number"
          value={profile.height || ''}
          onChange={(e) => updateProfile('height', e.target.value)}
        />

        {/* Job & Activity Context */}
        <input 
          className="border p-2 rounded-lg bg-gray-50 col-span-2 focus:outline-blue-500" 
          placeholder="Profession (e.g., Web Developer)" 
          value={profile.profession || ''}
          onChange={(e) => updateProfile('profession', e.target.value)}
        />
        <select 
          className="border p-2 rounded-lg bg-gray-50 col-span-2 focus:outline-blue-500"
          value={profile.activity_level || ''}
          onChange={(e) => updateProfile('activity_level', e.target.value)}
        >
          <option value="">Baseline Activity Level</option>
          <option value="1.2">Sedentary (Desk Job, little exercise)</option>
          <option value="1.375">Lightly Active (Light exercise 1-3 days/week)</option>
          <option value="1.55">Moderately Active (Moderate exercise 3-5 days/week)</option>
          <option value="1.725">Very Active (Heavy exercise 6-7 days/week)</option>
        </select>

        {/* Weather & Location Section */}
        <div className="col-span-2 mt-2 pt-3 border-t border-gray-200">
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Location (For Live Weather Context)
          </label>
          
          {/* Show GPS button if no location data exists and they haven't denied it */}
          {!locationDenied && !profile.lat && !profile.city ? (
            <button 
              onClick={requestLocation}
              className="w-full bg-blue-50 text-blue-700 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
            >
              📍 Enable GPS Location
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              {profile.lat && !profile.city && (
                <p className="text-xs text-green-600 font-medium">✅ GPS Location active.</p>
              )}
              {locationDenied && (
                <p className="text-xs text-red-500 font-medium">GPS denied. Please enter a city manually.</p>
              )}
              <input 
                className="border p-2 rounded-lg bg-gray-50 w-full focus:outline-blue-500" 
                placeholder="City (e.g., Amritsar)" 
                value={profile.city || ''}
                onChange={(e) => updateProfile('city', e.target.value)}
              />
            </div>
          )}
        </div>

      </div>
    </section>
  );
}