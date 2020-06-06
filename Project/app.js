const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const {getHomePage} = require('./routes/index');
const {showbattingstats_strike,showbattingstats_4,showbattingstats_6,
  showbattingstats_matches,showbattingstats_50,showbattingstats_runs,showbattingstats_tscore,
  showbattingstats_100,addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage,showBallingstats,
  showBallingstats_runs,showBallingstats_wickets,showTeams,showBallingstats_economy,showBallingstats_balls,showBallingstats_matches,
  showbattingstats,showballingstats,showplayerstats,showplayerstats2,showbattingstats_runs_cond,interestingFacts,
  interestingFacts_f50,interestingFacts_f100,interestingFacts_runs,interestingFacts_tscore,interestingFacts_m50,interestingFacts_m100,
  interestingFacts_m4,interestingFacts_m6,interestingFacts_strike,interestingFacts_bat,interestingFacts_bowling,
  interestingFacts_wicket,interestingFacts_economy,interestingFacts_dot,interestingFacts_maiden,points,
  points_8,points_9,points_10,points_11,points_12,points_13,points_14,points_15,points_16,points_17,showPlayers} = require('./routes/player');
 
const port = 5000;

const Pool = require('pg').Pool
const pool = new Pool({
  user: '',
  host: 'localhost',
  database: 'ipl2',
  password: '',
  port: 5432,
})

// connect to database
pool.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.pool = pool;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get('/', getHomePage);
app.post('/', getHomePage);
app.get('/add', addPlayerPage);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.post('/add', addPlayer);
app.post('/edit/:id', editPlayer);
app.get('/batting_stats', showbattingstats);
app.get('/batting_stats/sort_by_runs', showbattingstats_runs);
app.get('/batting_stats/sort_by_runs_cond', showbattingstats_runs_cond);
app.post('/batting_stats/sort_by_runs_cond', showbattingstats_runs_cond);

app.get('/batting_stats/sort_by_tscore', showbattingstats_tscore);
app.get('/batting_stats/sort_by_100', showbattingstats_100);
app.get('/batting_stats/sort_by_50', showbattingstats_50);
app.get('/batting_stats/sort_by_matches', showbattingstats_matches);
app.get('/batting_stats/sort_by_6', showbattingstats_6);
app.get('/batting_stats/sort_by_4', showbattingstats_4);
app.get('/batting_stats/sort_by_strike', showbattingstats_strike);
app.get('/showp',showplayerstats2);
app.post('/showp',showplayerstats2);

app.get('/bowling_stats',showBallingstats);
app.get('/bowling_stats/sort_by_runs',showBallingstats_runs);
app.get('/bowling_stats/sort_by_wickets',showBallingstats_wickets);
app.get('/bowling_stats/sort_by_balls',showBallingstats_balls);
app.get('/bowling_stats/sort_by_matches',showBallingstats_matches);
app.get('/bowling_stats/sort_by_economy',showBallingstats_economy);

app.get('/teams',showTeams);
app.get('/players',showPlayers);

app.get('/interesting_facts',interestingFacts);
app.get('/interesting_facts/runs',interestingFacts_runs);
app.get('/interesting_facts/tscore',interestingFacts_tscore);
app.get('/interesting_facts/strike',interestingFacts_strike);
app.get('/interesting_facts/f50',interestingFacts_f50);
app.get('/interesting_facts/f100',interestingFacts_f100);
app.get('/interesting_facts/m50',interestingFacts_m50);
app.get('/interesting_facts/m100',interestingFacts_m100);
app.get('/interesting_facts/m4',interestingFacts_m4);
app.get('/interesting_facts/m6',interestingFacts_m6);
app.get('/interesting_facts_bat',interestingFacts_bat);
app.get('/interesting_facts_bowling',interestingFacts_bowling);
app.get('/interesting_facts/wicket',interestingFacts_wicket);
app.get('/interesting_facts/economy',interestingFacts_economy);
app.get('/interesting_facts/dot',interestingFacts_dot);
app.get('/interesting_facts/maiden',interestingFacts_maiden);

app.get('/points',points)
app.get('/points/8',points_8)
app.get('/points/9',points_9)
app.get('/points/10',points_10)
app.get('/points/11',points_11)
app.get('/points/12',points_12)
app.get('/points/13',points_13)
app.get('/points/14',points_14)
app.get('/points/15',points_15)
app.get('/points/16',points_16)
app.get('/points/17',points_17)





// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});