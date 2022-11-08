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
    playing: {
        type: DataTypes.BOOLEAN,
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

/**
 * Modello che rappresenta la tabella delle partite nel database (tramite ORM).
 */
export const Game = connection.define('game', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    player1: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    player2: {
        type: DataTypes.STRING(30)
    },
    player3: {
        type: DataTypes.STRING(30)
    },
    ia: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    grid1: {
        type: DataTypes.STRING(65535),
        allowNull: false
    },
    grid2: {
        type: DataTypes.STRING(65535)
    },
    grid3: {
        type: DataTypes.STRING(65535)
    },
    gridIA: {
        type: DataTypes.STRING(65535)
    },
    attaccante: {
        type: DataTypes.STRING(30)
    },
    difensore: {
        type: DataTypes.STRING(30)
    },
    in_progress: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    vincitore: {
        type: DataTypes.STRING(30)
    },
    perdente1: {
        type: DataTypes.STRING(30)
    },
    perdente2: {
        type: DataTypes.STRING(30)
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY
    }
},
{
    modelName: 'game', 
    timestamps: false,
    freezeTableName: true
});