# Marketing Flows API

This project implements a marketing flows API using Express.js. The API allows you to trigger predefined marketing flows
based on specific events. Each flow can consist of multiple actions, such as sending emails or adding delays.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Installation

1. **Clone the repository:**

   `git clone https://github.com/hkunzler/marketing-flows.git`

   `cd marketing-flows`

2. **Install dependencies:**

   `npm install`

3. **Compile TypeScript:**

   `npx tsc`

4. **Start the server:**

   `npm start`

## Usage

The server will start on port 3000. You can use tools like Postman or curl to interact with the API.

### Example Flow Configuration

Flows are defined in the `marketingFlows.ts` file. Each flow consists of a trigger, an email, and a series of actions.
Here's an example:

```javascript
 const marketingFlows: IFlow[] = [
    {
        actions: [
            {
                delay: twoHours,
                id: 'action1',
                type: ActionType.TIME_DELAY,
            },
            {
                email: {
                    body: 'Need some socks?',
                    subject: 'Welcome!'
                },
                id: 'action2',
                type: ActionType.SEND_EMAIL
            }
        ],
        trigger: 'websiteSignup',
        userEmail: 'Amy_Pond@healthtech1.uk'
    },
    {
        ...
    }
]
```

## API Endpoints

### `GET /flow`

- ***Purpose***: To trigger a predefined marketing flow based on a query parameter.
- ***Parameters***:
    - `trigger`: The name of the trigger event.
    - `userEmail`: The email of the user.
- ***Use Case***: Quickly testing or triggering flows via a web browser or simple HTTP client tools like curl.

**Example Request:**

`curl "http://localhost:3000/flow?trigger=websiteSignup&userEmail=user@example.com"`

**Example Response:**

```json
{
  "message": "Flow executed successfully"
}
```

### `POST /flow`

- ***Purpose***: To trigger a marketing flow with the ability to customize the actions.
- ***Parameters (in the request body)***:
  - `trigger`: The name of the trigger event.
  - `userEmail`: The email of the user.
  - `customizations` (optional): An object containing customized actions.
- ***Use Case***: More complex scenarios where you need to send additional data or customize the flow actions, typically used by more advanced clients or applications.


**Example Request:**

```json
{
  "trigger": "websiteSignup",
  "userEmail": "user@example.com",
  "customizations": {
    "actions": [
      {
        "delay": 500,
        "id": "customAction1",
        "type": "delay"
      },
      {
        "email": {
          "body": "The Nights Watch",
          "subject": "King of the North"
        },
        "id": "customAction2",
        "type": "email"
      }
    ]
  }
}
```

**Example Response:**

```json
{
  "message": "Flow executed successfully"
}
```

## Testing

To run the tests, use the following command:

```sh
npm test
```

The tests are located in the `./app.test.ts` file and cover various scenarios for triggering flows and
handling errors.
