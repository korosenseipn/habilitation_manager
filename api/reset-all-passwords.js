// api/reset-all-passwords.js
import bcrypt from 'bcryptjs';
import { executeQuery } from './src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const resetAllPasswords = async () => {
    console.log('🔧 Réinitialisation de tous les mots de passe...\n');
    
    const users = [
        { email: 'admin@company.com', password: 'Admin@123', role: 'Admin' },
        { email: 'manager@company.com', password: 'Manager@123', role: 'Manager' }
    ];
    
    try {
        for (const user of users) {
            console.log(`🔐 Traitement de ${user.role}: ${user.email}`);
            
            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(user.password, 12);
            
            // Mettre à jour en base
            const result = await executeQuery(`
                UPDATE users 
                SET password = ? 
                WHERE email = ?
            `, [hashedPassword, user.email]);
            
            if (result.affectedRows > 0) {
                console.log(`✅ ${user.role} mis à jour: ${user.email} / ${user.password}`);
            } else {
                console.log(`❌ ${user.role} non trouvé: ${user.email}`);
            }
        }
        
        console.log('\n🎉 Tous les mots de passe ont été réinitialisés !');
        console.log('\n📋 Comptes disponibles:');
        console.log('👑 Admin: admin@company.com / Admin@123');
        console.log('👔 Manager: manager@company.com / Manager@123');
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
};

resetAllPasswords();