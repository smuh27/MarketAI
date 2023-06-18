import math
import sys
from requests.models import Response
import pandas_datareader as web
import numpy as np
import pandas as pd
from datetime import date, datetime, timedelta
from datetime import timedelta
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM
from bs4 import BeautifulSoup
from urllib.request import urlopen, Request
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import matplotlib.pyplot as plt

def predictor(ticker):
    print('-----------------------Stock Price Predictor---------------------')
    today = date.today()
    currentDate = today.strftime("%Y-%m-%d")
    df = web.DataReader(ticker, data_source='yahoo', start='2010-01-01', end=currentDate)

    data = df.filter(['Close'])
    dataset = data.values
    
    #Made training data 80% of data, to test on remaining 20%
    train_data_len = math.ceil(len(dataset)*.8)

    #Scaling the data
    scaler=MinMaxScaler(feature_range=(0,1))
    scaled_data=scaler.fit_transform(dataset)

    #Creating the training data set
    train_data=scaled_data[:train_data_len, :]

    #Splitting data into x_train and y_train data sets
    x_train, y_train = [], []

    #Creating a list that contrains the last 60 day prices for each element(date)
    for i in range(60, len(train_data)):
        x_train.append(train_data[i-60:i, 0])
        y_train.append(train_data[i, 0])

    #Converting x_train and y_train into numpy array
    x_train, y_train = np.array(x_train), np.array(y_train)

    #Reshape Data
    x_train=np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

    #Building LSTM model
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))
    #model.add(Dropout(0.2))
    model.add(LSTM(units=50, return_sequences=False))
    model.add(Dense(25))
    #model.add(Dropout(0.2))
    model.add(Dense(1))

    #Compile the model
    model.compile(optimizer='adam', loss='mean_squared_error')

    #Train the model
    model.fit(x_train, y_train, batch_size=1, epochs=1)

    #Create the testing data set
    test_data=scaled_data[train_data_len-60:, :]

    x_test, y_test = [], []

    for i in range(60, len(test_data)):
        x_test.append(test_data[i-60:i, 0])

    #Converting x_test to numpy attay
    x_test = np.array(x_test)

    #Reshape the Data
    x_test=np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

    #Get models tested predicted price values
    preds = model.predict(x_test)
    preds = scaler.inverse_transform(preds)

    #Plot data to see accuracy
    train = data[:train_data_len]
    valid = data[train_data_len:]
    valid['Predictions'] = preds

    #Visualize data
    plt.figure(figsize=(16,8))
    plt.title("Modeled Data for "+ticker+" Stocks")
    plt.xlabel('Date', fontsize=18)
    plt.ylabel('Closing Price', fontsize=18)
    plt.plot(train['Close'])
    plt.plot(valid[['Close', 'Predictions']])
    plt.legend(['Train', 'Valid', 'Predicted'], loc='lower right')
    plt.show()

#Stock News Sentimental Analysis
def news_analysis(ticker):
    print('-----------------------Stock News Analysis---------------------')
    
    #We will get the articles to analyze from Finviz
    finviz_url = 'https://finviz.com/quote.ashx?t=' 
    
    tables = {}

    url = finviz_url + ticker #adjusting url according to the given ticker
    resp = urlopen(Request(url=url,headers={'user-agent': 'my-app/0.0.1'}) )
    source_code = BeautifulSoup(resp, features='lxml')
    news_table = source_code.find(id='news-table')
    tables[ticker] = news_table

    parsed_news = []
    today = datetime.now()
    subtract_days = timedelta(2)
    past_date = today-subtract_days

    for x in tables[ticker].findAll('tr'):
        headline = x.a.get_text() 
        date_scrape = x.td.text.split()

        if len(date_scrape) == 1:
            time = date_scrape[0]
            
        else:
            date = date_scrape[0]
            time = date_scrape[1]
            article_date = datetime.strptime(date, '%b-%d-%y')

        if article_date.strftime('%Y-%m-%d') >= past_date.strftime('%Y-%m-%d'):       
            parsed_news.append([ticker, date, time, headline])
    
    # Sentimental Analysis
    analyzer = SentimentIntensityAnalyzer()

    columns = ['Ticker', 'Date', 'Time', 'Headline']
    news = pd.DataFrame(parsed_news, columns=columns)
    scores = news['Headline'].apply(analyzer.polarity_scores).tolist()

    df_scores = pd.DataFrame(scores)
    news = news.join(df_scores, rsuffix='_right')
    
    # View Data 
    news_dict = {name: news.loc[news['Ticker'] == name] for name in news['Ticker']}

    dataframe = news_dict[ticker]
    dataframe = dataframe.set_index('Ticker')
    dataframe = dataframe.drop(columns = ['Headline'])
    print (dataframe.head())
        
    mean = round(dataframe['compound'].mean(), 2)

    print("\nMean Sentiment of articles (-1 (Negative), 0 (Neutral), 1 (Positive)): ", mean)

#predictor(sys.argv[1])
news_analysis(sys.argv[1])





