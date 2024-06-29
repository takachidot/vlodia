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
### HttpClient

```javascript
const { HttpClient } = require('vlodia').default;

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



## License
* This project is licensed under the Apache-2.0 License - see the LICENSE file for details.
