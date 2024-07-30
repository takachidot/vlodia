# Vlodia

A simple database & http request module for your node application's.

## Installation

You can install the module via npm or yarn:

```bash
npm install vlodia
yarn add vlodia
```

## Usage
### Database 
```javascript

const { Database } = require('vlodia');

// Create a new Database instance (default file name: database.json)
const db = new Database();

// Writing data
db.set('key', 'value');

// Getting data
console.log(db.get('key')); // Output: 'value'

// Adding data
console.log(db.add('counter', 5)); // Output: 5

// Subtracting from data
console.log(db.subtract('counter', 2)); // Output: 3

// Pushing an element to an array
console.log(db.push('list', 'new-item')); // Output: ['new-item']

// Pulling an element from an array
console.log(db.pull('list', 'new-item')); // Output: []

// Deleting data
console.log(db.delete('key')); // Output: true

// Checking if a key exists
console.log(db.has('key')); // Output: false

// Getting all data
console.log(db.all()); // Output: {}

// Clearing the database
console.log(db.clear()); // Output: true

// Incrementing a numeric value
console.log(db.increment('counter')); // Output: 1 (if 'counter' didn't exist before)

// Unpushing an element from an array
console.log(db.unpush('list', 'item-to-remove')); // Output: true (if 'item-to-remove' existed in 'list')

// Using findOneAndUpdate
const updatedValue = db.findOneAndUpdate('key', (value) => {
    return value ? value.toUpperCase() : 'DEFAULT';
});
console.log(updatedValue); // Output: 'DEFAULT' (if 'key' didn't exist before)

// Checking if a key exists after operations
console.log(db.has('key')); // Output: true

// New Methods
// Increment a numeric value by a specific amount
console.log(db.increment('counter', 5)); // Output: 6 (if 'counter' was previously 1)

// Find and update a value with options
const updatedValueWithOptions = db.findOneAndUpdate('key', (value) => {
    return value ? value.toLowerCase() : 'default';
}, { write: false });
console.log(updatedValueWithOptions); // Output will depend on current value and options


```
### YamlDatabase 
```javascript

const { YamlDatabase } = require('vlodia');

// Create a new Database instance (default file name: database.yml)
const db = new YamlDatabase();

// Writing data
db.set('key', 'value');

// Getting data
console.log(db.get('key')); // Output: 'value'

// Adding data
console.log(db.add('counter', 5)); // Output: 5

// Subtracting from data
console.log(db.subtract('counter', 2)); // Output: 3

// Pushing an element to an array
console.log(db.push('list', 'new-item')); // Output: ['new-item']

// Pulling an element from an array
console.log(db.pull('list', 'new-item')); // Output: []

// Deleting data
console.log(db.delete('key')); // Output: true

// Checking if a key exists
console.log(db.has('key')); // Output: false

// Getting all data
console.log(db.all()); // Output: {}

// Clearing the database
console.log(db.clear()); // Output: true

// Incrementing a numeric value
console.log(db.increment('counter')); // Output: 1 (if 'counter' didn't exist before)

// Unpushing an element from an array
console.log(db.unpush('list', 'item-to-remove')); // Output: true (if 'item-to-remove' existed in 'list')

// Using findOneAndUpdate
const updatedValue = db.findOneAndUpdate('key', (value) => {
    return value ? value.toUpperCase() : 'DEFAULT';
});
console.log(updatedValue); // Output: 'DEFAULT' (if 'key' didn't exist before)

// Checking if a key exists after operations
console.log(db.has('key')); // Output: true

// New Methods
// Increment a numeric value by a specific amount
console.log(db.increment('counter', 5)); // Output: 6 (if 'counter' was previously 1)

// Find and update a value with options
const updatedValueWithOptions = db.findOneAndUpdate('key', (value) => {
    return value ? value.toLowerCase() : 'default';
}, { write: false });
console.log(updatedValueWithOptions); // Output will depend on current value and options


```

### HttpClient

```javascript
const { HttpClient } = require('vlodia');

const client = new HttpClient();

async function exampleUsage() {
    try {
        // GET request example
        const getResponse = await client.get('https://jsonplaceholder.typicode.com/posts/1');
        console.log('GET Response:', getResponse);

        // POST request example
        const postData = {
            title: 'foo',
            body: 'bar',
            userId: 1,
        };
        const postResponse = await client.post('https://jsonplaceholder.typicode.com/posts', postData);
        console.log('POST Response:', postResponse);

        // PUT request example
        const putData = {
            id: 1,
            title: 'foo',
            body: 'bar',
            userId: 1,
        };
        const putResponse = await client.put('https://jsonplaceholder.typicode.com/posts/1', putData);
        console.log('PUT Response:', putResponse);

        // DELETE request example
        const deleteResponse = await client.delete('https://jsonplaceholder.typicode.com/posts/1');
        console.log('DELETE Response:', deleteResponse);

        // Fetch request example
        const fetchResponse = await client.fetch('https://jsonplaceholder.typicode.com/posts/1');
        console.log('Fetch Response:', fetchResponse);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

exampleUsage();

```

### Notes
* Replace `https://jsonplaceholder.typicode.com/posts/1` with your actual API endpoints.
* Ensure Node.s enviroment with support for `http` and `https` modules.

## API Reference

**`HttpClient` Class**
**`constructor()`**
Creates an instance of **`HttpClient`**.

**`get(path, options)`**

Makes a GET request to the specified **`path`**.

* **`path`**: The URL or path to make the request to.
* **`options`**: Optional additional options for the request.
**`post(path, data, options)`**
Makes a POST request to the specified **`path`**.

* **`path`**: The URL or path to make the request to.
* **`data`**: Data to send in the request body (JSON format).
* **`options`**: Optional additional options for the request.
* **`put`**(path, data, options)
Makes a PUT request to the specified **`path`**.

* **`path`**: The URL or path to make the request to.
* **`data`**: Data to send in the request body (JSON format).
* **`options`**: Optional additional options for the request.
* **`delete(path, options)`**
Makes a DELETE request to the specified **`path`**.

* **`path`**: The URL or path to make the request to.
* **`options`**: Optional additional options for the request.
* **`fetch(input, init)`**
   * Makes a fetch request to the specified input.

   * input: The URL or Request object to make the request to.
   * init: Optional additional options for the request (like method, headers, and body)



## License
* This project is licensed under the Apache-2.0 License - see the LICENSE file for details.
