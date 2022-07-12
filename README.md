# Works API

💫 Welcome! 🎉

Node.js/Express.js app REST API.

## Data Models

> **All models are defined in src/model.js**

### Profile
A profile can be either a `client` or a `contractor`. 
clients create contracts with contractors. Contractor does jobs for clients and get paid.
Each profile has a `balance` property.

### Contract
A contract is between and client and a contractor.
Contracts have 3 statuses, `new`, `in_progress`, `terminated`. Contracts are considered active only when in status `in_progress`.
Contracts group jobs within them.

### Job
Contractor get paid for jobs by clients under a certain contract.

## Getting Set Up

It requires [Node.js](https://nodejs.org/en/) to be installed. We recommend using the LTS version.

1. In the repo root directory, run `npm install` to gather all dependencies.

1. Next, `npm run seed` will seed the local SQLite database. **Warning: This will drop the database if it exists**. The database lives in a local file `database.sqlite3`.

1. Then run `npm start` which should start the server.

## Technical Notes

- The database provider is SQLite, which will store data in a file local to your repository called `database.sqlite3`. The ORM [Sequelize](http://docs.sequelizejs.com/) is on top of it.

- To authenticate users the `getProfile` middleware is used that is located under `src/middleware/getProfile.js`. Users are authenticated by passing `profile_id` in the request header. After a user is authenticated his profile will be available under `req.profile`. Users that are on the contract can access their contracts.

- The server is running on port 3001.

## APIs

Below is a list of the API's.

1. ***GET*** `/contracts/:id` - Returns the contract only if it belongs to the profile calling.

1. ***GET*** `/contracts` - Returns a list of non terminated contracts belonging to a user (client or contractor).

1. ***GET*** `/jobs/unpaid` -  Get all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.

1. ***POST*** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount is moved from the client's balance to the contractor balance.

1. ***POST*** `/balances/deposit/:userId` - Deposits money into the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

1. ***GET*** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

1. ***GET*** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - Returns the clients that paid the most for jobs in the query time period. `limit` query parameter should be applied, default limit is 2.
```
 [
    {
        "id": 1,
        "fullName": "Reece Moyer",
        "paid" : 100.3
    },
    {
        "id": 200,
        "fullName": "Debora Martin",
        "paid" : 99
    },
    {
        "id": 22,
        "fullName": "Debora Martin",
        "paid" : 21
    }
]
```

## Tests

### Unit Tests

- `src/modules/balances/balancesBusiness.unit.js`
- `src/modules/jobs/jobsBusiness.unit.js`

Run them with `npm run test-unit` 

### Integration Tests

- `src/modules/balances/DepositController.int.js`
- `src/modules/contracts/GetByIdController.int.js`
- `src/modules/contracts/GetContractsController.int.js`

Run them with `npm run test-int`

> You can also run both unit and integration tests with `npm test`.
