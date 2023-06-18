import React, { useState } from 'react'

const SearchTicker = () => {
    const [tickerSymbol, setTickerSymbol] = useState('')

    const tickerAPI = () => {
        Axios.post('http://localhost:3001/api/ticker', {
            tickerSymbol: tickerSymbol
        }).then(() => {
            alert('sent')
        })
    }
    return (
        <div>

            <h3 id="search-title">Get Predictions From Our Powerful ML Algorithm</h3>
            <form action="" onSubmit={e => e.preventDefault()}>
                <input type="text" onChange={(e) => {
                    setTickerSymbol(e.target.value)
                }} id="tickerSymbol" size="35" placeholder="Search for news, tickers, or companies" />
                <p>
                    <button onClick={tickerAPI}>Search</button>
                </p>
            </form>
        </div>
    )
}

export default SearchTicker
