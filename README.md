# IPL_stats
The project is about a website that is made for people who are cricket enthusiasts and people looking to debate each other on who’s a better player or a team. The website displays ball by ball (granularity of the data) player statistics and gives it in the form the user wants, be it searching for specific players, or teams, or simply team statistics, balling statistics, batting statistics, the top players in each aspect, and a lot more. The database design is robust with the appropriate constraints and triggers, so that users can add data as well.

### Data Source : https://www.kaggle.com/raghu07/ipl-data-till-2017

The data was available in .csv format. It was directly downloaded it and analyzed using in Excel. It was structured but it was not clean.
The data source contains the data of all IPL seasons from 2008 to 2017 on a ball by ball granularity. It is availabe on the website in csv format. Minor pre-processing steps were taken such as removing the characters that were not UTF encoded, but not much because the datasets present on kaggle are mostly clean and ready to be used.

# Functionality 
## User’s View of the System
* ### Home
> This is the main page of the website which does not conatin any SQL queries. It just contains some information about IPL. Disclaimer: The information is copy pasted from wikipedia
* ### Teams
> The page just displays all the teams in table format which have played in IPL since its inception. It also includes the teams which were banned from playing or have not played in the last season or are no longer playing in the current season.
* ### Players
> The page displays all the players in table format which have ever played in any IPL season since its inception. The webpage contains a filter which the user can use to select players with certain characteristics. The filter is based on the country of origin of the player, the hand which the player uses to bat and the hand which the player uses to bowl. The user can select multiple countries at a given time to select players from multiple countries. User can also search a player by name and get his statistics.
* ### Stats
> This page gives the top batsman and bowler by various options. For batsman one can sort by runs,highest score, strike rate, average,most fours,most sixes,most fifties and most centuries,fastest 50 and fastest 100. Bowlers can be sorted by most wickets, maiden, dot balls, average and economy rate.
* ### Player Stats
> User can search a player by his name and get his batting and bowling statistics.
* ### Add Player
> This page provides the user an option to add a new player to the database. For adding a player, the user must enter the same details of a player as the table in the database contains except the id. The id again is automatically generated by node.js
* ### Interesting Facts
> Displaying top 10 players according to various different sorting criteria such as most runs, most 100s, most 50s, most maiden overs, most wickets, most dot balls etc.
* ### Points Table
> Year-wise distribution of points across teams

## Special functionality
* ### Views
> Views have been created. Eg: batting stats views, balling stats views, maiden overs views within the database. And whenever that particular data is required the views are not made in real time and pre-exist in the database so that the retrieval does not take much time.
* ### Triggers 
> Defined 2 triggers, to implement certain constraints which can not be defined other- wise, such that whenever any new data is added into the player table it gets updated in all the other tables where its relevant,
1) #### Batting stats which has various entries such as total runs, matches, sixes, fours, etc table is updated in sync when ever the player table gets updated
2) #### Bowling stats which has various entries such as total wickets, matches, dots, runs, etc table is updated in sync when ever the player table gets updated
* ### Foreign Keys
> Foreign keys have been defined in each of the tables for appropriate inter-linking between different tables.

## E-R Diagram:
 ![E-R Diagram](https://github.com/vinayak1998/IPL_stats/blob/master/Project/ER-diagram.jpeg)

