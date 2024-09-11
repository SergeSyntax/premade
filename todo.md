- add swagger to auth service
- add logs to service
- add webpack bundler to each service with ts-loader
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

