import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
  UserID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Username: DataTypes.STRING,
  Email: DataTypes.STRING,
  PasswordHash: DataTypes.STRING,
  PasswordSalt: DataTypes.STRING,
  ContactNumber: DataTypes.STRING,
}, {
  tableName: 'Users'
});

const Restaurant = sequelize.define('Restaurant', {
  RestaurantID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Name: DataTypes.STRING,
  Address: DataTypes.STRING,
  OwnerUserID: { type: DataTypes.INTEGER, references: { model: 'User', key: 'UserID' } },
  PhoneNumber: DataTypes.STRING,
  Email: DataTypes.STRING,
  CoverPhoto: DataTypes.STRING,
  ProfilePhoto: DataTypes.STRING,
  OpeningTime: DataTypes.TIME,
  ClosingTime: DataTypes.TIME,
}, {
  tableName: 'Restaurants'
});

const Table = sequelize.define('Table', {
  TableID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  RestaurantID: { type: DataTypes.INTEGER, references: { model: 'Restaurant', key: 'RestaurantID' } },
  CapacityMin: DataTypes.INTEGER,
  CapacityMax: DataTypes.INTEGER,
  Quantity: DataTypes.INTEGER,
}, {
  tableName: 'Tables'
});

const Reservation = sequelize.define('Reservation', {
  ReservationID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  UserID: { type: DataTypes.INTEGER, references: { model: 'User', key: 'UserID' } },
  RestaurantID: { type: DataTypes.INTEGER, references: { model: 'Restaurant', key: 'RestaurantID' } },
  TableID: { type: DataTypes.INTEGER, references: { model: 'Table', key: 'TableID' } },
  ReservationTime: DataTypes.DATE,
  Duration: DataTypes.INTEGER,
  NumberOfPeople: DataTypes.INTEGER,
  SpecialRequests: DataTypes.STRING,
  Status: DataTypes.STRING,
}, {
  tableName: 'Reservations'
});

User.hasMany(Restaurant, { foreignKey: 'OwnerUserID' });
Restaurant.belongsTo(User, { foreignKey: 'OwnerUserID' });

Restaurant.hasMany(Table, { foreignKey: 'RestaurantID' });
Table.belongsTo(Restaurant, { foreignKey: 'RestaurantID' });

User.hasMany(Reservation, { foreignKey: 'UserID' });
Reservation.belongsTo(User, { foreignKey: 'UserID' });

Restaurant.hasMany(Reservation, { foreignKey: 'RestaurantID' });
Reservation.belongsTo(Restaurant, { foreignKey: 'RestaurantID' });

Table.hasMany(Reservation, { foreignKey: 'TableID' });
Reservation.belongsTo(Table, { foreignKey: 'TableID' });

// User CRUD operations
User.createItem = async (item) => {
  try {
    const salt = await bcrypt.genSalt(10);
    item.PasswordHash = await bcrypt.hash(item.PasswordHash, salt);
    return await User.create(item);
  } catch (error) {
    throw error;
  }
};

User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

