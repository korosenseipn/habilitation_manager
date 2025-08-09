// src/pages/login/components/LoginForm.jsx (avec logs détaillés)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../services/api';

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: 'admin@company.com',
    password: 'Admin@123'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔄 === DÉBUT LOGIN FRONTEND ===');
    console.log('🔄 Email saisi:', formData.email);
    console.log('🔄 Password saisi:', formData.password ? '***' : 'vide');

    try {
      // Nettoyer le localStorage avant login
      console.log('🧹 Nettoyage localStorage...');
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isAuthenticated');

      console.log('📡 Appel API login...');
      const response = await apiService.login(formData.email, formData.password);
      
      console.log('📡 === RÉPONSE API COMPLÈTE ===');
      console.log('📡 Response success:', response.success);
      console.log('📡 Response message:', response.message);
      console.log('📡 Response data:', response.data);
      
      if (response.data && response.data.user) {
        console.log('👤 === DONNÉES UTILISATEUR REÇUES ===');
        console.log('👤 User ID:', response.data.user.id);
        console.log('👤 User Email:', response.data.user.email);
        console.log('👤 User First Name:', response.data.user.first_name);
        console.log('👤 User Last Name:', response.data.user.last_name);
        console.log('👤 User Role:', response.data.user.role);
        console.log('👤 User Employee ID:', response.data.user.employee_id);
      }
      
      if (response.success) {
        console.log('✅ Connexion réussie côté API');
        
        // Sauvegarder les informations
        const userData = response.data.user;
        console.log('💾 Sauvegarde en localStorage...');
        console.log('💾 Données à sauvegarder:', userData);
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Vérifier ce qui a été sauvé
        const savedUser = localStorage.getItem('user');
        console.log('🔍 Données sauvées en localStorage:', savedUser);
        console.log('🔍 Données parsées:', JSON.parse(savedUser));
        
        console.log('🔄 Redirection vers /dashboard...');
        navigate('/dashboard');
      } else {
        console.log('❌ Échec de connexion:', response.message);
        setError(response.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('💥 Erreur complète:', error);
      setError(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('🔄 === FIN LOGIN FRONTEND ===\n');
    }
  };

  return (
    <div className="mt-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Connexion</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Connectez-vous à votre compte Habilitations Manager
        </p>
      </div>

      {/* Affichage debug */}
      <div style={{ 
        padding: '10px', 
        marginBottom: '10px', 
        backgroundColor: '#f0f0f0', 
        fontSize: '12px',
        borderRadius: '4px'
      }}>
        <strong>🔧 Debug Frontend:</strong><br/>
        Email: {formData.email}<br/>
        Password: {formData.password ? '***' : 'vide'}<br/>
        LocalStorage user: {localStorage.getItem('user') ? 'EXISTS' : 'EMPTY'}
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@company.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Admin@123"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connexion...</span>
            </div>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>

      {/* Boutons de test avec nettoyage */}
      <div className="mt-4 p-3 bg-gray-100 rounded-md">
        <p className="text-xs text-gray-600 mb-2">🧪 Tests rapides:</p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              setFormData({ email: 'admin@company.com', password: 'Admin@123' });
            }}
            className="w-full text-xs bg-green-500 text-white py-1 px-2 rounded"
          >
            👑 Remplir Admin + Clear Cache
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              setFormData({ email: 'manager@company.com', password: 'Manager@123' });
            }}
            className="w-full text-xs bg-blue-500 text-white py-1 px-2 rounded"
          >
            👔 Remplir Manager + Clear Cache
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              console.log('🧹 LocalStorage cleared manually');
            }}
            className="w-full text-xs bg-red-500 text-white py-1 px-2 rounded"
          >
            🧹 Clear LocalStorage seulement
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;