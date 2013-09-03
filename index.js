var express = require('express'),
Url = require('url'),
subdomains = require('express-subdomains'),
graph = require('fbgraph'),
js2xmlparser = require("js2xmlparser"),
app;

var app = express();

app.use(express.compress());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: '3164446a7d6f6b707827703a51' }));
/*app.use(passport.initialize());
app.use(passport.session());*/
app.use(subdomains.middleware);

subdomains.domain('boxee.tv');
subdomains.use('app');
subdomains.use('res');

// this should really be in a config file!
var conf = {
    client_id:      '224073587748308'
  , client_secret:  'ae1b1ff5dc7cdc3c14da54ad563984ae'
  , scope:          'email, user_about_me, user_birthday, user_location, publish_stream, read_stream'
  , redirect_uri:   'http://bsev.local:9001/auth/facebook'
};


app.use(function(req, res, next){
  var url = Url.parse(req.url)
  req.url = url.pathname;
  console.log('perso middleware :',req.url);
  next();
});

app.get('/',function(req, res, next){
  res.send('<a href="/auth/facebook">Login with Facebook</a>');
});

app.get('/auth/facebook', function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
      , "scope":         conf.scope
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  // code is set
  // we'll send that and get the access token
  graph.authorize({
      "client_id":      conf.client_id
    , "redirect_uri":   conf.redirect_uri
    , "client_secret":  conf.client_secret
    , "code":           req.query.code
  }, function (err, facebookRes) {
    console.log("FA",facebookRes,err);
    res.redirect('/UserHasLoggedIn');
  });
});


// user gets sent here after being authorized
app.get('/UserHasLoggedIn', function(req, res) {
  graph.extendAccessToken({
        "client_id":      conf.client_id
      , "client_secret":  conf.client_secret
    }, function (err, facebookRes) {
       console.log("UHLI",facebookRes,err);
    });
  graph.get("me/home", function(err, resuslt) {
  console.log(resuslt);
  res.send(resuslt);
  });
});


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
  res.send('<?xml version="1.0" encoding="UTF-8" ?><genres><genre id="ADVENTURE">Adventure</genre><genre id="ANIMATION">Animation</genre><genre id="BIOGRAPHY">Biography</genre><genre id="COMEDY">Comedy</genre><genre id="CRIME">Crime</genre><genre id="DOCUMENTARY">Documentary</genre><genre id="DRAMA">Drama</genre><genre id="FAMILY">Family</genre><genre id="FANTASY">Fantasy</genre><genre id="GAME_SHOW">Game Show</genre><genre id="HISTORY">History</genre><genre id="HORROR">Horror</genre><genre id="MUSIC">Music</genre><genre id="MUSICAL">Musical</genre><genre id="MYSTERY">Mystery</genre><genre id="NEWS">News</genre><genre id="REALITY_TV">Reality-TV</genre><genre id="ROMANCE">Romance</genre><genre id="SCI_FI">Sci-Fi</genre><genre id="SHORT">Short</genre><genre id="SPORT">Sport</genre><genre id="TALK_SHOW">Talk-Show</genre><genre id="THRILLER">Thriller</genre><genre id="WAR">War</genre><genre id="WESTERN">Western</genre></genres>');
});

app.get('/app/api/get_recommendations',function(req, res, next){
  

  /*graph.extendAccessToken({
        "client_id":      conf.client_id
      , "client_secret":  conf.client_secret
    }, function (err, facebookRes) {
       console.log("UHLI",facebookRes,err);
    });*/
  graph.get("me/home", function(err, fbgraph_home) {
    if(err)
      return res.send(err);
    
    res.setHeader('Content-Type', 'application/xml');
    console.log(fbgraph_home);


    //var file = 'exemples/fbgraph_home.json';
    //var fbgraph_home = jf.readFileSync(file),
    var result = fbgraph_home,
    restFilter = [],
    restFormat = {
      timestamp : 1375738726,
      last : 472527590
    },
    xmlrest,
    config;


    var Facebook = require('facebook-node-sdk');

    var facebook = new Facebook({ appID: '373733952708996', secret: 'bcf3d305f547676352a6515124e0c979' });

    facebook.api('/amachang', function(err, data) {
      console.log(err);
      console.log(data); // => { id: ... }
    });

    for (var i = fbgraph_home.data.length - 1; i >= 0; i--) {
      var item = fbgraph_home.data[i];
      if(item.link && item.link.indexOf('youtu') > -1){
        //restFilter.push(item);
        //console.log(item);
        var test = {
          '@' : {type : 'recommend',
            score : '0',
            refferral : '477411962',
            source : 'Facebook'
          },
          timestamp : '1348242661',
          description : (item.message? item.message:item.description) + item.name,
          userTxt : item.message? item.message:item.description,
          global : 0,
          object : [{
            '@' : {type : "stream_video",
              id : "stv_4118832380"
            },
            name : item.name,
            url : item.link,
            label : 'Play on Youtube',
            thumb : item.picture,
            content_type : 'text/html',
            provider : 'Youtube'
          },{
            '@' : {type : "user",
             id : "FB:"+item.from.id
            },
            name : item.from.name,
            short_name : item.from.name,
            user_display_name : item.from.name,
            thumb : 'http://graph.facebook.com/'+item.from.id+'/picture',
            thumb_small : 'http://graph.facebook.com/'+item.from.id+'/picture'
          }]
        };

        restFilter.push(test);

      }
    };
    restFormat.message = restFilter;
    res.send(js2xmlparser("boxeefeed", restFormat));
  });
  //res.send('<?xml version="1.0" encoding="UTF-8" ?><boxeefeed>  <timestamp>1375738726</timestamp>  <last>472527590</last>  <message type="recommend" score="0" referral="477411962" source="Facebook">    <timestamp>1348242661</timestamp>    <description>[object id="FB:100001230627056" property="short_name" /]  en 2s on reconnait la pâte de THE QUEEN of Fitness !!!    UN SON, UNE CHORE, What else ??!!!  Future love fit, Paris (16.09.2012) - Step Maliama</description>    <userTxt>en 2s on reconnait la pâte de THE QUEEN of Fitness !!!    UN SON, UNE CHORE, What else ??!!!</userTxt>    <global>0</global>    <object type="stream_video" id="stv_4118832380">      <name>Future love fit, Paris (16.09.2012) - Step Maliama</name>      <url>http://www.youtube.com/watch?v=kgTg8aO81Xg</url>      <label>Play on YouTube</label>      <thumb>http://i.ytimg.com/vi/kgTg8aO81Xg/0.jpg</thumb>      <content_type>text/html</content_type>      <provider>YouTube</provider>    </object>    <object type="user" id="FB:100001230627056">      <name>Grégory Chevret</name>      <short_name>Grégory Chevret</short_name>      <user_display_name>Grégory Chevret</user_display_name>      <thumb>http://graph.facebook.com/100001230627056/picture</thumb>      <thumb_small>http://graph.facebook.com/100001230627056/picture</thumb_small>    </object>  </message></boxeefeed>');
});

app.listen(9001);
console.log('Server remplacement run on port : 9001');
