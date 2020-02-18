/* global d3, barChart */


var stock_viz_lib = stock_viz_lib || {};

stock_viz_lib.metricsTable = function() {
  
  
  var table_data = [];
     //  {"Stock": "x", "Market Cap": 10, "PE Ratio": 10, "EPS": 10, "Dividend Yield": 10, "Payout Ratio": 10}, 
     //  {"Stock": "y", "Market Cap": 120, "PE Ratio": 10, "EPS": 10, "Dividend Yield": 30, "Payout Ratio": 90}
     // ];

  var stockBarChart = barChart()
    .x(function (d) { return d.key;})
    .y(function (d) { return d.value;});
    
  var columns = ["Stock", "Market Cap", "PE Ratio", "EPS", "Dividend Rate", "Payout Ratio"];

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
    table_data.push(d);
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

  var updateRows_ = function() {
    tbody.selectAll("tr")
      .data(table_data)
      .enter()
      .append("tr")
      .selectAll("td")
      .data(function(row) {
        return columns.map(function(column) {
          return {
            column: column,
            value: row[column]
          };
        });
      })
      .enter()
      .append("td")
      .attr("data-label", function(d) { return d.column; })
      .text(function(d) {return d.value; });
  }

  var showBarchart = function(col) {
    if (col !== "Stock") {
      var bcData = [];
      for (r of table_data) {
        var row = {};
        row["key"] = r.Stock;
        row["value"] = r[col];
        bcData.push(row);
      }
      console.log(bcData);
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

d3.json("getData/AAPL", function(err, data) {
  if (err) throw err;
  stockTable.updateData(data);
})

d3.json("getData/MSFT", function(err, data) {
  if (err) throw err;
  stockTable.updateData(data);
})

d3.json("getData/FB", function(err, data) {
  if (err) throw err;
  stockTable.updateData(data);
})

d3.json("getData/GOOG", function(err, data) {
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