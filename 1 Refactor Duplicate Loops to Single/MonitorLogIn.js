$(function() {
 var result = {},
        groupBy = "Email";
        var new_data = [];
        //Filtering first entry and removing first entry because it will be by the operations team to verify Login
        for (key in output) {
            new_data.push(output.sort((a, b) => new Date(a.date) - new Date(b.date)));
        }

        for (var i = 0; i < output.length; i++) {
            if (!result[output[i][groupBy]])
                result[output[i][groupBy]] = [];
            result[output[i][groupBy]].push(output[i]);
        };

        new_data = [];
        for (key in result) {
            for (var i = 0; i < result[key].length; i++) {
                if (i) {
                    new_data.push(result[key][i]);
                }
            };
        }

        //Counting occurence of all email Login
        var occurences = new_data.reduce(function (r, row) {
            if (!(r[row.Email] instanceof Array)) {
                r[row.Email] = [];
                r[row.Email].push(row.datefield);
            }
            else
                r[row.Email].push(row.datefield);
            return r;
        }, {});

        result = Object.keys(occurences).map(function (key) {
            return {
                key: key,
                value: occurences[key].length,
                latestDate: occurences[key][occurences[key].length - 1]
            };
        });

        result = result.sort((a, b) => a.value - b.value).filter(a => a.value > 0);
        var total = 0;
        if (result.length) {
            result.forEach(function (data) {
                total += data.value;
            });
        }
        totalUser = result.length;

        //Getting today total count
        var start = new Date();
        start.setHours(0, 0, 0, 0);

        var end = new Date();
        end.setHours(23, 59, 59, 999);
        var todayentry = [];
        if (output.length) {
            for (var i = 0; i < output.length; i++) {
                if (output[i]["datefield"] < end && output[i]["datefield"] > start) {
                    var exist=0;
                    for(var j=0; j<todayentry.length; j++) {
                        if(todayentry[j].email == output[i][groupBy])
                        {
                            var value=todayentry[j].count;
                            exist=1;
                            todayentry[j].count=value+1;
                            break;
                        }
                    }
                    if(!exist)
                        todayentry.push({"email":output[i][groupBy],"count":0});
                }                
            }
        }

        var totalentry = [];
        if (output.length) {
            for (var i = 0; i < output.length; i++) {
                    var exist=0;
                    for(var j=0; j<totalentry.length; j++) {
                        if(totalentry[j].email == output[i][groupBy])
                        {
                            var value=totalentry[j].count;
                            var db_date=totalentry[j].db_date;
                            if(output[i]["datefield"]>db_date)
                                db_date=output[i]["datefield"];
                            exist=1;
                            totalentry[j].count=value+1;
                            var date=new Date(db_date);
                            var dd = date.getDate();
                            var mm = date.getMonth()+1; 
                            var yyyy = date.getFullYear();
                            totalentry[j].date=dd+'/'+mm+'/'+yyyy;
                            totalentry[j].db_date=db_date;
                            break;
                        }
                    }
                    if(!exist){
                        var date=new Date(output[i]["datefield"]);
                        var dd = date.getDate();
                        var mm = date.getMonth()+1; 
                        var yyyy = date.getFullYear();
                        totalentry.push({"email":output[i][groupBy],"count":0,"date":dd+'/'+mm+'/'+yyyy,"db_date":output[i]["datefield"]});
                    }
            };
        };

        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);
        var monthentry = [];
        if (output.length) {
            for (var i = 0; i < output.length; i++) {
                if(output[i]["datefield"]>firstDay && output[i]["datefield"]<lastDay)
                {
                    var exist=0;
                    for(var j=0; j<monthentry.length; j++) {
                        if(monthentry[j].email == output[i][groupBy])
                        {
                            var value=monthentry[j].count;
                            exist=1;
                            monthentry[j].count=value+1;
                            break;
                        }
                    }
                    if(!exist)
                        monthentry.push({"email":output[i][groupBy],"count":0});
                }
            }
        }

        var thismonthtotalUser=0;
        if(monthentry.length)
        {
            for (var i = 0; i < monthentry.length; i++) {
                if(monthentry[i].count)
                    thismonthtotalUser+=1;
            }
        }

        var lastmonthfirstDay = new Date(y, m - 1, 1);
        var lastmonthlastDay = new Date(y, m, 0);
        var lastmonthentry = [];
        if (output.length) {
            for (var i = 0; i < output.length; i++) {
                if(output[i]["datefield"]>lastmonthfirstDay && output[i]["datefield"]<lastmonthlastDay)
                {
                    var exist=0;
                    for(var j=0; j<lastmonthentry.length; j++) {
                        if(lastmonthentry[j].email == output[i][groupBy])
                        {
                            var value=lastmonthentry[j].count;
                            exist=1;
                            lastmonthentry[j].count=value+1;
                            break;
                        }
                    }
                    if(!exist)
                        lastmonthentry.push({"email":output[i][groupBy],"count":0});
                }
            }
        }
        
        var lastmonthtotalUser=0;
        if(lastmonthentry.length)
        {
            for (var i = 0; i < lastmonthentry.length; i++) {
                if(lastmonthentry[i].count)
                    lastmonthtotalUser+=1;
            }
        }

        var last2monthfirstDay = new Date(y, m - 2, 1);
        var last2monthlastDay = new Date(y, m - 1, 0);
        var last2monthentry = [];
        if (output.length) {
            for (var i = 0; i < output.length; i++) {
                if(output[i]["datefield"]>last2monthfirstDay && output[i]["datefield"]<last2monthlastDay)
                {
                    var exist=0;
                    for(var j=0; j<last2monthentry.length; j++) {
                        if(last2monthentry[j].email == output[i][groupBy])
                        {
                            var value=last2monthentry[j].count;
                            exist=1;
                            last2monthentry[j].count=value+1;
                            break;
                        }
                    }
                    if(!exist)
                        last2monthentry.push({"email":output[i][groupBy],"count":0});
                }
            }
        }
        var last2monthtotalUser=0;
        if(last2monthentry.length)
        {
            for (var i = 0; i < last2monthentry.length; i++) {
                if(last2monthentry[i].count)
                    last2monthtotalUser+=1;
            }
        }

        totalentry.sort(function(a,b){
            return b.db_date-a.db_date;
        });
   
   $("#monthlytotal").append(sum(monthentry));     
   $("#monthlytotalUser").append(thismonthtotalUser);
   $("#lastmonthtotal").append(sum(lastmonthentry));     
   $("#lastmonthtotalUser").append(lastmonthtotalUser); 
   $("#last2monthtotal").append(sum(last2monthentry));
   $("#last2monthtotalUser").append(last2monthtotalUser);
   $("#todaytotal").append(sum(todayentry));   
   $("#totalCount").append(total);
   $("#totalUser").append(totalUser); 

   if(totalentry.length){ for (var i = 0; i < totalentry.length; i++) {
		 var resultRow = "<tr>";
		 	    resultRow += "<td>" + eval(i + 1) + "</td>";
		 	    resultRow += "<td>" + totalentry[i].email + "</td>";
		 	    resultRow += "<td>" + totalentry[i].count + "</td>";
		 	    resultRow += "<td>" + totalentry[i].date + "</td>";
		 	resultRow += "</tr>";
         $("#MonitorUser").append(resultRow);
 	} }

});

function sum( obj ) {
  var sum = 0;
  for(var i=0; i<obj.length; i++) {
    if(obj[i]) {
      sum += parseFloat( obj[i].count );
    }
  }
  return sum;
}