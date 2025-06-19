import { useState } from 'react';
import { createCertificateAsset } from '../lib/algorand';

export default function CertificateForm() {
  const [student, setStudent] = useState('');
  const [course, setCourse] = useState('');
  const [date, setDate] = useState('');
  const [assetId, setAssetId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const id = await createCertificateAsset(student, course, date);
      setAssetId(id);
    } catch (err) {
      console.error(err);
      alert('Failed to create certificate.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-xl space-y-4 mt-10">
      <h2 className="text-xl font-bold mb-4">Create Certificate</h2>

      <input
        className="w-full border p-2 rounded"
        type="text"
        placeholder="Student Name"
        value={student}
        onChange={(e) => setStudent(e.target.value)}
        required
      />
      <input
        className="w-full border p-2 rounded"
        type="text"
        placeholder="Course Name"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        required
      />
      <input
        className="w-full border p-2 rounded"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Issue Certificate'}
      </button>

      {assetId && (
        <p className="text-green-600 font-semibold">
          ✅ Certificate created. ASA ID: {assetId}
        </p>
      )}
    </form>
  );
}
