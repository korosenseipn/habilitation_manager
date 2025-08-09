// api/test-mysql.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    console.log('🔍 Test de connexion MySQL...\n');
    
    console.log('Configuration détectée:');
    console.log('- Host:', process.env.DB_HOST || 'localhost');
    console.log('- Port:', process.env.DB_PORT || '3306');
    console.log('- User:', process.env.DB_USER || 'root');
    console.log('- Password:', process.env.DB_PASSWORD ? '***' : 'VIDE');
    console.log('- Database:', process.env.DB_NAME || 'habilitation_manager');
    console.log();

    try {
        // Test 1: Connexion sans base de données
        console.log('📡 Test 1: Connexion au serveur MySQL...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });
        
        console.log('✅ Connexion au serveur MySQL réussie !');
        
        // Test 2: Lister les bases de données
        console.log('📊 Test 2: Liste des bases de données...');
        const [databases] = await connection.execute('SHOW DATABASES');
        console.log('Bases disponibles:', databases.map(db => db.Database));
        
        // Test 3: Vérifier si notre base existe
        const dbExists = databases.some(db => db.Database === (process.env.DB_NAME || 'habilitation_manager'));
        console.log(`Base "${process.env.DB_NAME || 'habilitation_manager'}" existe:`, dbExists ? '✅' : '❌');
        
        if (!dbExists) {
            console.log('🛠️ Création de la base de données...');
            await connection.execute(`CREATE DATABASE ${process.env.DB_NAME || 'habilitation_manager'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
            console.log('✅ Base de données créée !');
        }
        
        await connection.end();
        console.log('\n🎉 Tous les tests réussis ! Votre configuration MySQL fonctionne.');
        
    } catch (error) {
        console.error('\n❌ Erreur de connexion MySQL:');
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n💡 Solutions suggérées:');
            console.log('1. Vérifiez votre mot de passe MySQL dans le fichier .env');
            console.log('2. Testez manuellement: mysql -u root -p');
            console.log('3. Si vous utilisez XAMPP, le mot de passe est souvent vide');
        }
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Solutions suggérées:');
            console.log('1. Démarrez votre serveur MySQL');
            console.log('2. Si XAMPP: cliquez "Start" pour MySQL');
            console.log('3. Vérifiez que MySQL écoute sur le port 3306');
        }
    }
};

testConnection();