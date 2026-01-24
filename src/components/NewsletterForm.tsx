import { useState, useEffect } from 'react';

interface Language {
  id: number;
  name: string;
  logo_url: string;
}

interface Framework {
  id: number;
  name: string;
  logo_url: string;
}

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';

export default function NewsletterForm() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    primary_role: '',
    favorite_languages: [] as number[],
    favorite_frameworks: [] as number[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [langRes, fwRes] = await Promise.all([
        fetch(`${API_URL}/api/subscribers/languages/`),
        fetch(`${API_URL}/api/subscribers/frameworks/`),
      ]);

      const langData = await langRes.json();
      const fwData = await fwRes.json();

      setLanguages(langData);
      setFrameworks(fwData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLanguageToggle = (id: number) => {
    setFormData((prev) => {
      const current = prev.favorite_languages;
      if (current.includes(id)) {
        return { ...prev, favorite_languages: current.filter((l) => l !== id) };
      } else if (current.length < 3) {
        return { ...prev, favorite_languages: [...current, id] };
      }
      return prev;
    });
  };

  const handleFrameworkToggle = (id: number) => {
    setFormData((prev) => {
      const current = prev.favorite_frameworks;
      if (current.includes(id)) {
        return { ...prev, favorite_frameworks: current.filter((f) => f !== id) };
      } else if (current.length < 3) {
        return { ...prev, favorite_frameworks: [...current, id] };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/subscribers/subscribe/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: '🎉 Successfully subscribed! Check your email for your first horoscope.',
        });
        setFormData({
          name: '',
          email: '',
          primary_role: '',
          favorite_languages: [],
          favorite_frameworks: [],
        });
      } else {
        const errorMsg = Object.values(data).flat().join(', ');
        setMessage({
          type: 'error',
          text: errorMsg || 'Failed to subscribe. Please try again.',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error. Please try again later.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="terminal-box text-center">
        <div className="animate-pulse">Loading horoscope data...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="terminal-box max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold glow-text mb-2">🔮 Subscribe to Dev Horoscope</h2>
        <p className="text-green-400">Get your weekly dose of developer fortune-telling</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg border-2 ${
            message.type === 'success'
              ? 'bg-green-900/30 border-green-500 text-green-300'
              : 'bg-red-900/30 border-red-500 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-bold mb-2">Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-gray-800 border-2 border-terminal-border rounded px-4 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Your name"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-bold mb-2">Email *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-gray-800 border-2 border-terminal-border rounded px-4 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="your.email@example.com"
        />
      </div>

      {/* Primary Role */}
      <div>
        <label className="block text-sm font-bold mb-2">Primary Role *</label>
        <select
          required
          value={formData.primary_role}
          onChange={(e) => setFormData({ ...formData, primary_role: e.target.value })}
          className="w-full bg-gray-800 border-2 border-terminal-border rounded px-4 py-2 text-terminal-text focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select your role</option>
          <option value="frontend">Frontend Developer</option>
          <option value="backend">Backend Developer</option>
          <option value="fullstack">Full-Stack Developer</option>
          <option value="devops">DevOps Engineer</option>
          <option value="mobile">Mobile Developer</option>
          <option value="data">Data Scientist</option>
          <option value="qa">QA Engineer</option>
        </select>
      </div>

      {/* Favorite Languages */}
      <div>
        <label className="block text-sm font-bold mb-2">
          Favorite Programming Languages * (Select exactly 3)
        </label>
        <p className="text-xs text-green-400 mb-3">
          Selected: {formData.favorite_languages.length}/3
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-800/50 rounded">
          {languages.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => handleLanguageToggle(lang.id)}
              className={`p-3 rounded border-2 transition-all ${
                formData.favorite_languages.includes(lang.id)
                  ? 'border-terminal-border bg-green-900/30 shadow-lg shadow-green-500/30'
                  : 'border-gray-600 hover:border-green-400'
              }`}
            >
              <div className="text-xs font-bold">{lang.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Favorite Frameworks */}
      <div>
        <label className="block text-sm font-bold mb-2">
          Favorite Frameworks * (Select exactly 3)
        </label>
        <p className="text-xs text-green-400 mb-3">
          Selected: {formData.favorite_frameworks.length}/3
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-800/50 rounded">
          {frameworks.map((fw) => (
            <button
              key={fw.id}
              type="button"
              onClick={() => handleFrameworkToggle(fw.id)}
              className={`p-3 rounded border-2 transition-all ${
                formData.favorite_frameworks.includes(fw.id)
                  ? 'border-terminal-border bg-green-900/30 shadow-lg shadow-green-500/30'
                  : 'border-gray-600 hover:border-green-400'
              }`}
            >
              <div className="text-xs font-bold">{fw.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          submitting ||
          formData.favorite_languages.length !== 3 ||
          formData.favorite_frameworks.length !== 3
        }
        className="w-full bg-terminal-border text-black font-bold py-3 px-6 rounded-lg hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/50 hover:shadow-green-500/70"
      >
        {submitting ? 'Subscribing...' : '🚀 Subscribe to Dev Horoscope'}
      </button>

      <p className="text-xs text-center text-gray-500 mt-4">
        By subscribing, you agree to receive weekly horoscope emails. Unsubscribe anytime.
      </p>
    </form>
  );
}
