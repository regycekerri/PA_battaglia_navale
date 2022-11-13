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
        type: DataTypes.TEXT,
        allowNull: false
    },
    grid2: {
        type: DataTypes.TEXT
    },
    grid3: {
        type: DataTypes.TEXT
    },
    gridIA: {
        type: DataTypes.TEXT
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

/**
 * Modello che rappresenta la tabella delle mosse nel database (tramite ORM).
 */
 export const Move = connection.define('move', {
    id_game: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    attaccante: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    difensore: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    x: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    y: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    colpita_nave: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
},
{
    modelName: 'move', 
    timestamps: false,
    freezeTableName: true
});