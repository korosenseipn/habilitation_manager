// api/reset-admin-password.js
import bcrypt from 'bcryptjs';
import { executeQuery } from './src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const resetAdminPassword = async () => {
    console.log('🔧 Réinitialisation du mot de passe admin...\n');
    
    try {
        // Nouveau mot de passe
        const newPassword = 'Admin@123';
        
        // Hasher le mot de passe
        console.log('🔐 Hachage du mot de passe...');
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        console.log('🔐 Nouveau hash:', hashedPassword);
        
        // Mettre à jour en base
        console.log('💾 Mise à jour en base de données...');
        const result = await executeQuery(`
            UPDATE users 
            SET password = ? 
            WHERE email = 'admin@company.com'
        `, [hashedPassword]);
        
        console.log('✅ Résultat:', result);
        
        if (result.affectedRows > 0) {
            console.log('🎉 Mot de passe admin réinitialisé avec succès !');
            console.log('📧 Email: admin@company.com');
            console.log('🔑 Mot de passe: Admin@123');
        } else {
            console.log('❌ Aucun utilisateur mis à jour. Vérifiez que admin@company.com existe.');
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
};

resetAdminPassword();