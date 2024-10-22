// DO NOT MAKE CHANGES TO THIS FILE
const db = require('../../data/dbConfig.js');
const mappers = require('../../data/helpers/mappers');

module.exports = {
  get,
  insert,
  update,
  remove,
};

// Resolves to an array of all the resources contained in the database. If you pass an id to this 
//  method it will return the resource with that id if one is found.
function get(id) {
  let query = db('actions');

  if (id) {
    return query
      .where('id', id)
      .first()
      .then((action) => {
        if (action) {
          return mappers.actionToBody(action);
        } else {
          return null;
        }
      });
  } else {
    return query.then((actions) => {
      return actions.map((action) => mappers.actionToBody(action));
    });
  }
}

// Calling insert passing it a resource object will add it to the database and return the newly 
//  created resource.
function insert(action) {
  return db('actions')
    .insert(action)
    .then(([id]) => get(id));
}

// Accepts two arguments, the first is the id of the resource to update, and the second is an 
//  object with the changes to apply. It returns the updated resource. If a resource with the 
//  provided id is not found, the method returns null.
function update(id, changes) {
  return db('actions')
    .where('id', id)
    .update(changes)
    .then((count) => (count > 0 ? get(id) : null));
}

// The remove method accepts an id as its first parameter and, upon successfully deleting the 
//  resource from the database, returns the number of records deleted.
function remove(id) {
  return db('actions').where('id', id).del();
}
