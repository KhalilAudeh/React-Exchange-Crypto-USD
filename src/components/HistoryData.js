import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "../App.css";
import "react-datepicker/dist/react-datepicker.css";
import lodash from "lodash";

const PAGE_SIZE = 4;

const HistoryData = (props) => {
  // get props data and pass to useState for the initial load
  const history = props.historical_data;
  const [historicalData, setHistoricalData] = useState([]);

  // add the below use states for dates and selected type
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [type, setType] = useState("All");

  // states for paginated history and current page
  const [paginatedHistoricalData, setPaginatedHistoricalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // when history data changes as trigger, update the component data using the below
  useEffect(() => {
    setHistoricalData(history);

    // set paginated data according to page size using lodash methods
    setPaginatedHistoricalData(lodash(history).slice(0).take(4).value());
  }, [history]);

  // when user clicks filter, this function will be executed
  const filter = () => {
    // if user selects start and end dates, filter can be applied
    let moment_array = [],
      selectedStartDay = startDate.getDate(),
      selectedStartMonth = startDate.getMonth() + 1,
      selectedEndDay = startDate.getDate(),
      selectedEndMonth = startDate.getMonth() + 1;

    const filtered = history.filter((data) => {
      // splitting data moment from table to get day and month
      moment_array = data.moment.split("/");

      // applying filter by passing start/end dates and type selected
      if (type !== "All") {
        if (startDate === null && endDate === null) {
          return type === data.type;
        } else {
          // if not all, then show only specified type
          return (
            moment_array[0] >= selectedStartDay &&
            moment_array[1] >= selectedStartMonth &&
            moment_array[0] <= selectedEndDay &&
            moment_array[1] <= selectedEndMonth &&
            type === data.type
          );
        }
      } else {
        return (
          moment_array[0] >= selectedStartDay &&
          moment_array[1] >= selectedStartMonth &&
          moment_array[0] <= selectedEndDay &&
          moment_array[1] <= selectedEndMonth
        );
      }
    });

    // set the filtered array of data to the history table data
    setHistoricalData(filtered);
    setPaginatedHistoricalData(filtered);
  };

  // for sort by dropdown of type
  const sortByType = (event) => {
    const selected_type = event.target.value;
    setType(selected_type);
  };

  // sorting ascending/descending for date/time
  // reverse the given history array as the history is sorted by default by time and live data
  const sortDateTimeByAsc = () => {
    document.getElementById("date-time-arrow").innerHTML = "&#8593;&#9776; ";

    const sorted_array = [...historicalData].reverse();

    setHistoricalData(sorted_array);
    setPaginatedHistoricalData(sorted_array);
  };

  const sortDateTimeByDesc = () => {
    document.getElementById("date-time-arrow").innerHTML = "&#8595;&#9776; ";

    const sorted_array = [...historicalData].reverse();

    setHistoricalData(sorted_array);
    setPaginatedHistoricalData(sorted_array);
  };

  // sorting ascending/descending for crypto alphabetically
  const sortCryptoByAsc = (e) => {
    document.getElementById("currency-from-arrow").innerHTML =
      "&#8593;&#9776; ";

    let field = e.currentTarget.getAttribute("data-value");

    const sorted_array = [...historicalData].sort((obj1, obj2) =>
      obj1[field].localeCompare(obj2[field])
    );

    setHistoricalData(sorted_array);
    setPaginatedHistoricalData(sorted_array);
  };

  const sortCryptoByDesc = (e) => {
    document.getElementById("currency-from-arrow").innerHTML =
      "&#8595;&#9776; ";

    let field = e.currentTarget.getAttribute("data-value");

    const sorted_array = [...historicalData].sort((obj1, obj2) =>
      obj2[field].localeCompare(obj1[field])
    );

    setHistoricalData(sorted_array);
    setPaginatedHistoricalData(sorted_array);
  };

  // sorting ascending/descending for crypto/currency amounts
  const sortCryptoAmountByAsc = (e) => {
    document.getElementById("crypto-amount-arrow").innerHTML =
      "&#8593;&#9776; ";

    let field = e.currentTarget.getAttribute("data-value");

    const sorted_array = [...historicalData].sort(
      (obj1, obj2) => obj1[field] - obj2[field]
    );

    setHistoricalData(sorted_array);
    setPaginatedHistoricalData(sorted_array);
  };

  const sortCryptoAmountByDesc = (e) => {
    document.getElementById("crypto-amount-arrow").innerHTML =
      "&#8595;&#9776; ";

    let field = e.currentTarget.getAttribute("data-value");

    const sorted_array = [...historicalData].sort(
      (obj1, obj2) => obj2[field] - obj1[field]
    );

    setHistoricalData(sorted_array);
    setPaginatedHistoricalData(sorted_array);
  };

  const sortCurrencyAmountByAsc = (e) => {
    document.getElementById("currency-amount-arrow").innerHTML =
      "&#8593;&#9776; ";

    let field = e.currentTarget.getAttribute("data-value");

    const sorted_array = [...historicalData].sort(
      (obj1, obj2) => obj1[field] - obj2[field]
    );

    setHistoricalData(sorted_array);
    setPaginatedHistoricalData(sorted_array);
  };

  const sortCurrencyAmountByDesc = (e) => {
    document.getElementById("currency-amount-arrow").innerHTML =
      "&#8595;&#9776; ";

    let field = e.currentTarget.getAttribute("data-value");

    const sorted_array = [...historicalData].sort(
      (obj1, obj2) => obj2[field] - obj1[field]
    );

    setHistoricalData(sorted_array);
    setPaginatedHistoricalData(sorted_array);
  };

  // for pagination create page count
  const page_count = historicalData ? Math.ceil(historicalData.length / 4) : 0;

  // store number of pages in an array to map over it each time
  // lodash.chunk(arr, 4)
  const pages = lodash.range(1, page_count + 1);

  // creating function for pagination to update current page and paginated history data
  const pagination = (page) => {
    const next_page_index = (page - 1) * 4;

    setCurrentPage(page);
    setPaginatedHistoricalData(
      lodash(history).slice(next_page_index).take(4).value()
    );
  };

  return (
    <div>
      {/* history section */}
      <div className="row mt-5">
        <div className="col mx-3 mx-md-0">
          <h4 className="fw-bold section-title">History</h4>
        </div>
      </div>

      <br />

      <div className="row">
        {/* date picker filtering */}
        <div className="col-5 col-md-2 mx-3 mx-md-0">
          <label className="col-12 text-muted mb-1">Start Date</label>

          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            placeholderText="Select                     &#128198;"
            className="col-12 p-2"
            isClearable
          />
        </div>

        <div className="col-5 col-md-2">
          <label className="col-12 text-muted mb-1">End Date</label>

          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            placeholderText="Select                     &#128198;"
            className="col-12 p-2"
            isClearable
          />
        </div>

        {/* history type dropdown filtering */}
        <div className="col-5 col-md-2 mt-4 mt-md-0 mx-3 mx-md-0">
          <label className="col-12 text-muted mb-1">Type</label>

          <div className="select">
            <select
              onChange={sortByType}
              className="col-12 form-select py-2"
              required
            >
              <option value="All">All</option>
              <option value="Live Price">Live Price</option>
              <option value="Exchanged">Exchanged</option>
            </select>
          </div>
        </div>

        {/* filter button to pass in user inputs and apply related filtering */}
        <div className="col-5 col-md-1 mt-4 mt-md-0">
          <br />
          <button
            className="col mt-1 filter-btn px-4 py-2 d-none d-md-block"
            onClick={filter}
          >
            Filter
          </button>
          <button
            className="col-12 mt-1 filter-btn px-4 py-2 d-block d-md-none"
            onClick={filter}
          >
            Filter
          </button>
        </div>
      </div>

      {/* Error handling when data is not found after a filter has been applied */}
      {historicalData.length < 1 && (
        <div
          className="alert alert-warning col-11 col-md-6 mx-2 mx-md-0 mt-3"
          role="alert"
        >
          There are no related data for your applied filters
        </div>
      )}

      {/* handling when user clicks filter without selecting start and end dates */}
      {startDate === null && endDate === null && (
        <div
          className="alert alert-warning col-11 col-md-6 mx-2 mx-md-0 mt-3"
          role="alert"
        >
          Please make sure to select the start and end dates if you want to
          filter
        </div>
      )}

      {/* history data table web version */}
      <table className="table table-borderless mt-5 d-none d-md-table">
        {/* table column field titles */}
        <thead>
          <tr>
            <th scope="col" className="fw-bold">
              <span
                className="sort-arrow"
                id="date-time-arrow"
                onClick={sortDateTimeByAsc}
                onDoubleClick={sortDateTimeByDesc}
              >
                &#8593;&#9776;{" "}
              </span>
              Date &amp; Time
            </th>
            <th scope="col" className="fw-normal">
              <span
                className="sort-arrow"
                id="currency-from-arrow"
                onClick={sortCryptoByAsc}
                onDoubleClick={sortCryptoByDesc}
                data-value="crypto"
              >
                &#8593;&#9776;{" "}
              </span>
              Currency From
            </th>
            <th scope="col" className="fw-normal">
              <span
                className="sort-arrow"
                id="crypto-amount-arrow"
                onClick={sortCryptoAmountByAsc}
                onDoubleClick={sortCryptoAmountByDesc}
                data-value="amount_1"
              >
                &#8593;&#9776;{" "}
              </span>
              Amount 1
            </th>
            <th scope="col" className="fw-normal">
              Currency To
            </th>
            <th scope="col" className="fw-normal">
              <span
                className="sort-arrow"
                id="currency-amount-arrow"
                onClick={sortCurrencyAmountByAsc}
                onDoubleClick={sortCurrencyAmountByDesc}
                data-value="amount_2"
              >
                &#8593;&#9776;{" "}
              </span>
              Amount 2
            </th>
            <th scope="col" className="fw-normal">
              Type
            </th>
          </tr>
        </thead>

        {/* table data for each related column */}
        <tbody>
          {/* use paginatedHistoricalData with respect to pagination count and size */}
          {paginatedHistoricalData.map((data) => {
            if (data.crypto !== "" && data.amount_1 !== "") {
              return (
                <tr>
                  <th scope="row" className="fw-normal">
                    {data.moment}
                  </th>
                  <td>{data.crypto}</td>
                  <td>{data.amount_1}</td>
                  <td>{data.currency_to}</td>
                  <td>{data.amount_2}</td>
                  <td className="fw-bold live-price data-type">{data.type}</td>
                </tr>
              );
            }
            return "";
          })}
        </tbody>
      </table>

      {/* history data mobile version */}
      <div className="row mt-5 d-block d-md-none">
        {/* use paginatedHistoricalData with respect to pagination count and size */}
        {paginatedHistoricalData.map((data) => {
          if (data.crypto !== "" && data.amount_1 !== "") {
            return (
              <div className="col-10 mobile-data-history mb-4 mx-auto p-4">
                <div className="row fw-bold mb-2 justify-content-between">
                  <div className="col-8 p-0">
                    {data.crypto} &#8594; {data.currency_to}
                  </div>
                  {data.type === "Live Price" ? (
                    <div className="col-1 approved-dot"></div>
                  ) : (
                    <div className="col-1 exchanged-dot"></div>
                  )}
                </div>

                <div className="row">
                  Amount &nbsp;&nbsp;&nbsp; {data.crypto} &nbsp;&nbsp;&nbsp;{" "}
                  {data.amount_1}
                </div>
              </div>
            );
          }
          return "";
        })}
      </div>

      {/* history table pagination */}
      <nav className="mt-4 mx-3">
        <ul className="pagination">
          {pages.includes(currentPage - 1) && (
            <span
              className="prev-next-btn m-2"
              onClick={() => {
                pagination(currentPage - 1);
              }}
            >
              &#8592; Previous
            </span>
          )}

          {pages.map((page) => (
            <li
              className={
                page === currentPage ? "page-item active" : "page-item"
              }
            >
              <span className="page-link mx-1" onClick={() => pagination(page)}>
                {page}
              </span>
            </li>
          ))}

          {pages.includes(currentPage + 1) && (
            <span
              className="prev-next-btn m-2"
              onClick={() => {
                pagination(currentPage + 1);
              }}
            >
              Next &#8594;
            </span>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default HistoryData;
