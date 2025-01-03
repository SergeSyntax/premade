### logic

- remove reserve media for donation logic doesn't make much sense
- hmm donation might consider rename back to order (do we lock videos until payed?)
- add swagger to each route
- refactor tsc check webpack state for latest ts check twc transpiler
- add logs to service on each service debug logs

- the current implantation of media upload is bad, change:
  - we update a video create redis row with the meta data, upload a file
  - minio rabbitmq hook option after the file is uploaded we invoke the hook
  - the rabbitmq listener create the media record if fail clears the redis row
  - rotation file upload row clear (check if there an option to get current uploaded process from minio via rest)

- check jest state with ESM the only issue with the current esm solution
  - consider rolling back to commonJS setup or replace jest wtih vitest
    - jest doesn't support `jest.mock()` with esm modules that a problem.




- we skipped transactions DB the idea is instead of publishing directly from the service we save with a transaction for example the media and the even
and then some bulljs redis can handle queueing it into the system 

- refresher on react query
- refresher on tanStack router
- add error message in box under register and login if submit fails

- add bundler to services (api) to reduce image size

feature:
- move auth from assign to here
- Covering OAuth 2.0, OpenID, PKCE, deprecated flows, JWTs, API Gateways, and scopes. No programming knowledge needed
- https://www.udemy.com/course/oauth-2-simplified/learn/lecture/23715946?start=15#overview



- a lot of repeated code at testing refactor extract i.e. message wrapper for listener tests
  - before continuing with ESM check that the mock function is usable.
  - unit / integration test should have separate test for each change and not bundled 100 tests and same it; separate tests
  

- bullmq support cron reapet option, if the payment set to reapeted payment we should consider cron format.
- the initial setup for a video should be 


- create user/image for each service on docker hub
- create github actions for each service, create github actions for tags

- revisit media item preview (S3 stream  tt)
- copy auth logic from assign server


- currently if you miss a env var in production the service might run ether way extract default values to consts folder,
- add validation on startup like what we had before that compare current env var to mock var on prod env:
```ts
const start = async () => {
  if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defined');
  if (!process.env.NATS_URL) throw new Error('NATS_URL must be defined');
  if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defined');

  try {
    /**
     * NATS Connection
     */
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    const stan = natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit(1);
    });
    process.on('SIGINT', () => stan.close());
    process.on('SIGTERM', () => stan.close());
    process.on('SIGUSR2', () => stan.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};
```

- add paypal support if not troublesome with stripe

UI:
 - when submitting an media creation seperate all to mutation for example
  - the get url for upload should be separate hook that show a loading spinner on the image and if fail to get url show internal error
    with the ability to retry.
  - when submitting show the error base on the field or as general server error

  - change submit 2 requests first one submit create media requests create TTL reids entry with the payload, get the ID, streams the video
    when the video on minio add a hook that invoke the DB data creation, show % of file upload allow to go to a diffrent page while uploading the file
    

Auth service:
- create seasons with the ability to list connected users ips and date of login with refresh and access tokens (oidc approach)
- usally in auth you have something like group in video streaming platform is more like channels, need to be added



setup cors should be able to fetch videos only from the origin web client localhost:3000


test