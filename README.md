# Guardian Management Client
Client for Guardian Management based on API2

This is an small wrapper arround API2 that help you use the Guardian api.

## API
#### `.configure({ client: { tenant, region, token } }):Client`
Configures the client and returns a configured instance

Example
```
  const client = require('guardian-management-client').configure({
    tenant: 'mytenant',
    region: 'eu' // Valid: eu | us | au,
    token: // AUTH0 API2 TOKEN
  });
```

### Enrollments
#### `client.enrollment.create(enrollmentId, [enrollmentData]):Enrollment`
Creates an instance of an enrollment

Example
```
  const enrollment = client.enrollment.create('dev_1234');
```

##### `enrollment.fetch(): Promise`
Fetchs data of an enrollment

##### `enrollment.attrs(): Object`
Retrieve fetched / modified data

##### `enrollment.changed`
Not yet applied changes

##### `enrollment.data`
Fetched / built data without the changes

##### `enrollment.del(): Promise`
Deletes an enrollment

Example
```
enrollment.fetch()
  .then((enrollment) => {
    const attrs = enrollment.attrs(); // Enrollment attributes (name, id, phone_number, etc)

    return enrollment.del()
  })
  .then(function() {
    // Enrollment has been deleted
  })
```

### Factors
#### `client.factor.create(factorName, [factorData]):Factor`
Creates an instance of a factor

Example
```
  const factor = client.factor.create('sms');
```

#### `client.factor.getAll():Promise.<array.<Factor>>`
Retrieves all factors from server

```
  client.factor.getAll().then((factors) => {
    const factor1 = factors[0];
    const factor2 = factors[1];
    //...
  });
```

##### `factor.enable()`
Marks a factor as enabled, changes won't be applied until you call `.update()`

##### `factor.disable()`
Marks a factor as disabled, changes won't be applied until you call `.update()`

##### `factor.attrs(): Object`
Retrieve fetched / modified data

##### `factor.changed`
Not yet applied changes

##### `factor.data`
Fetched / built data without the changes

##### `factor.update(): Promise`
Apply changes

Example
```
  client.factor.getAll().then((factors) => {
    return factors[0].enable().update();
  })
  .then(() => {
    // Factor has been enabled
  });
```

### Factor Providers
#### `client.factorProvider.create({ factor: string, provider: string }, [factorProviderData]):FactorProvider`
Creates an instance of a factor provider

Example
```
  const factorProvider = client.factor.create({ factor: 'sms', provider: 'twilio' });
```

##### `factorProvider.set({ ... data })`
Modify factor provider data, changes won't be applied until you call `.update()`

##### `factorProvider.attrs(): Object`
Retrieve fetched / modified data

##### `factorProvider.changed`
Not yet applied changes

##### `factorProvider.data`
Fetched / built data without the changes

##### `factorProvider.update(): Promise`
Apply changes

Example
```
  const fp = client.factorProvider.create({ factor: 'sms', provider: 'twilio' });

  fp.set({ sid: '', ... });
  fp.update().then(() => {
    ...
  });
```

### Users
#### `client.user.create({ factor: string, provider: string }, [userData]):User`
Creates an instance of a factor provider

Example
```
  const user = client.user.create('auth0|1234');
```

##### `user.enableMFA()`
Shortcut method, adds `user_metadata.use_mfa = false` to the user. This wont be applied until you call update.

##### `user.disableMFA(): Object`
Shortcut method, adds `user_metadata.use_mfa = true` to the user. This wont be applied until you call update.
