// api/check-users.js
import { executeQuery } from './src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const checkUsers = async () => {
    console.log('🔍 Vérification des utilisateurs en base de données\n');
    
    try {
        // Lister tous les utilisateurs
        const users = await executeQuery(`
            SELECT id, email, first_name, last_name, role, employee_id, is_active 
            FROM users 
            ORDER BY id
        `);
        
        console.log('📋 Tous les utilisateurs:');
        console.table(users);
        
        // Vérifier spécifiquement admin et manager
        console.log('\n🔍 Détails des comptes de test:');
        
        const adminUser = await executeQuery(`
            SELECT * FROM users WHERE email = 'admin@company.com'
        `);
        console.log('\n👑 Admin:', adminUser[0] || 'NON TROUVÉ');
        
        const managerUser = await executeQuery(`
            SELECT * FROM users WHERE email = 'manager@company.com'
        `);
        console.log('\n👔 Manager:', managerUser[0] || 'NON TROUVÉ');
        
        // Vérifier s'il y a des doublons
        const duplicateEmails = await executeQuery(`
            SELECT email, COUNT(*) as count 
            FROM users 
            GROUP BY email 
            HAVING COUNT(*) > 1
        `);
        
        if (duplicateEmails.length > 0) {
            console.log('\n⚠️ EMAILS DUPLIQUÉS TROUVÉS:');
            console.table(duplicateEmails);
        } else {
            console.log('\n✅ Aucun email dupliqué');
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
};

checkUsers();