from app import app
from flask import render_template
import yfinance as yf
from ballpark import business

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

# @app.route('/hello')
@app.route('/getData/<ticker>')
def getData(ticker):
	print("fetching data")
	stock = yf.Ticker(ticker).info
	interested_data = {}
	interested_data["Stock"] = "{} ({})".format(stock["shortName"], ticker)
	interested_data["Ticker"] = ticker
	interested_data["Price"] = stock["previousClose"] 
	interested_data["Dividend Rate"] = stock["dividendRate"] if stock["dividendRate"] else "0.00"
	interested_data["PE Ratio"] = int(stock["trailingPE"] * 100) / 100
	interested_data["EPS"] = stock["trailingEps"]
	interested_data["Market Cap"] = stock["marketCap"] #business(stock["marketCap"], prefixes = {3: 'K', 6: "M", 9: "B", 12:"T"}) 
	print(interested_data["Market Cap"])
	interested_data["Payout Ratio"] = int(stock["payoutRatio"] * 100)/100


	return interested_data
