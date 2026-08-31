'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ExperienceCard {
  id: string;
  title: string;
  description: string;
  image: string;
}

const DEFAULT_CARDS: ExperienceCard[] = [
  {
    id: '1',
    title: 'SLOW MORNINGS',
    description: 'Private balcony, soft light, nowhere to rush.',
    image: '/assets/america1.png'
  },
  {
    id: '2',
    title: 'TASTE WITH MAKERS',
    description: 'Intimate tastings, never crowded tours.',
    image: '/assets/asia1.png'
  },
  {
    id: '3',
    title: 'TIME TO YOURSELF',
    description: 'Quiet corners and unhurried hours.',
    image: '/assets/europa1.png'
  },
  {
    id: '4',
    title: 'PRIVATE & PERSONAL',
    description: 'One dedicated host, your exact pace.',
    image: '/assets/room-all.png'
  }
];

export default function ExperienceCardsAdmin() {
  const [cards, setCards] = useState<ExperienceCard[]>(DEFAULT_CARDS);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const response = await fetch('/api/experience-cards');
      if (response.ok) {
        const data = await response.json();
        setCards(data);
      }
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  const handleCardChange = (id: string, field: string, value: string) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const handleImageUpload = async (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('cardId', id);

    try {
      setLoading(true);
      const response = await fetch('/api/upload-experience-image', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        handleCardChange(id, 'image', data.imagePath);
        setMessage('Image uploaded successfully!');
      }
    } catch (error) {
      setMessage('Error uploading image');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/experience-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cards)
      });

      if (response.ok) {
        setMessage('✅ Experience Cards saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Error saving cards');
      }
    } catch (error) {
      setMessage('❌ Error saving cards');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCards(DEFAULT_CARDS);
    setMessage('Reset to default values');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Experience Cards Manager</h1>
          <p className="text-gray-400">Edit images, titles, and descriptions for the Experience Cards section</p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 rounded bg-slate-700 border border-slate-600 text-sm">
            {message}
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4"
            >
              {/* Card ID */}
              <div className="text-xs text-slate-500 font-mono">Card #{card.id}</div>

              {/* Image Preview & Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Image</label>
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-48 object-cover rounded border border-slate-700"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(card.id, e)}
                  className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  disabled={loading}
                />
                <input
                  type="text"
                  value={card.image}
                  onChange={(e) => handleCardChange(card.id, 'image', e.target.value)}
                  placeholder="Image path (e.g., /assets/image.png)"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => handleCardChange(card.id, 'title', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={card.description}
                  onChange={(e) => handleCardChange(card.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium rounded transition-colors"
          >
            {loading ? 'Saving...' : '💾 Save Changes'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded transition-colors"
          >
            ↻ Reset to Default
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-slate-800 border border-slate-700 rounded text-sm text-slate-400">
          <p><strong>💡 Tips:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Upload images using the file input or paste the path directly</li>
            <li>Changes are saved to the project database when you click Save</li>
            <li>Images should be in the /assets/ folder for consistency</li>
            <li>The Experience Cards section will update automatically after saving</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
