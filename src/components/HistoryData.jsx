import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "../App.css";
import "react-datepicker/dist/react-datepicker.css";
import lodash from "lodash";
import Modal from "react-modal";

const PAGE_SIZE = 4;
const MODAL_CUSTOM_STYLE = {
  content: {
    top: "35%",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -25%)",
    border: "unset",
    background: "#FFFFFF",
    boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.08)",
    borderRadius: "16px 16px 0px 0px",
    color: "#000000",
  },
};

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

  // state boolean for clicking on arrows
  const [clickedDateArrow, setClickedDateArrow] = useState(false);
  const [clickedCryptoArrow, setClickedCryptoArrow] = useState(false);
  const [clickedCryptoAmountArrow, setClickedCryptoAmountArrow] =
    useState(false);
  const [clickedCurrencyAmountArrow, setClickedCurrencyAmountArrow] =
    useState(false);

  // state used for clicked modal data details
  const [dataModal, setDataModal] = useState({});
  const [showModal, setShowModal] = useState(false);

  // when history data changes as trigger, update the component data using the below
  useEffect(() => {
    setHistoricalData(history);

    // set paginated data according to page size using lodash methods
    setPaginatedHistoricalData(
      lodash(history).slice(0).take(PAGE_SIZE).value()
    );
  }, [history]);

  // when user clicks filter, this function will be executed
  const filter = () => {
    // if user selects start and end dates, filter can be applied
    let moment_array = [],
      selectedStartDay = "",
      selectedStartMonth = "",
      selectedEndDay = "",
      selectedEndMonth = "";

    const filtered = history.filter((data) => {
      // splitting data moment from table to get day and month
      moment_array = data.moment.split("/");

      // applying filter by passing start/end dates and type selected
      if (startDate !== null && endDate !== null) {
        selectedStartDay = startDate.getDate();
        selectedStartMonth = startDate.getMonth() + 1;
        selectedEndDay = endDate.getDate();
        selectedEndMonth = endDate.getMonth() + 1;

        if (type !== "All") {
          // if not all, then show only specified type
          return (
            moment_array[0] >= selectedStartDay &&
            moment_array[1] >= selectedStartMonth &&
            moment_array[0] <= selectedEndDay &&
            moment_array[1] <= selectedEndMonth &&
            type === data.type
          );
        } else {
          return (
            moment_array[0] >= selectedStartDay &&
            moment_array[1] >= selectedStartMonth &&
            moment_array[0] <= selectedEndDay &&
            moment_array[1] <= selectedEndMonth
          );
        }
      } else {
        // if not all, then show only specified type
        return type === data.type;
      }
    });

    // set the filtered array of data to the history table data
    setHistoricalData(filtered);
    setPaginatedHistoricalData(
      lodash(filtered).slice(0).take(PAGE_SIZE).value()
    );
  };

  // for sort by dropdown of type
  const sortByType = (event) => {
    const selected_type = event.target.value;
    setType(selected_type);
  };

  // sorting ascending/descending for date/time
  // reverse the given history array as the history is sorted by default by time and live data
  const sortDateTime = () => {
    setClickedDateArrow(!clickedDateArrow);

    const sorted_array = [...historicalData].reverse();

    setHistoricalData(sorted_array);
    setPaginatedHistoricalData(
      lodash(sorted_array).slice(0).take(PAGE_SIZE).value()
    );
  };

  // sorting ascending/descending for crypto alphabetically
  const sortCrypto = (e) => {
    setClickedCryptoArrow(!clickedCryptoArrow);

    const field = e.currentTarget.getAttribute("data-value");

    let sorted_array = [];

    if (clickedCryptoArrow) {
      sorted_array = [...historicalData].sort((obj1, obj2) =>
        obj1[field].localeCompare(obj2[field])
      );
    } else {
      sorted_array = [...historicalData].sort((obj1, obj2) =>
        obj2[field].localeCompare(obj1[field])
      );
    }

    setHistoricalData(sorted_array);
    setPaginatedHistoricalData(
      lodash(sorted_array).slice(0).take(PAGE_SIZE).value()
    );
  };

  // sorting ascending/descending for crypto/currency amounts
  const sortCryptoAmount = (e) => {
    setClickedCryptoAmountArrow(!clickedCryptoAmountArrow);

    const field = e.currentTarget.getAttribute("data-value");

    let sorted_array = [];

    if (clickedCryptoAmountArrow) {
      sorted_array = [...historicalData].sort(
        (obj1, obj2) => obj2[field] - obj1[field]
      );
    } else {
      sorted_array = [...historicalData].sort(
        (obj1, obj2) => obj1[field] - obj2[field]
      );
    }

    setHistoricalData(sorted_array);
    setPaginatedHistoricalData(
      lodash(sorted_array).slice(0).take(PAGE_SIZE).value()
    );
  };

  const sortCurrencyAmount = (e) => {
    setClickedCurrencyAmountArrow(!clickedCurrencyAmountArrow);

    const field = e.currentTarget.getAttribute("data-value");

    let sorted_array = [];

    if (clickedCurrencyAmountArrow) {
      sorted_array = [...historicalData].sort(
        (obj1, obj2) => obj2[field] - obj1[field]
      );
    } else {
      sorted_array = [...historicalData].sort(
        (obj1, obj2) => obj1[field] - obj2[field]
      );
    }

    setHistoricalData(sorted_array);
    setPaginatedHistoricalData(
      lodash(sorted_array).slice(0).take(PAGE_SIZE).value()
    );
  };

  // for pagination create page count
  let page_count = historicalData
    ? Math.ceil(historicalData.length / PAGE_SIZE)
    : 0;

  // store number of pages in an array to map over it each time
  let pages = lodash.range(1, page_count + 1);

  // creating function for pagination to update current page and paginated history data
  const pagination = (page) => {
    let next_page_index = (page - 1) * PAGE_SIZE;

    setCurrentPage(page);
    setPaginatedHistoricalData(
      lodash(history).slice(next_page_index).take(PAGE_SIZE).value()
    );
  };

  // get data details for modal use on mobile version
  const getDataDetails = (data) => {
    setDataModal(data);
    setShowModal(true);
  };

  const hideModal = () => {
    setShowModal(false);
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
            placeholderText="Select                     📅"
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
            placeholderText="Select                     📅"
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
              {!clickedDateArrow && (
                <span className="sort-arrow" onClick={sortDateTime}>
                  &#8593;&#9776;{" "}
                </span>
              )}
              {clickedDateArrow && (
                <span className="sort-arrow" onClick={sortDateTime}>
                  &#8595;&#9776;{" "}
                </span>
              )}
              Date &amp; Time
            </th>
            <th scope="col" className="fw-normal">
              {!clickedCryptoArrow && (
                <span
                  className="sort-arrow"
                  data-value="crypto"
                  onClick={sortCrypto}
                >
                  &#8593;&#9776;{" "}
                </span>
              )}
              {clickedCryptoArrow && (
                <span
                  className="sort-arrow"
                  data-value="crypto"
                  onClick={sortCrypto}
                >
                  &#8595;&#9776;{" "}
                </span>
              )}
              Currency From
            </th>
            <th scope="col" className="fw-normal">
              {!clickedCryptoAmountArrow && (
                <span
                  className="sort-arrow"
                  onClick={sortCryptoAmount}
                  data-value="amount_1"
                >
                  &#8593;&#9776;{" "}
                </span>
              )}
              {clickedCryptoAmountArrow && (
                <span
                  className="sort-arrow"
                  onClick={sortCryptoAmount}
                  data-value="amount_1"
                >
                  &#8595;&#9776;{" "}
                </span>
              )}
              Amount 1
            </th>
            <th scope="col" className="fw-normal">
              Currency To
            </th>
            <th scope="col" className="fw-normal">
              {!clickedCurrencyAmountArrow && (
                <span
                  className="sort-arrow"
                  onClick={sortCurrencyAmount}
                  data-value="amount_2"
                >
                  &#8593;&#9776;{" "}
                </span>
              )}
              {clickedCurrencyAmountArrow && (
                <span
                  className="sort-arrow"
                  onClick={sortCurrencyAmount}
                  data-value="amount_2"
                >
                  &#8595;&#9776;{" "}
                </span>
              )}
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
                  <td
                    className="fw-bold"
                    style={{
                      color: data.type === "Live Price" ? "#49cd5e" : "#6368DF",
                    }}
                  >
                    {data.type}
                  </td>
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
              <div
                className="col-10 mobile-data-history mb-4 mx-auto p-4"
                onClick={getDataDetails.bind(this, data)}
              >
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

      {/* react modal popup for data details on mobile version */}
      <Modal
        isOpen={showModal}
        onRequestClose={hideModal}
        style={MODAL_CUSTOM_STYLE}
      >
        <div className="row fw-bold mt-2">
          <div className="col">
            <h6 className="fw-bold">Exchange</h6>
          </div>
          <div
            className="col-1 p-0"
            onClick={hideModal}
            style={{ cursor: "pointer" }}
          >
            &#10006;
          </div>
        </div>

        <hr className="my-4" />

        {/* date/time data */}
        <div className="row">
          <div className="col-5">
            <label>Date &amp; Time</label>
          </div>

          <div className="col">
            <span>{dataModal.moment}</span>
          </div>
        </div>

        {/* data status */}
        <div className="row my-2">
          <div className="col-5 text-muted">
            <label>Status</label>
          </div>

          <div className="col">
            {dataModal.type === "Live Price" && (
              <div className="row px-2">
                <div className="col-2 approved-dot"></div>
                <span className="col approved-status">Approved</span>
              </div>
            )}

            {dataModal.type === "Exchanged" && (
              <div className="row px-2">
                <div className="col-2 exchanged-dot"></div>
                <span className="col exchanged-status">Exchanged</span>
              </div>
            )}
          </div>
        </div>

        {/* from currency: crypto */}
        <div className="row">
          <div className="col-5 text-muted">
            <label>From</label>
          </div>

          <div className="col">
            <span>{dataModal.crypto}</span>
          </div>
        </div>

        {/* to currency: USD */}
        <div className="row my-2">
          <div className="col-5 text-muted">
            <label>To</label>
          </div>

          <div className="col">
            <span>{dataModal.currency_to}</span>
          </div>
        </div>

        {/* crypto/USD amounts */}
        <div className="row">
          <div className="col-5 text-muted">
            <label>Amount</label>
          </div>

          <div className="col">
            <span>
              {dataModal.amount_1} {dataModal.crypto}
            </span>
          </div>
        </div>

        <div className="row my-2">
          <div className="col-5 text-muted">
            <label>Total</label>
          </div>

          <div className="col">
            <span>
              {"$ "}
              {dataModal.amount_2}
            </span>
          </div>
        </div>

        {/* close button */}
        <div className="row mt-4">
          <div className="col-11">
            <button
              className="col-12 mt-1 save-btn px-4 py-2"
              onClick={hideModal}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* history table pagination */}
      <nav className="mt-4 mx-3 mx-md-0">
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
