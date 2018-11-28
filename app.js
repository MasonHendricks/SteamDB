var mysql = require('mysql');
var SteamSpy = require('steamspy');

// steamspy client that can send and get data
var client = new SteamSpy();

/**
 * Returns Top 100 games by players in the last two weeks.
 * @param {SteamSpy~requestCallback} cb Callback executed after API response
 * */

// mySQL connection that can read and write to DB
var con = mysql.createConnection({
  host: "35.224.230.100",
  user: "admin",
  password: "admin",
  database: "steam",
});


// Object to hold the top 100 in 2 weeks Object
var top100in2weeksObj;

// Array to hold all gamey keys of top100in2weeksObj
var top100in2weeksKeys;

//returned JSON object containing all games
var jsontop100in2weeks;

// Counter to tell how many objects were returned
var counter = 0;

client.top100in2weeks(function (err, response, data){
    if (!err){
        top100in2weeksObj = data;
        top100in2weeksKeys = Object.keys(top100in2weeksObj);
        getGenres();
    }
});

function getGenres(){
    var counter = 0;
    for(i = 0; i < top100in2weeksKeys.length; i++){
        client.appdetails(top100in2weeksObj[top100in2weeksKeys[i]].appid, function (err, response, data){
            if ( !err ) {
                console.log(Object.keys(data.tags)[1]);
                console.log(top100in2weeksObj[top100in2weeksKeys[counter]].appid);
                top100in2weeksObj[top100in2weeksKeys[counter]]["tags"] = "" + Object.keys(data.tags)[1] + "";
                counter += 1;
                if (counter == top100in2weeksKeys.length-1){
                    updateDatabase();
                }
            }
        });
    }
};

function updateDatabase(arr, keys){
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        for(i = 0; i < top100in2weeksKeys.length; i++){
            var name = top100in2weeksObj[top100in2weeksKeys[i]].name.replace(/'/g, '');
            var developer = top100in2weeksObj[top100in2weeksKeys[i]].developer.replace(/'/g, '');;
            var userscore = top100in2weeksObj[top100in2weeksKeys[i]].userscore;
            var owners = (parseInt(top100in2weeksObj[top100in2weeksKeys[i]].owners.split("..")[0]) + parseInt(top100in2weeksObj[top100in2weeksKeys[i]].owners.split("..")[1]))  / 2;
            var price = parseFloat(top100in2weeksObj[top100in2weeksKeys[i]].price)/ Math.pow(10,2);
            var tags = top100in2weeksObj[top100in2weeksKeys[i]].tags;
            var averageForever = top100in2weeksObj[top100in2weeksKeys[i]].average_forever;
            var average2Weeks = top100in2weeksObj[top100in2weeksKeys[i]].average_2weeks;
            
            
            
            var sql = "INSERT INTO games (name, developer, userscore, owners, price, tags, averageForever, average2Weeks) VALUES ( '" + name + "','" + developer + "'," + userscore + "," + owners + "," + price + ",'" + tags + "'," + averageForever + "," + average2Weeks + ")";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("record inserted");
            });
        }
        
        con.end();
      })
}
