CREATE TABLE ball(match_id int,over_id int,ball_id int,innings_no int,team_batting text,
	team_bowling text,striker_batting_position int,extra_type text,runs_scored int,extra_runs int,
	wides int,legbyes int,byes int,noballs int,penalty int,bowler_extras int,out_type text,caught int,
	bowled int,run_out int,lbw int,retired_hurt int,stumped int,caught_bowled int,hit_wicket int,
	obstructingfield int,bowler_wicket int,match_date text,season int,striker int,non_striker int,
	bowler int,player_out int,fielders int,striker_match_sk int,strikersk int,nonstriker_match_sk int,
	nonstriker_sk int,fielder_match_sk int,fielder_sk int,bowler_match_sk int,bowler_sk int,
	playerout_match_sk int,battingteam_sk int,bowlingteam_sk int,keeper_catch int,player_out_sk int,matchdatesk text);

COPY ball FROM 'D:\academia\col362\project\ipl\ipl-data-till-2017\Balls.csv' delimiter ',' csv header; 



CREATE TABLE match(Match_SK int ,match_id int ,Team1 text ,Team2 text,match_date text,Season_Year int ,Venue_Name text ,
	City_Name text ,Country_Name text,Toss_Winner text ,match_winner text,Toss_Name text,Win_Type text,
	Outcome_Type text ,ManOfMach text ,Win_Margin text ,Country_id int);


COPY match FROM 'D:\academia\col362\project\ipl\ipl-data-till-2017\Match.csv' delimiter ',' csv header; 


CREATE TABLE player(PLAYER_SK int ,Player_Id int ,Player_Name text,DOB text ,Batting_hand text ,Bowling_skill text ,Country_Name text);
COPY player FROM 'D:\academia\col362\project\ipl\ipl-data-till-2017\Player.csv' delimiter ',' csv header; 


create view playerscore as select striker,sum(runs_scored) as total_runs from ball group by striker;

create view playerfs as select striker,count(ball_id) as total_balls, count(ball_id) filter(where runs_scored=6) as total_six,
	count(ball_id) filter(where runs_scored=4) as total_four,sum(runs_scored) as total_runs, (sum(runs_scored)/cast(count(ball_id) as decimal))*100 as strike_rate
	 from ball group by striker order by striker asc;


create view match_stats as select match_id, striker, sum(runs_scored) as runs 
 from ball group by (match_id,striker) order by striker; 

create view per_striker_match_stats as select striker, count(match_id) filter(where runs>=100) as Hundreds,
count(match_id) filter(where runs>=50 and runs<100) as Fiftys, count(match_id) as matches, max(runs) as top_score,
AVG(runs) as Average from match_stats group by striker order by striker;

create view Batting_stats as select playerfs.striker,player.Batting_hand, playerfs.total_runs, per_striker_match_stats.top_score, 
per_striker_match_stats.Hundreds, per_striker_match_stats.Fiftys, per_striker_match_stats.matches,
ROUND(cast(per_striker_match_stats.Average as numeric),2) as Average, playerfs.total_balls, playerfs.total_six, playerfs.total_four, 
ROUND(cast(playerfs.strike_rate as numeric),2) as Strike_rate
from playerfs,per_striker_match_stats,player
where playerfs.striker = per_striker_match_stats.striker and playerfs.striker = player.Player_Id order by striker;


CREATE TABLE teams(Team_SK int, Team_Id int, Team_Name text);
COPY teams FROM 'D:\academia\col362\project\ipl\ipl-data-till-2017\Team.csv' delimiter ',' csv header;

