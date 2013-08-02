var express = require('express'),
  Url = require('url'),
    subdomains = require('express-subdomains'),
	app;

var app = express();

app.use(express.compress());

subdomains.domain('boxee.tv');
subdomains.use('app');
subdomains.use('res');


app.use(function(req, res, next){
  var url = Url.parse(req.url)
  req.url = url.pathname;
  console.log('perso middleware :',req.url);
  next();
});
app.use(subdomains.middleware);


app.get('/app/api/login',function(req, res, next){
  console.log(req.url);
  console.log(req.headers);
  console.log(req.query);
  console.log(req.body);
  console.log(req.files);
  res.setHeader('Content-Type', 'application/xml');
  res.send('<?xml version="1.0" encoding="UTF-8" ?><object type="user" id="jiraiya972"><name>jiraiya972</name><short_name>jiraiya972</short_name><thumb>http://s3.boxee.tv/thumb/200x200/default.png</thumb><thumb_small>http://s3.boxee.tv/thumb/78x78/default.png</thumb_small><user_id>jiraiya972</user_id><user_display_name>jiraiya972</user_display_name><user_first_name></user_first_name><user_last_name></user_last_name><country>FR</country><show_movie_library>1</show_movie_library></object>');
});

app.get('/app/location/detect',function(req, res, next){
  console.log(req.url);
  console.log(req.headers);
  console.log(req.query);
  console.log(req.body);
  console.log(req.files);
  res.setHeader('Content-Type', 'application/json');
  res.send('{"country_code":"FR","country_name":"France","city":"Argenteuil","postal_code":"","state_code":null,"temp_unit":"C","clock_12_24":"24"}');
});

app.get('/res/titles/genres',function(req, res, next){
  console.log(req.url);
  console.log(req.headers);
  console.log(req.query);
  console.log(req.body);
  console.log(req.files);
  res.setHeader('Content-Type', 'application/xml');
  res.send('<?xml version="1.0" encoding="UTF-8" ?><genres><genre id="ACTION">Action</genre><genre id="ADVENTURE">Adventure</genre><genre id="ANIMATION">Animation</genre><genre id="BIOGRAPHY">Biography</genre><genre id="COMEDY">Comedy</genre><genre id="CRIME">Crime</genre><genre id="DOCUMENTARY">Documentary</genre><genre id="DRAMA">Drama</genre><genre id="FAMILY">Family</genre><genre id="FANTASY">Fantasy</genre><genre id="GAME_SHOW">Game Show</genre><genre id="HISTORY">History</genre><genre id="HORROR">Horror</genre><genre id="MUSIC">Music</genre><genre id="MUSICAL">Musical</genre><genre id="MYSTERY">Mystery</genre><genre id="NEWS">News</genre><genre id="REALITY_TV">Reality-TV</genre><genre id="ROMANCE">Romance</genre><genre id="SCI_FI">Sci-Fi</genre><genre id="SHORT">Short</genre><genre id="SPORT">Sport</genre><genre id="TALK_SHOW">Talk-Show</genre><genre id="THRILLER">Thriller</genre><genre id="WAR">War</genre><genre id="WESTERN">Western</genre></genres>');
});

app.listen(9001);
console.log('Server remplacement run on port : 9001');
