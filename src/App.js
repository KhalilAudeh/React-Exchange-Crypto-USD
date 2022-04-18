import React, { Component } from "react";
import ExchangeToolbar from "./components/ExchangeToolbar";
import HistoryData from "./components/HistoryData";
import "./App.css";
import axios from "axios";

const CONFIG_INTERVAL = 300000;
const BTC_LABEL = "BTC - Bitcoin";
const LIVE_LABEL = "Live Price";
const EXCHANGED_LABEL = "Exchanged";
const USD_LABEL = "USD";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // this will hold the API response
      cryptos: [],
      // the below to be used for the exchange rates converter
      currency_from: 0,
      crypto_label: BTC_LABEL,
      exchanged_amount: 1,
      result: 1,
      // historical data for table component
      historical_data: [
        {
          moment: "",
          crypto: "",
          amount_1: Number,
          currency_to: "",
          amount_2: Number,
          type: "",
        },
      ],
      moment_format: "",
    };

    // binding to make `this` work in the callbacks
    this.getAPIData = this.getAPIData.bind(this);
    this.handleChangeFrom = this.handleChangeFrom.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    this.updateUSDAmount = this.updateUSDAmount.bind(this);
    this.saveExchange = this.saveExchange.bind(this);
    this.getMoment = this.getMoment.bind(this);
  }

  // use axios http client library to make public API calls
  // use GET to make the API call and get the response needed from CryptoCompare API for multiple symbols price
  getAPIData() {
    axios
      .get(
        "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR"
      )
      .then((response) => {
        this.setState(
          (prevState) => ({
            cryptos: response.data,
            currency_from: response.data["BTC"].USD,
            exchanged_amount: this.state.exchanged_amount,
            result:
              this.state.exchanged_amount * response.data["BTC"].USD,
            historical_data: [
              ...prevState.historical_data,
              {
                moment: this.state.moment_format,
                crypto: BTC_LABEL,
                amount_1: this.state.exchanged_amount,
                currency_to: USD_LABEL,
                amount_2:
                  this.state.exchanged_amount * response.data["BTC"].USD,
                type: LIVE_LABEL,
              },
            ],
          }),
          () => {
            console.log("component on mount", this.state);
          }
        );
      });
  }

  // will execute everytime this component loads
  componentDidMount() {
    this.getMoment();

    this.getAPIData();
    // removing the first empty object
    this.state.historical_data.shift();

    // load API data rates every 5 minutes
    this.interval = setInterval(() => this.getAPIData(), CONFIG_INTERVAL);
  }

  // used so that component doesn't go into infinite loop while using interval
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // handle change of the crypto selections
  handleChangeFrom(event) {
    this.getMoment();

    // getting the index then the label related to the selected option
    const index = event.nativeEvent.target.selectedIndex;
    const crypto_label = event.nativeEvent.target[index].text;

    // preparing the new object data to be pushed to the historical_data array
    // by updating the crypto label changed/selected
    let newData = {
      moment: this.state.moment_format,
      crypto: crypto_label,
      amount_1: this.state.exchanged_amount,
      currency_to: USD_LABEL,
      amount_2: this.state.exchanged_amount * event.target.value,
      type: LIVE_LABEL,
    };

    // pushing the new object data to the existing history array with previous state
    this.setState(
      (prevState) => ({
        historical_data: [...prevState.historical_data, newData],
        currency_from: event.target.value,
        result: prevState.exchanged_amount * event.target.value,
        crypto_label: crypto_label,
      }),
      () => console.log("change from: ", this.state)
    );
  }

  // update the result if the user changes amount input for crypto
  updateAmount(event) {
    this.getMoment();

    // preparing the new object data to be pushed to the historical_data array
    // by updating checking on crypto rate to know what type it is and user input amount
    let newData = {
      moment: this.state.moment_format,
      crypto: this.state.crypto_label,
      amount_1: event.target.value,
      currency_to: USD_LABEL,
      amount_2: this.state.currency_from * event.target.value,
      type: LIVE_LABEL,
    };

    // pushing the new object data to the existing history array with previous state
    this.setState(
      (prevState) => ({
        historical_data: [...prevState.historical_data, newData],
        exchanged_amount: event.target.value,
        result: prevState.currency_from * event.target.value,
      }),
      () => console.log("change amount", this.state)
    );
  }

  // update the crypto amount input in case user adds input amount for USD
  updateUSDAmount(event) {
    this.getMoment();

    // preparing the new object data to be pushed to the historical_data array
    // by updating checking on crypto rate to know what type it is and user input amount
    let newData = {
      moment: this.state.moment_format,
      crypto: this.state.crypto_label,
      amount_1: event.target.value / this.state.currency_from,
      currency_to: USD_LABEL,
      amount_2: event.target.value,
      type: LIVE_LABEL,
    };

    // pushing the new object data to the existing history array with previous state
    this.setState(
      (prevState) => ({
        historical_data: [...prevState.historical_data, newData],
        exchanged_amount: event.target.value / prevState.currency_from,
        result: event.target.value,
      }),
      () => console.log("change amount", this.state)
    );
  }

  // save exchange into history array and update data type to exchanged
  saveExchange(e) {
    // to prevent from refreshing the page
    e.preventDefault();

    // updating the last data type to exchanged when user clicks on exchange button
    let updated_data = this.state.historical_data;
    updated_data[updated_data.length - 1].type = EXCHANGED_LABEL;

    // style the new data type in the table
    document.getElementsByClassName("data-type")[
      updated_data.length - 1
    ].style.color = "#6368DF";

    this.setState({
      historical_data: updated_data,
    });
  }

  // get the moment so be used in table component on live/exchanged price in given format
  // call this method in the methods while handling any change
  getMoment() {
    const today = new Date();

    const moment_format =
      today.getDate() +
      "/" +
      (today.getMonth() + 1) +
      "/" +
      today.getFullYear() +
      " " +
      today.getHours() +
      ":" +
      today.getMinutes();

    this.setState({ moment_format: moment_format });
  }

  render() {
    return (
      <div className="container my-5 mx-auto">
        <ExchangeToolbar
          cryptos={this.state.cryptos}
          currency_from={this.state.currency_from}
          exchanged_amount={this.state.exchanged_amount}
          result={this.state.result}
          handleChangeFrom={this.handleChangeFrom}
          updateAmount={this.updateAmount}
          updateUSDAmount={this.updateUSDAmount}
          saveExchange={this.saveExchange}
        />

        <HistoryData historical_data={this.state.historical_data} />
      </div>
    );
  }
}

export default App;
