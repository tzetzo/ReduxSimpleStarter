import React, { Component } from "react";
import ReactDOM from "react-dom";
// import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
import $ from "jquery";

export class CommentList extends Component {
  // static propTypes = {
  //   data: PropTypes.array.isRequired
  // };

  renderProducts() {
    return this.props.data.map((product, index) => {
      return <li key={index}>{product.name}</li>;
    });
  }

  render() {
    return (
      <div id="project-products" className="productsList">
        <ul>{this.renderProducts()}</ul>
      </div>
    );
  }
}

export class App extends Component {
  // static propTypes = {
  //   url: PropTypes.string.isRequired,
  //   author: PropTypes.string.isRequired,
  //   perPage: PropTypes.number.isRequired
  // };

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      page: 1
    };
  }

  loadCommentsFromServer() {
    $.ajax({
      url: this.props.url,
      data: { limit: this.props.perPage, page: this.state.page }, //this is where we send the request requiring the necessary number of records & the page #
      dataType: "json",
      type: "GET",

      success: data => {
        console.log("returned: ", data);
        this.setState({
          data: data.rows,
          pageCount: Math.ceil(data.count / this.props.perPage)
        });
      },

      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString()); // eslint-disable-line
      }
    });
  }

  componentDidMount() {
    this.loadCommentsFromServer();
  }

  handlePageClick = data => {
    console.log(data);
    let page = data.selected + 1;
    // let page = Math.ceil(selected * this.props.perPage);

    this.setState({ page: page }, () => {
      this.loadCommentsFromServer();
    });
  };

  render() {
    return (
      <div className="commentBox">
        <CommentList data={this.state.data} />
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={this.handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App
    url={"https://backendapi.turing.com/products"}
    author={"adele"}
    perPage={20}
  />,
  document.getElementById("root")
);
