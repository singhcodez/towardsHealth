export default function Onboarding({ profile, setProfile }) {
  const updateProfile = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold mb-4 text-gray-800">1. Personal Profile</h2>
      <div className="grid grid-cols-2 gap-3">
        
        {/* Basic Stats */}
        <input 
          className="border p-2 rounded-lg bg-gray-50" 
          placeholder="Age" type="number"
          value={profile.age || ''}
          onChange={(e) => updateProfile('age', e.target.value)}
        />
        <select 
          className="border p-2 rounded-lg bg-gray-50"
          value={profile.gender || ''}
          onChange={(e) => updateProfile('gender', e.target.value)}
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* Body Metrics */}
        <input 
          className="border p-2 rounded-lg bg-gray-50" 
          placeholder="Weight (kg)" type="number"
          value={profile.weight || ''}
          onChange={(e) => updateProfile('weight', e.target.value)}
        />
        <input 
          className="border p-2 rounded-lg bg-gray-50" 
          placeholder="Height (cm)" type="number"
          value={profile.height || ''}
          onChange={(e) => updateProfile('height', e.target.value)}
        />

        {/* Job & Activity Context */}
        <input 
          className="border p-2 rounded-lg bg-gray-50 col-span-2" 
          placeholder="Profession (e.g., Web Developer)" 
          value={profile.profession || ''}
          onChange={(e) => updateProfile('profession', e.target.value)}
        />
        <select 
          className="border p-2 rounded-lg bg-gray-50 col-span-2"
          value={profile.activity_level || ''}
          onChange={(e) => updateProfile('activity_level', parseFloat(e.target.value))}
        >
          <option value="">Baseline Activity Level</option>
          <option value="1.2">Sedentary (Desk Job, little exercise)</option>
          <option value="1.375">Lightly Active (Light exercise 1-3 days/week)</option>
          <option value="1.55">Moderately Active (Moderate exercise 3-5 days/week)</option>
          <option value="1.725">Very Active (Heavy exercise 6-7 days/week)</option>
        </select>

      </div>
    </section>
  );
}