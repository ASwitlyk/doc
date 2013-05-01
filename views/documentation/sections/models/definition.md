### Definition

To define mappings between a model and a table, use the `define` method. Sequelize will then automatically add the attributes `createdAt` and `updatedAt` to it. So you will be able to know when the database entry went into the db and when it was updated the last time.

```js
var Project = sequelize.define('Project', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT
})

var Task = sequelize.define('Task', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  deadline: Sequelize.DATE
})
```

You can also set some options:

```js
var Foo = sequelize.define('Foo', {
  // instantiating will automatically set the flag to true if not set
  flag: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},

  // default values for dates => current time
  myDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },

  // setting no title will throw an error when trying to save
  title: { type: Sequelize.STRING, allowNull: false},

  // Creating two objects with the same value will throw an error. Currently composite unique
  // keys can only be created 'addIndex' from the migration-section below

  someUnique: {type: Sequelize.STRING, unique: true},
  // Go on reading for further information about primary keys

  identifier: { type: Sequelize.STRING, primaryKey: true},
  // autoIncrement can be used to create auto_incrementing integer columns

  incrementMe: { type: Sequelize.INTEGER, autoIncrement: true }
})
```