User.readItem = async (id) => {
  try {
    if (isNaN(id)) {
      return "id must be a number";
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return "user not found";
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

User.updateItem = async (id, item) => {
  try {
    if (isNaN(id)) {
      throw new Error("id must be a number");
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
      throw new Error("user not found");
    }
    
    return await User.update(item, { where: { UserID: id } });
  } catch (error) {
    throw error;
  }
};

User.deleteItem = async (id) => {
  try {
    if (isNaN(id)) {
      throw new Error("id must be a number");
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
      throw new Error("user not found");
    }
    
    return await User.destroy({ where: { UserID: id } });
  } catch (error) {
    throw error;
  }
};

// Restaurant CRUD operations
Restaurant.createItem = async (item) => {
  try {
    return await Restaurant.create(item);
  } catch (error) {
    throw error;
  }
};

Restaurant.readItem = async (id) => {
  try {
    if (isNaN(id)) {
      throw new Error("id must be a number");
    }
    
    const restaurant = await Restaurant.findByPk(id);
    
    if (!restaurant) {
      throw new Error("restaurant not found");
    }
    
    return restaurant;
  } catch (error) {
    throw error;
  }
};

Restaurant.updateItem = async (id, item) => {
  try {
    if (isNaN(id)) {
      throw new Error("id must be a number");
    }
    
    const restaurant = await Restaurant.findByPk(id);
    
    if (!restaurant) {
      throw new Error("restaurant not found");
    }
    
    return await Restaurant.update(item, { where: { RestaurantID: id } });
  } catch (error) {
    throw error;
  }
};

Restaurant.deleteItem = async (id) => {
  try {
    if (isNaN(id)) {
      throw new Error("id must be a number");
    }
    
    const restaurant = await Restaurant.findByPk(id);
    
    if (!restaurant) {
      throw new Error("restaurant not found");
    }
    
    return await Restaurant.destroy({ where: { RestaurantID: id } });
  } catch (error) {
    throw error;
  }
};


// Table CRUD operations
Table.createItem = async (item) => {
  try {
    return await Table.create(item);
  } catch (error) {
    throw error;
  }
};

Table.readItem = async (id) => {
  try {
    if (isNaN(id)) {
      throw new Error("id must be a number");
    }
    
    const table = await Table.findByPk(id);
    
    if (!table) {
      throw new Error("table not found");
    }
    
    return table;
  } catch (error) {
    throw error;
  }
};

Table.updateItem = async (id, item) => {
  try {
    if (isNaN(id)) {
      throw new Error("id must be a number");
    }
    
    const table = await Table.findByPk(id);
    
    if (!table) {
      throw new Error("table not found");
    }
    
    return await Table.update(item, { where: { TableID: id } });
  } catch (error) {
    throw error;
  }
};

Table.deleteItem = async (id) => {
  try {
    if (isNaN(id)) {
      throw new Error("id must be a number");
    }
    
    const table = await Table.findByPk(id);
    
    if (!table) {
      throw new Error("table not found");
    }
    
    return await Table.destroy({ where: { TableID: id } });
  } catch (error) {
    throw error;
  }
};

// Reservation CRUD operations
Reservation.createItem = async (item) => {
  try {
    return await Reservation.create(item);
  } catch (error) {
    throw error;
  }
};

Reservation.readItem = async (id) => {
  try {
    if (isNaN(id)) {
      throw new Error("id must be a number");
    }
    
    const reservation = await Reservation.findByPk(id);
    
    if (!reservation) {
      throw new Error("reservation not found");
    }
    
    return reservation;
  } catch (error) {
    throw error;
  }
};

Reservation.updateItem = async (id, item) => {
  try {
    if (isNaN(id)) {
      throw new Error("id must be a number");
    }
    
    const reservation = await Reservation.findByPk(id);
    
    if (!reservation) {
      throw new Error("reservation not found");
    }
    
    return await Reservation.update(item, { where: { ReservationID: id } });
  } catch (error) {
    throw error;
  }
};

Reservation.deleteItem = async (id) => {
  try {
    if (isNaN(id)) {
      throw new Error("id must be a number");
    }
    
    const reservation = await Reservation.findByPk(id);
    
    if (!reservation) {
      throw new Error("reservation not found");
    }
    
    return await Reservation.destroy({ where: { ReservationID: id } });
  } catch (error) {
    throw error;
  }
};

// List operations

Restaurant.prototype.getReservations = async function(tableIds, startDate, endDate) {
  try {
    return await Reservation.findAll({
      where: {
        RestaurantID: this.RestaurantID,
        TableID: tableIds,
        ReservationTime: {
          [DataTypes.Op.between]: [startDate, endDate]
        }
      }
    });
  } catch (error) {
    throw error;
  }
};

Restaurant.prototype.getTables = async function(startDate, endDate) {
  try {
    return await Table.findAll({
      where: {
        RestaurantID: this.RestaurantID,
      },
      include: [{
        model: Reservation,
        where: {
          ReservationTime: {
            [DataTypes.Op.between]: [startDate, endDate]
          }
        },
        required: false
      }]
    });
  } catch (error) {
    throw error;
  }
};



export { User, Restaurant, Table, Reservation };