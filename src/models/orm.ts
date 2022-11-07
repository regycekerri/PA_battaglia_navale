import { DataTypes, Sequelize } from 'sequelize';
import { Database } from './database';

/**
 * Instanziazione della connessione verso il database.
 */
const connection: Sequelize = Database.getConnection();

/**
 * Modello che rappresenta la tabella degli utenti nel database (tramite ORM).
 */
export const User = connection.define('user', {
    email: {
        type: DataTypes.STRING(30),
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    token: {
        type: DataTypes.DOUBLE(25,2),
        allowNull: false
    }
},
{
    modelName: 'user', 
    timestamps: false,
    freezeTableName: true
});