from app import app
from flask import render_template
import pandas as pd
import json


sp500_data = pd.read_csv("./app/static/data/sp500_flask_4_22.csv", index_col = 'Symbol')

@app.route('/preCovid')
def preCovid():
	return render_template('shubham.html')

@app.route('/crashes_in_history')
def crashes_in_history():
	return render_template('ann.html')

@app.route('/disparate_impact')
def disparate_impact():
	return render_template('rudy.html')

@app.route('/')
@app.route("/index")
def index():
	return render_template('index.html')

# @app.route('/hello')
@app.route('/getData/<ticker>')
def getData(ticker):
	stock = sp500_data.filter(items = [ticker], axis=0)
	interested_data = {}
	interested_data["Stock"] = "{} ({})".format(stock["Name"][ticker], ticker)
	interested_data["Ticker"] = ticker
	interested_data["Sector"] = stock["Sector"][ticker]
	interested_data["Revenue"] = stock["Sales(a)"][ticker]
	interested_data["Earnings"] = stock["Net Income(a)"][ticker]
	interested_data["Market Cap"] = stock["Market Cap"][ticker]
	interested_data["5Y Rev%"] = float(stock["5Y Rev%"][ticker].strip('%').replace(',', ''))
	interested_data["5Y Earn%"] = float(stock["5Y Earn%"][ticker].strip('%').replace(',', ''))
	return json.dumps(interested_data)
