const fs = require('fs');



module.exports = {
    getHomePage: function(req, res)  {
        let query = "SELECT * FROM player ORDER BY Player_Id ASC"; // query database to get all the players
        let runquery = "select striker,sum(runs_scored) as total_runs from ball group by striker order by striker asc";
        let sixquery = "select striker,count(ball_id) filter(where runs_scored=6) as total_six from ball group by striker order by striker asc";
        var arr = [];
        var arr2 = [];
        var arr3 = [];
        
        let optiontype = req.body.selecttype;


        const queryWrapper = (statement) => {
            return new Promise((resolve, reject) => {
                pool.query(statement, (err, result) => {
                    if(err)
                        return reject(err);
                    arr = result;
                    return resolve(result);
                });
            });
        };

        const queryWrapper2 = (statement) => {
            return new Promise((resolve, reject) => {
                pool.query(statement, (err, result) => {
                    if(err)
                        return reject(err);
                    arr2 = result;
                    return resolve(result);
                });
            });
        };

        const queryWrapper3 = (statement) => {
            return new Promise((resolve, reject) => {
                pool.query(statement, (err, result) => {
                    if(err)
                        return reject(err);
                    arr3 = result;
                    return resolve(result);
                });
            });
        };

        Promise.all([
        queryWrapper(query),queryWrapper2(runquery),queryWrapper3(sixquery),
        ])
        .then((result) => {
            console.log(arr2);
            console.log(optiontype);
            res.render('index.ejs', {
                title: "Welcome to IPL | View Matches",
                player :   arr.rows,
                runs : arr2.rows,
                six : arr3.rows,
                option : optiontype,
                mess : "kar de bhai",
            });
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        })


        // execute query
        // pool.query(query, (err, result) => {
        //     if (err) {
        //         console.log('error in gethomepage');
        //         res.redirect('/');
        //     }
        //     console.log("gone to homepage");  
        //     // res.json(result.rows);
        //     res.render('index.ejs', {
        //         title: "Welcome to Socka View Players"
        //         ,players: result
        //     },function(err,result2){console.log('rendering');res.send(result2)});
        // });
    }
};
