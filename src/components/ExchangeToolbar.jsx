import React from "react";
import "../App.css";
import Select, { components } from "react-select";

const { Option } = components;

const ExchangeToolbar = (props) => {
  // saving each in variable to make use in down in JSX
  let cryptos = props.cryptos;
  let options = [];

  // mapping through cryptos to add array for options with their related labels and icons
  Object.keys(cryptos).map((key) =>
    key === "BTC"
      ? options.push({
          value: cryptos[key].USD,
          label: "BTC - Bitcoin",
          icon: "btc-logo.png",
        })
      : options.push({
          value: cryptos["ETH"].USD,
          label: "ETH - Ethereum",
          icon: "eth-logo.jpg",
        })
  );

  const IconOption = (args) => {
    return (
      <Option {...args}>
        <img
          src={require("../icons/" + args.data.icon)}
          style={{ width: 40 }}
          alt={args.data.label}
        />
        {args.data.label}
      </Option>
    );
  };

  return (
    <div>
      {/* exchange section */}
      <div className="row">
        <div className="col mx-3 mx-md-0">
          <h4 className="fw-bold section-title">Exchange</h4>
        </div>
      </div>
      <br />

      <form className="row justify-content-center">
        {/* crypto selections */}
        <div className="col-11 col-md-3">
          <label className="col-12 text-muted mb-1">Currency from</label>

            <Select
              defaultValue={props.currency_from}
              onChange={props.handleChangeFrom}
              options={options}
              components={{
                Option: IconOption,
              }}
              className="col-12"
              placeholder="Select"
            />
        </div>
        {/* crypto amount to be exchanged */}
        <div className="col-11 col-md-2 mt-4 mt-md-0">
          <label className="col-12 text-muted mb-1">Amount</label>

          <input
            type="number"
            value={props.exchanged_amount}
            onChange={props.updateAmount}
            className="col-12 form-control py-2"
            placeholder="Enter the amount"
          />
        </div>
        <div className="col-1 text-center m-auto d-none d-md-block fw-bold">
          <br />=
        </div>
        {/* currencies selection */}
        <div className="col-11 col-md-3 mt-4 mt-md-0">
          <label className="col-12 text-muted mb-1">Currency to</label>

          <select className="col-12 form-select py-2" disabled>
            <option selected>USD - American Dollar</option>
          </select>
        </div>
        {/* amount display depending on the crypto inputs */}
        <div className="col-11 col-md-2 mt-4 mt-md-0">
          <label className="col-12 text-muted mb-1">Amount</label>

          <input
            type="number"
            value={props.result}
            onChange={props.updateUSDAmount}
            className="col-12 form-control py-2"
            placeholder="Enter the amount"
          />
        </div>
        {/* save button to save the exchanged data rate */}
        <div className="col-11 col-md-1">
          <br />
          <button
            className="col mt-1 save-btn px-4 py-2 d-none d-md-block"
            onClick={props.saveExchange}
          >
            Exchange
          </button>
          <button
            className="col-12 mt-1 save-btn px-4 py-2 d-block d-md-none"
            onClick={props.saveExchange}
          >
            Exchange
          </button>
        </div>
      </form>

      {/* Error handling for user input */}
      {props.exchanged_amount === "" && (
        <div
          className="alert alert-danger col-11 col-md-6 mx-2 mx-md-0 mt-2"
          role="alert"
        >
          Error: Please make sure to fill in the related crypto amount!
        </div>
      )}
    </div>
  );
};

export default ExchangeToolbar;
