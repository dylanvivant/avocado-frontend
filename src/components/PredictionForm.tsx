'use client';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/config/api';
import type { PredictionFormData, Region } from '@/types';

// Définition des régions en dehors du composant
const regions: Region[] = [
  { label: 'Atlanta', value: 'Atlanta' },
  { label: 'Baltimore/Washington', value: 'BaltimoreWashington' },
  { label: 'South Carolina', value: 'SouthCarolina' },
  { label: 'South Central', value: 'SouthCentral' },
  { label: 'Southeast', value: 'Southeast' },
  { label: 'Spokane', value: 'Spokane' },
  { label: 'St Louis', value: 'StLouis' },
  { label: 'Syracuse', value: 'Syracuse' },
  { label: 'Tampa', value: 'Tampa' },
  { label: 'Total US', value: 'TotalUS' },
  { label: 'West', value: 'West' },
  { label: 'West Tex/New Mexico', value: 'WestTexNewMexico' },
];

const initialFormState: PredictionFormData = {
  Quality1: 0,
  Quality2: 0,
  Quality3: 0,
  SmallBags: 0,
  LargeBags: 0,
  XLargeBags: 0,
  type: 'conventional',
  year: 2024,
  region: regions[0].value,
};

export default function PredictionForm() {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] =
    useState<PredictionFormData>(initialFormState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formatted_data = {
        Quality1: Number(formData.Quality1),
        Quality2: Number(formData.Quality2),
        Quality3: Number(formData.Quality3),
        'Small Bags': Number(formData.SmallBags),
        'Large Bags': Number(formData.LargeBags),
        'XLarge Bags': Number(formData.XLargeBags),
        type: formData.type,
        year: Number(formData.year),
        region: formData.region,
      };

      console.log('Données envoyées:', formatted_data);

      const response = await axios.post(`${API_URL}/predict`, formatted_data, {
        headers: {
          'Content-Type': 'application/json',
        },
        // Ajouter ces options pour voir plus de détails sur l'erreur
        validateStatus: function (status) {
          return status < 600; // Accepter toutes les réponses pour pouvoir les logger
        },
      });

      console.log('Réponse complète:', response);

      if (response.status === 200) {
        setPrediction(response.data.predicted_price);
      } else {
        throw new Error(
          `Erreur ${response.status}: ${JSON.stringify(response.data)}`
        );
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      if (error.response) {
        console.error('Données de réponse:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('Requête sans réponse:', error.request);
      } else {
        console.error('Erreur de configuration:', error.message);
      }
      alert(`Erreur: ${error.message || 'Erreur inconnue'}`);
    }
    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        'Quality1',
        'Quality2',
        'Quality3',
        'SmallBags',
        'LargeBags',
        'XLargeBags',
        'year',
      ].includes(name)
        ? Number(value)
        : value,
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto" suppressHydrationWarning>
      <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">
        Prédiction du Prix des Avocats
      </h1>

      <div className="bg-white rounded-lg shadow-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Qualités */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-700">Qualités</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualité 1
                  </label>
                  <input
                    type="number"
                    name="Quality1"
                    step="1"
                    value={formData.Quality1}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualité 2
                  </label>
                  <input
                    type="number"
                    name="Quality2"
                    step="1"
                    value={formData.Quality2}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualité 3
                  </label>
                  <input
                    type="number"
                    name="Quality3"
                    step="1"
                    value={formData.Quality3}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Sacs */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-700">
                Quantités
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Petits Sacs
                  </label>
                  <input
                    type="number"
                    name="SmallBags"
                    min="0"
                    value={formData.SmallBags}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grands Sacs
                  </label>
                  <input
                    type="number"
                    name="LargeBags"
                    min="0"
                    value={formData.LargeBags}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Très Grands Sacs
                  </label>
                  <input
                    type="number"
                    name="XLargeBags"
                    min="0"
                    value={formData.XLargeBags}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="conventional">Conventionnel</option>
                <option value="organic">Biologique</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année
              </label>
              <input
                type="number"
                name="year"
                min="2020"
                max="2030"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Région
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {regions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Prédiction en cours...
              </span>
            ) : (
              'Prédire le Prix'
            )}
          </button>
        </form>
      </div>

      {prediction !== null && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Résultat de la Prédiction
          </h2>
          <p className="text-xl">
            Prix prédit :{' '}
            <span className="font-bold text-green-600">
              ${prediction.toFixed(2)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
