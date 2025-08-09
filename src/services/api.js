// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('accessToken');
  }

  // Helper method pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token d'authentification si disponible
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Si le token a expiré, rediriger vers login
      if (response.status === 401 && data.message?.includes('expired')) {
        this.logout();
        window.location.href = '/login';
        throw new Error('Session expirée');
      }

      return {
        success: response.ok,
        status: response.status,
        data: data,
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Méthodes d'authentification
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data.success) {
      // Sauvegarder les tokens
      this.setTokens(response.data.data.accessToken, response.data.data.refreshToken);
      return response.data;
    }

    throw new Error(response.data.message || 'Erreur de connexion');
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data.success) {
      this.setTokens(response.data.data.accessToken, response.data.data.refreshToken);
      return response.data;
    }

    throw new Error(response.data.message || 'Erreur d\'inscription');
  }

  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  async getProfile() {
    const response = await this.request('/auth/profile');
    
    if (response.success && response.data.success) {
      return response.data.data.user;
    }

    throw new Error(response.data.message || 'Erreur de récupération du profil');
  }

  async updateProfile(userData) {
    const response = await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data.success) {
      return response.data.data.user;
    }

    throw new Error(response.data.message || 'Erreur de mise à jour');
  }

  async changePassword(currentPassword, newPassword) {
    const response = await this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword,
        password: newPassword,
        confirmPassword: newPassword,
      }),
    });

    if (response.success && response.data.success) {
      return response.data;
    }

    throw new Error(response.data.message || 'Erreur de changement de mot de passe');
  }

  // Méthodes pour les habilitations
  async getHabilitations(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/habilitations${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await this.request(endpoint);
    
    if (response.success && response.data.success) {
      return response.data.data || response.data;
    }

    throw new Error(response.data.message || 'Erreur de récupération des habilitations');
  }

  async createHabilitation(habilitationData) {
    const response = await this.request('/habilitations', {
      method: 'POST',
      body: JSON.stringify(habilitationData),
    });

    if (response.success && response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Erreur de création');
  }

  // Méthodes pour les utilisateurs
  async getUsers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/users${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await this.request(endpoint);
    
    if (response.success && response.data.success) {
      return response.data.data || response.data;
    }

    throw new Error(response.data.message || 'Erreur de récupération des utilisateurs');
  }

  // Méthodes pour les permissions
  async getPermissions() {
    const response = await this.request('/permissions');
    
    if (response.success && response.data.success) {
      return response.data.data || response.data;
    }

    throw new Error(response.data.message || 'Erreur de récupération des permissions');
  }

  // Méthodes pour les logs d'activité
  async getActivityLogs(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/activity${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await this.request(endpoint);
    
    if (response.success && response.data.success) {
      return response.data.data || response.data;
    }

    throw new Error(response.data.message || 'Erreur de récupération des logs');
  }

  // Gestion des tokens
  setTokens(accessToken, refreshToken) {
    this.token = accessToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('isAuthenticated', 'true');
  }

  clearTokens() {
    this.token = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!this.token && localStorage.getItem('isAuthenticated') === 'true';
  }

  // Refresh token (optionnel pour plus tard)
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.request('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });

      if (response.success && response.data.success) {
        this.setTokens(response.data.data.accessToken, refreshToken);
        return response.data.data.accessToken;
      }

      throw new Error('Failed to refresh token');
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }
}

// Exporter une instance unique
const apiService = new ApiService();
export default apiService;