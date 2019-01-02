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

        var lastmonthresult = FilteredResults(result,new Date(y, m - 1, 1),new Date(y, m, 0));
        var lastmonthtotal = GetTotalCount(lastmonthresult);
        var lastmonthtotalUser = lastmonthresult.length;

        var last2monthresult = FilteredResults(result,new Date(y, m - 2, 1),new Date(y, m - 1, 0));
        var last2monthtotal = GetTotalCount(last2monthresult);
        var last2monthtotalUser = last2monthresult.length;

        //This months count
        var result = FilteredResults(result,new Date(y, m, 1),new Date(y, m + 1, 0));
        var monthlytotal = GetTotalCount(result);
        var thismonthtotalUser = result.length;

        //Getting today total count
        var start = new Date();
        start.setHours(0, 0, 0, 0);

        var end = new Date();
        end.setHours(23, 59, 59, 999);
        
        var result = result.sort((a, b) => a.value - b.value).filter(a => a.latestDate > start && a.latestDate < end);
        var todaytotal = GetTotalCount(result);
        var todayUser = result.length;

        totalentry.sort(function(a,b){
            return b.db_date-a.db_date;
        });
   
   $("#monthlytotal").append(monthlytotal);     
   $("#monthlytotalUser").append(thismonthtotalUser);
   $("#lastmonthtotal").append(lastmonthtotal);     
   $("#lastmonthtotalUser").append(lastmonthtotalUser); 
   $("#last2monthtotal").append(last2monthtotal);
   $("#last2monthtotalUser").append(last2monthtotalUser);
   $("#todaytotal").append(todaytotal);
   $("#todaytotalUser").append(todayUser);
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

function GetTotalCount(results)
{
    var total = 0;
    if (results.length) {
        results.forEach(function (data) {
            total += data.value;
        });
    }
    return total;
}

function FilteredResults(result, startDate, endDate)
{
    return result.sort((a, b) => a.value - b.value).filter(a => a.latestDate > startDate && a.latestDate < endDate);
}