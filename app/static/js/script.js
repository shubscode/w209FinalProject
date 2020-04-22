/* global d3, barChart */

stock_viz_lib = {}

function arrayRemove(arr, value) {

   return arr.filter(function(ele){
      //console.log("inside remove", ele.Stock, value);
       return ele.Stock != value;
   });

}


function abbreviateNumber(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "K", "M", "B", "T" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    return number;
}

stock_viz_lib.metricsTable = function() {
  
  
  var table_data = [];
     //  {"Stock": "x", "Market Cap": 10, "PE Ratio": 10, "EPS": 10, "Dividend Yield": 10, "Payout Ratio": 10}, 
     //  {"Stock": "y", "Market Cap": 120, "PE Ratio": 10, "EPS": 10, "Dividend Yield": 30, "Payout Ratio": 90}
     // ];

  var stockBarChart = barChart()
    .x(function (d) { return d.key;})
    .y(function (d) { return d.value;});

  var columns = ["X", "Stock",  "Sector", "Market Cap", "Revenue", "Earnings", "5Y Rev%", "5Y Earn%"];

  var table = d3.select("body").select("div#stocktable").append("table");
  var thead = table.append("thead");
  var tbody = table.append("tbody");
 
  var setData_ = function(_) {
    var that = this;
    if (!arguments.length) return table_data;
    table_data = _;
    return that;
  }
  
  var updateData_ = function(d) {
    //d["X"] = "hi";
    table_data.push(d);
    // console.log("data is", d);
    if (table_data.length > 4) {
      stockBarChart.width(table_data.length  * 100);
      // console.log("")
    }
    showBarchart("Market Cap");
    updateRows_();
  }
  
  var showHeader_ = function() {
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .attr("scope", "col")
        .text(function(column) { return column; })
        .on("mouseover", function(d,i) {
          showBarchart(d);
        });
  }

  var deleteRows_ = function() {
    tbody.selectAll("tr")
      .data([])
      .exit()
      .remove()
  }

  var updateRows_ = function() {
    tbody.selectAll("tr")
      .data(table_data)
      .enter()
      .append("tr")
      // .append("td")
      // .append("input")
      // .attr("type", "button")
      // .attr("value", "Delete Row")
      .selectAll("td")
      .data(function(row) {
        return columns.map(function(column) {
            if (column === "X") {
              return {
                column: column,
                value: row
              };
            } else {
              return {
                column: column,
                value: row[column]
              };
            }
          });
      })
      .enter()
      .append("td")
      .attr("class", function(d) {
        if (d.column === "X") {
          return "btn btn-primary";
        }
      })
      .on("click", function(d) {
        if (d.column === "X") {
          table_data = arrayRemove(table_data, d.value.Stock);
          deleteRows_();
          updateRows_();
          showBarchart("Market Cap");
        }
      })
      .attr("data-label", function(d) { return d.column; })
      .text(function(d) {
        //return d.value; 
        if (d.column === "X") {
          return "X";//"<input> type = 'button' Delete</input>";
        } 
        if (d.column === "Market Cap" || d.column === "Revenue" || d.column === "Earnings") {
          return abbreviateNumber(+d.value, 2);
        }
        else {
          return d.value; 
        }
      });
      

    tbody.selectAll("tr")
      .selectAll("[data-label=X]")
      .selectAll("input")
      .data(table_data)
      // .exit()
      // .remove()
      //.enter()
      //.append("td")
      .append("input")
      .attr("type", "button")
      .attr("value", "Delete Row");
      //.attr("data-label", "X");

  }

  var showBarchart = function(col) {
    if (col !== "Stock" && col !== "X" && col !== "Sector") {
      var bcData = [];
      for (r of table_data) {
        var row = {};
        var stock_sub = r.Stock.substring(
            r.Stock.lastIndexOf("(") + 1, 
            r.Stock.lastIndexOf(")")
        );
        row["key"] = stock_sub;
        row["value"] = r[col];
        bcData.push(row);
      }
      document.getElementById("barChartTitle").textContent = col.concat(" Comparison");
      d3.select("#stockChart")
          .datum(bcData)
          .call(stockBarChart);
    }
  }
  
  var public = {
    "updateRows": updateRows_,
    "setData": setData_,
    "updateData": updateData_,
    "showHeader": showHeader_
  }
  return public;
}

stockTable = stock_viz_lib.metricsTable();
stockTable.showHeader();

stock_viz_lib.displayStockInfo = function() {
  var stock_ticker = document.getElementById("stockSearch").value;
  d3.json("getData/" + stock_ticker, function(err, data) {
    if (err) { 
      alert("Make sure you have entered the Ticker symbol in all caps!")
      throw err;
    }
    stockTable.updateData(data);
  });

}



d3.json("getData/AAPL", function(err, data) {
  if (err) throw err;
  stockTable.updateData(data);
})

d3.json("getData/C", function(err, data) {
  if (err) throw err;
  stockTable.updateData(data);
})

d3.json("getData/JNJ", function(err, data) {
  if (err) throw err;
  stockTable.updateData(data);
})

d3.json("getData/WMT", function(err, data) {
  if (err) throw err;
  stockTable.updateData(data);
})

//data =  [{"Stock": "x", "Market Cap": 10, "PE Ratio": 10, "EPS": 10, "Dividend Yield": 10, "Payout Ratio": 10}];
// stockTable = stock_viz_lib.metricsTable();
// stockTable.showHeader();
//stockTable.setData(data);
//stockTable.updateRows();

//data.push({"Stock": "y", "Market Cap": 120, "PE Ratio": 10, "EPS": 10, "Dividend Yield": 30, "Payout Ratio": 90});
// var addOn = {"Stock": "y", "Market Cap": 120, "PE Ratio": 10, "EPS": 10, "Dividend Yield": 30, "Payout Ratio": 90}
// stockTable.updateData(addOn);
//stockTable.setData(data);
//stockTable.updateRows();