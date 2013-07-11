### The future of Sequelize

<img src="http://farm3.staticflickr.com/2740/4356185807_511c7c9106.jpg" alt="Time paradox" data-author="Stéfan" data-page="http://www.flickr.com/photos/st3f4n/4356185807/" data-source="flickr">

Since some weeks `v2.0.0` of the library is available. Its important to know that this release isn't actively developed but the sum of all the changes of the yet to be developed upcoming versions `v1.7.0`, `v1.8.0` and probably some further ones. Also all the backwards compatibility breaking changes are part of `v2.0.0`.

This post will explain the plans for upcoming releases and already implemented and released BC breaking changes in the latest version.

#### Upcoming releases

When you take a look at the [roadmap](https://github.com/sequelize/sequelize#roadmap), you'll see that there are plans for upcoming minor releases of the `1.x.x` branch. Those milestones are meant to complete functionality of the current code base. However, we have noticed in the last weeks, that there are critical issues that need to be fixed, but which are breaking the backwards compatibility of the project, such as asynchronous validations. Because of that, all the BC breaking changes will be part of the `2.0.0` alpha versions.

#### Current state of the 1.7.0 alpha version (1.7.0-alpha2)

Here is a list of features that are available in the current version of `1.7.0`:

##### [DEPENDENCIES] Upgraded validator for IPv6 support

The [validator](https://github.com/chriso/node-validator) plugin has been updated to `1.1.1`. Part of the new version is the possibility to check for proper IPv6 addresses. You can use it like this:

```js
Sequelize.define('model', {
  ip: {
    type:     Sequelize.STRING,
    validate: {
      isIPv6: true
    }
  }
})
```

##### [DEPENDENCIES] replaced underscore by lodash

In order to improve performance of the library, we replaced [underscore.js](http://underscorejs.org/) with the faster drop-in-replacement [lodash](http://lodash.com/). You can access it via the already existing way `Sequelize.Utils._`.

##### [FEATURE] Validate a model before it gets saved. [#601](https://github.com/sequelize/sequelize/pull/601)

Many people requested, that the model needs to be validated before it gets saved. This is now the case. So whenever the `save` method gets called on an object, the model is validated and the `error` callback is triggered if the model isn't valid:

```js
  sequelize.define('user', {
    username: {
      type:     Sequelize.STRING,
      validate: {
        notEmpty: true,
        notNull:  true
      }
    }
  }).create({
    username: ''
  }).error(function(errors) {
    console.log(errors) // { username: [ 'String is empty' ] }
  })
```

##### [FEATURE] Schematics

It is now possible to create schemas for postgres respectively to prefix table names for sqlite and mysql. That means that you can now define tables in different scopes:

```js
var User   = sequelize.define('user', { username: Sequelize.STRING })
  , wpUser = User.schema('wordpress', '_')

sequelize.createSchema('wordpress').success(function() {
  sequelize.sync().success(function() {
    // Sequelize will now create the following tables: `wordpress_users`
  })
})
```

##### [FEATURE] Foreign key constraints

It is now possible to define foreign keys to connect tables / models with each other. Also we can now define what should happen to the associated objects after a `delete` operation, etc. This is the way to do it:

```js
var Author = sequelize.define('author', { first_name: Sequelize.STRING })
var Post   = sequelize.define('post', {
  title:    Sequelize.STRING,
  authorId: {
    type:          Sequelize.INTEGER,
    references:    Author,
    referencesKey: "id"
  }
})

Author.hasMany(Post)
Post.belongsTo(Author)
```

##### [FEATURE] Support for bulk insert (`<DAOFactory>.bulkCreate()`, update (`<DAOFactory>.update()`) and delete (`<DAOFactor
##### [FEATURE] Add an extra `queryOptions` parameter to `DAOFactory.find` and `DAOFactory.findAll`. This allows a user to spe
##### [FEATURE] Added convenient data types. [#616](https://github.com/sequelize/sequelize/pull/616). Thanks to Costent
##### [FEATURE] Binary is more verbose now. [#612](https://github.com/sequelize/sequelize/pull/612). Thanks to terraflubb
##### [FEATURE] Promises/A support. [#626](https://github.com/sequelize/sequelize/pull/626). Thanks to kevinbeaty
##### [FEATURE] Added Getters/Setters method for DAO. [#538](https://github.com/sequelize/sequelize/pull/538). Thanks to iamjo
##### [FEATURE] Added model wide validations. [#640](https://github.com/sequelize/sequelize/pull/640). Thanks to tremby

##### Bug-Fixes

* [BUG] Fix string escape with postgresql on raw SQL queries. [#586](https://github.com/sequelize/sequelize/pull/586)
* [BUG] "order by" is now after "group by". [#585](https://github.com/sequelize/sequelize/pull/585)
* [BUG] Added decimal support for min/max. [#583](https://github.com/sequelize/sequelize/pull/583)
* [BUG] Null dates don't break SQLite anymore. [#572](https://github.com/sequelize/sequelize/pull/572)
* [BUG] Correctly handle booleans in MySQL. [#608](https://github.com/sequelize/sequelize/pull/608)
* [BUG] Fixed empty where conditions in MySQL. [#619](https://github.com/sequelize/sequelize/pull/619)
* [BUG] Allow overriding of default columns. [#635](https://github.com/sequelize/sequelize/pull/635)

#### Upcoming features of 1.8.0

