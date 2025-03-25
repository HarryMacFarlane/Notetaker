# NoteTaker

- This project's goal is to help me get better at using node js, as well as useful libraries in its ecosystem.
- For the most part, it is designed to be extremly simple and straight forward to use.
## Set Up
1. Create a .env file and give a suitable secret to sign jwt tokens using the ACCESS_TOKEN_SECRET key.
2. Create a database and populate it with the necessary tables. In my case, these are the tables that I chose to implement:
     - Users(id (int), email (text/string), password_hash (text/string), created_at (int, UNIX time))
     - Sessions (id (int), user_id (int, foreign key), refresh_token (text/string), access_token (text/string), created_at (int, UNIX time), last_refresh (int, UNIX time))
     - Documents (TO BE DECIDED)
     - Groups (TO BE DECIDED)
3. The storage.js file in server/src/Storage will either automatically create a database in that directory (by default, its name will be notetaker_dev.db), so overide it as needed.
4. Currently, I am using the common CDN to give the client acccess to the htmx library. However, this is obvious less than ideal in production, so change it to be locally hosted if necessary.
## Overview
- Provides user authentication using a simple html form and ajax requests executed using htmx. Refresh tokens are stored in strict same site cookies to allow automatic sign-in with valid token
- Utilizes websockets using socket.io in order to seemlessly allow multple users to modify the same document with some delay (to be decided, but probably 5-10s delay)
- Users can create groups to give users access to either modify or see the live modifications of the document.
- The backend utilizes a synchronous sqlite3 database, however it should be relatively simple to implement a POSTGRESQL server instead.

## Timeline
-> Here I will outline a timeline for updating and improving the application until it is relatively complete.
1. Implement the Authentication Page
2. Implement the Home Page
3. Review progress, start creating the tables necessary for the future pages, implement a test suite, etc.
4. Implement the Group Page
5. Implement the Note Page (w/o websockets)
6. Implement websockets for the note page
7. Implement multple users for multiple socket connections as necessary
8. (OPTIONAL) Build a full test suite
9. (OPTIONAL) Implement a POSTGRESQL server, and build out a very simple API (modifying the dbRunner class in storage.js)
10. (OPTIONAL) Build a docker and kubernetes infrastructure for many sockets in the future.
