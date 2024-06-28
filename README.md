# Vlodia

This module provides simple database functionality for storing data in JSON format.

## Installation

You can install the module via npm or yarn:

```bash
npm install vlodia
yarn add vlodia
```

## Usage
```javascript

const { Database } = require('vlodia-database');

// Create a new Database instance (default file name: vlodiadb.json)
const db = new Database();


db.set('key', 'value'); // Writing data
db.get('key'); // Getting data
db.add('counter', 5); // Adding data
db.subtract('counter', 2); // Subtracting from data
db.push('list', 'new-item'); // Pushing the data
db.pull('list', 'item-to-remove'); // Pulling an element from array
db.delete('key'); // Deleting data
db.has('key'); // Checking if a key exist
db.all(); // Getting all data
db.clear(); // Clearing the database
```

## Error handling
* The module provides basic error handling for invalid keys or values.

## License
* This project is licensed under the Apache-2.0 License - see the LICENSE file for details.
