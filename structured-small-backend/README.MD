<h1>Simple refactored service</h1>

<h4>Simple service that have 2 routes just to create users and get them all</h4>

<h3>Installation</h3>
<ol>
<li>Clone repo</li>
<li>Open folder with project and perform npm install</li>
<li>Copy and rename .env.example to just .env and please change variables to your setup</li>
<li>Run "npm run build" and after "npm run start"</li>
<li>For developer run "npm run start:dev"</li>
</ol>

<h3>To test queries</h3>

You can use for example Postman. 

Use raw JSON object: 

<h4>Creating user</h4>
POST http://${your-origin}/users

{
"userName": "Test",
"email": "test@mail.com",
"age": 58
}

<h4>Receiving the list of users</h4>

GET http://${your-origin}/users


<h3>HAPPY TESTING!</h3>

