const fs = require('fs');

module.exports = {
    addPlayerPage: (req, res) => {

        console.log('inside add player page');
        let countryquery = "select distinct(country_name) from player";
        let handquery = "select distinct(batting_hand) from player";
        let teamquery = "select distinct(team_name) from teams";
        let skillquery = "select distinct(bowling_skill) from player";

        var arr_country = [];
        var arr_team = [];
        var arr_hand = [];
        var arr_skill = [];



        const queryWrapper2 = (statement) => {
            return new Promise((resolve, reject) => {
                pool.query(statement, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    arr_country = result;
                    console.log(arr_country.rows);
                    return resolve(result);
                });
            });
        };

        const queryWrapper3 = (statement) => {
            return new Promise((resolve, reject) => {
                pool.query(statement, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    arr_team = result;
                    console.log(arr_team.rows);
                    return resolve(result);
                });
            });
        };

        const queryWrapper4 = (statement) => {
            return new Promise((resolve, reject) => {
                pool.query(statement, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    arr_hand = result;
                    console.log(arr_hand.rows);
                    return resolve(result);
                });
            });
        };

        const queryWrapper5 = (statement) => {
            return new Promise((resolve, reject) => {
                pool.query(statement, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    arr_skill = result;
                    console.log(arr_skill.rows);
                    return resolve(result);
                });
            });
        };

        Promise.all([
        queryWrapper2(countryquery),queryWrapper3(teamquery),queryWrapper4(handquery),queryWrapper5(skillquery),
        ])
        .then((result) => {
            console.log('here');
            res.render('add-player.ejs', {
                title: "Welcome to IPL  Add a new player"
                ,bhand : arr_hand.rows
                ,bskill : arr_skill.rows
                ,country : arr_country.rows
                ,team : arr_team.rows
                ,message: ''
            });
        }).catch(err => {
            console.error(err);
            res.redirect('/');
        });
        
    },
    addPlayer: (req, res) => {
        let message = '';
        let pname = req.body.name;
        let pdob = req.body.dob;
        let phand = req.body.batting;
        let pskill = req.body.bowling;
        let pcountry = req.body.country;
        let pteam = req.body.team;
        var id = [];
        var sk;
        var pid;
        let idquery = "select count(*) from player";
        let usernameQuery = "SELECT * FROM player WHERE player_name = '" + pname + "'";
        pool.query(idquery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            id = result.rows[0];
            console.log('ins '+id.count);
            sk = id.count;
            pid = Number(id.count) + 1;
            
        });        
        // console.log('sk is '+id.count);
        // console.log(sk);

        pool.query(usernameQuery, (err, result) => {
            if (err) {
                console.log('error in usernameQuery');
                return res.status(500).send(err);
            }
            console.log('here');
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-player.ejs', {
                    message,
                    title: "Welcome to IPL | Add a new player"
                });
            } else {
                        let query = "INSERT INTO player (PLAYER_SK,Player_Id ,Player_Name,DOB  ,Batting_hand  ,Bowling_skill ,Country_Name) VALUES ('" +
                            (sk-0) + "', '" + (pid-0) + "', '" + pname + "', '" + pdob + "', '" + phand + "','" + pskill + "', '" + pcountry + "')";
                        pool.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            console.log('player add query done');
                            res.redirect('/');
                        });
                    };
                
            });
    },
    editPlayerPage: (req, res) => {
        let playerId = req.params.id;
        console.log(playerId);
        let query = "SELECT * FROM players WHERE id = '" + playerId + "' ";
        pool.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows
            res.render('edit-player.ejs', {
                title: "Edit Player"
                ,player: arr[0]
                ,message: ''
            });
        });
    },
    editPlayer: (req, res) => {
        let playerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;

        let query = "UPDATE players SET first_name = '" + first_name + "', last_name = '" + last_name + "', position = '" + position + "', number = '" + number + "' WHERE players.id = '" + playerId + "'";
        pool.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletePlayer: (req, res) => {
        let playerId = req.params.id;
        let getImageQuery = "SELECT * from players WHERE id = '" + playerId + "'";
        let deleteUserQuery = "DELETE FROM players WHERE id = '" + playerId + "'";

        pool.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            let image = arr[0].image;
            console.log(image);

            fs.unlink('public/assets/img/'+image, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                pool.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    },
    showbattingstats: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY striker ASC";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('batting.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    showballingstats: (req, res) => {
        res.render('add-player.ejs', {
            title: "Welcome to IPL  Add a new player"
            ,message: ''
        });
    },
    showbattingstats_runs: (req, res) => {
        
        let query = "SELECT * FROM Batting_stats ORDER BY total_runs desc";
        var arr4 = [];
        
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('batting.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    showbattingstats_runs_cond: (req, res) => {
        let runs = req.body.cond;
        console.log(runs);
        let query2 = "SELECT * FROM Batting_stats where total_runs >'"+runs+"' ORDER BY total_runs desc";
        var arr4 = [];
        pool.query(query2, (err, result) => {
            if (err) {
                console.log('error in runs_cond');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('batting.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    showbattingstats_tscore: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY top_score desc";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('batting.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    showbattingstats_100: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY hundreds desc";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('batting.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    showbattingstats_50: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY fiftys desc";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('batting.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    showbattingstats_matches: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY matches desc";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('batting.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    showbattingstats_6: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY total_six desc";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('batting.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    showbattingstats_4: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY total_four desc";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('batting.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    showbattingstats_strike: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY strike_rate desc";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('batting.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    showplayerstats2: (req, res) => {
        let p_name = req.body.name;
        console.log('selected player is ');
        console.log(p_name);
        var arr = [];
        var arr2 = [];
        var arr4 = [];
        let query1 = "select player_name from player order by player_Id";
        let query2 = "SELECT * FROM Bowling_stats where player_name ='" + p_name + "' ";
        let query4 = "SELECT * FROM Batting_stats where player_name ='" + p_name + "' ";

        const queryWrapper1 = (statement) => {
            return new Promise((resolve, reject) => {
                pool.query(statement, (err, result) => {
                    if (err) {
                        console.log('error in showplayerstats');
                        res.redirect('/');
                    }
                    console.log(result);
                    arr = result;
                    return resolve(result);
                });
            });
        };

        
        const queryWrapper2 = (statement) => {
            return new Promise((resolve, reject) => {
                pool.query(statement, (err, result) => {
                    if (err) {
                        console.log('error in showplayerstats');
                        res.redirect('/');
                    }
                    console.log(result);
                    arr2 = result;
                    return resolve(result);
                });
            });
        };

        
        const queryWrapper4 = (statement) => {
            return new Promise((resolve, reject) => {
                pool.query(statement, (err, result) => {
                    if (err) {
                        console.log('error in showplayerstats');
                        res.redirect('/');
                    }
                    console.log(result);
                    arr4 = result;
                    return resolve(result);
                });
            });
        };

        Promise.all([
        queryWrapper1(query1),queryWrapper2(query2),queryWrapper4(query4),
        ])
        .then((result) => {
            res.render('player_stats.ejs', {
                title: "Welcome to IPL | View Player"
                ,aplayer : arr.rows
                ,player: arr4.rows
                ,player2: arr2.rows
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });
    },
    showTeams: (req, res) => {
        let query1 = "select * from teams"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('teams.ejs', {
                title: "Welcome to IPL | Teams"
                ,player : arr
            });
        });    
    },
    showPlayers: (req, res) => {
        let query1 = "select Player_Name,DOB,batting_hand,bowling_skill,country_name from player"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('player.ejs', {
                title: "Welcome to IPL | Players"
                ,player : arr
            });
        });    
    },
    showBallingstats: (req, res) => {
        let query1 = "select * from Bowling_stats order by bowler"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('bowling.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },

    showBallingstats_runs: (req, res) => {
        let query1 = "select * from Bowling_stats order by runs desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('bowling.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    showBallingstats_wickets: (req, res) => {
        let query1 = "select * from Bowling_stats order by wickets_taken desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('bowling.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    showBallingstats_balls: (req, res) => {
        let query1 = "select * from Bowling_stats order by total_balls desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('bowling.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    showBallingstats_matches: (req, res) => {
        let query1 = "select * from Bowling_stats order by matches desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('bowling.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    showBallingstats_economy: (req, res) => {
        let query1 = "select * from Bowling_stats order by economy"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('bowling.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    interestingFacts: (req, res) => {
        res.render('interesting_facts.ejs', {
                title: "Welcome to IPL | Interesting Facts"
            });   
    },
    interestingFacts_bat: (req, res) => {
        res.render('interesting_facts_bat.ejs', {
                title: "Welcome to IPL | Interesting Facts"
            });   
    },
    interestingFacts_bowling: (req, res) => {
        let query1 = "select * from Bowling_stats order by economy"

        res.render('interesting_facts_bowling.ejs', {
                title: "Welcome to IPL | Interesting Facts"
            });   
    },
    interestingFacts_runs: (req, res) => {
        
        let query = "SELECT * FROM Batting_stats ORDER BY total_runs desc limit 10";
        var arr4 = [];
        
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('interesting_facts_runs.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    interestingFacts_m6: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY total_six desc limit 10";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('interesting_facts_runs.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    interestingFacts_m4: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY total_four desc limit 10";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('interesting_facts_runs.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    interestingFacts_strike: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY strike_rate desc limit 10";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('interesting_facts_runs.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    interestingFacts_tscore: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY top_score desc limit 10";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('interesting_facts_runs.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    interestingFacts_m100: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY hundreds desc limit 10";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('interesting_facts_runs.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    interestingFacts_m50: (req, res) => {
        let query = "SELECT * FROM Batting_stats ORDER BY fiftys desc limit 10";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('interesting_facts_runs.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    interestingFacts_f50: (req, res) => {
        let query = "select player_name,team_name as Against,match_date,balls_faced,num_6s,num_4s,runs from ball_cum_runs2 join teams on ball_cum_runs2.team_id=teams.team_id order by balls_faced,runs desc,num_6s desc,num_4s desc limit 10";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('interesting_facts_fastest.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    interestingFacts_f100: (req, res) => {
        let query = "select player_name,team_name as Against,match_date,balls_faced,num_6s,num_4s,runs from ball_cumm_runs2 join teams on ball_cumm_runs2.team_id=teams.team_id order by balls_faced,runs desc,num_6s desc,num_4s desc limit 10";
        var arr4 = [];
        pool.query(query, (err, result) => {
            if (err) {
                console.log('error in gethomepage');
                res.redirect('/');
            }
            console.log(result);
            arr4 = result;
            res.render('interesting_facts_fastest.ejs', {
                title: "Welcome to IPL | View Batters"
                ,player: arr4.rows
            });
        });
    },
    interestingFacts_wicket: (req, res) => {
        let query1 = "select * from Bowling_stats order by wickets_taken desc limit 10"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('interesting_facts_wickets.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    interestingFacts_economy: (req, res) => {
        let query1 = "select * from Bowling_stats where total_balls>=120 order by economy limit 10"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('interesting_facts_wickets.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    interestingFacts_dot: (req, res) => {
        let query1 = "select player_name,count from balls_dot order by count desc limit 10"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('interesting_facts_dot.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    interestingFacts_maiden: (req, res) => {
        let query1 = "select * from maiden_overs order by nmaiden desc limit 10"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('interesting_facts_maiden.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    points: (req, res) => {
        res.render('points.ejs', {
                title: "Welcome to IPL | Points Table"
            });   
    },
    points_8: (req, res) => {
        let query1 = "select * from matches_stats where season_year = 2008 order by points desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('points_y.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    points_9: (req, res) => {
        let query1 = "select * from matches_stats where season_year = 2009 order by points desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('points_y.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    points_10: (req, res) => {
        let query1 = "select * from matches_stats where season_year = 2010 order by points desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('points_y.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    points_11: (req, res) => {
        let query1 = "select * from matches_stats where season_year = 2011 order by points desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('points_y.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    points_12: (req, res) => {
        let query1 = "select * from matches_stats where season_year = 2012 order by points desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('points_y.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    points_13: (req, res) => {
        let query1 = "select * from matches_stats where season_year = 2013 order by points desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('points_y.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    points_14: (req, res) => {
        let query1 = "select * from matches_stats where season_year = 2014 order by points desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('points_y.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    points_15: (req, res) => {
        let query1 = "select * from matches_stats where season_year = 2015 order by points desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('points_y.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    points_16: (req, res) => {
        let query1 = "select * from matches_stats where season_year = 2016 order by points desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('points_y.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    },
    points_17: (req, res) => {
        let query1 = "select * from matches_stats where season_year = 2017 order by points desc"

        pool.query(query1, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            var arr = result.rows;
            
            res.render('points_y.ejs', {
                title: "Welcome to IPL | Bowling stats"
                ,player : arr
            });
        });    
    }

};
