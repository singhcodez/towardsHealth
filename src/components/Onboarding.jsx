export default function Onboarding({ profile, setProfile }) {
  return (
    <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold mb-4 text-gray-800">1. Personal Profile</h2>
      <div className="grid grid-cols-1 gap-3">
        <input 
          className="border p-2 rounded-lg bg-gray-50 w-full" 
          placeholder="Everyday Profession (e.g., Web Developer)" 
          value={profile.profession}
          onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
        />
      </div>
    </section>
  );
}
