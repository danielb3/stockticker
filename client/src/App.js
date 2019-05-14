import React from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      input: "",
      error: "",
      stock: "",
      show: false,
      text: "Add +",
      stocks: [],
      prices: []
    };
    this.updateInput = this.updateInput.bind(this);
    this.lookup = this.lookup.bind(this);
    this.add = this.add.bind(this);
    this.addInput = this.addInput.bind(this);
    // this.displayStocks = this.displayStocks.bind(this);
    // this.price = this.price.bind(this);
  }

  addInput(e) {
    if (this.state.show == false) {
      this.setState({
        show: true,
        text: "Cancel"
      });
    } else {
      this.setState({
        show: false,
        text: "Add +"
      });
    }
  }

  updateInput(e) {
    this.setState({
      input: e.target.value
    });
  }

  lookup() {
    console.log("works")
    console.log(this.state.input)
    fetch(`https://financialmodelingprep.com/api/company/real-time-price/${this.state.input}?datatype=json`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data.symbol)
      this.setState({
        error: "",
        stock: data.symbol,
        show: false,
        text: "Add +"
      }, function addTo() {
            this.add()
            if (this.state.stock == "") {
              this.setState({
                error: "This is not a known stock symbol.  Please try again.  Ex. AAPL"
              })
            }
      })
    })
  }

add() {
  $.post("/add",
  {
    stock: this.state.stock,
  },
  function(data, status){
    console.log("Data: " + data + "\nStatus: " + status);
  });
}

componentWillMount() {
    $.get("/display", function(data, status){
      console.log("Data: "+JSON.stringify(data))
      this.setState({
        stocks: data
      })
    }.bind(this))
  }

componentDidMount() {
  this.timerID = setInterval(
    () => this.prices(),
    5000
  );
}

prices() {
    this.state.stocks.map((x, i) => 
    $.get(`https://financialmodelingprep.com/api/company/real-time-price/${{x}.x.symbol}?datatype=json`, function(data, status){
      console.log("Data: "+data)
      if (this.state.prices != JSON.parse([data])) {
        this.setState({
          prices: this.state.prices.concat(JSON.parse([data]))
        })
      } else {
        this.setState({
          prices: [].concat(JSON.parse([data]))
        })
      }
    }.bind(this)));
    console.log(this.state.prices.map(x => x.price))
  }

  render() {
    return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3"></div>
          <div className="col-md-6">
          {this.state.show &&
            <div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Stock Symbol</label>
                <input value={this.state.input} onChange={this.updateInput} type="text" className="form-control" placeholder="Enter symbol"/>
                <small id="emailHelp" className="form-text text-muted">{this.state.error}</small>
              </div>
              <button onClick={this.lookup} className="btn btn-dark">Add</button>
            </div>
            }
          </div>
            <div className="col-md-3"><button onClick={this.displayStocks} className="right btn btn-danger">Show</button></div>
            <div className="col-md-3"><button onClick={this.price} className="right btn btn-danger">Price</button></div>
            <div className="col-md-3"><button onClick={this.addInput} className="right btn btn-warning">{this.state.text}</button></div>
      </div>
      <div className="row">
        <div className="col-md-12">
        {!this.state.show &&
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Stock</th>
                <th scope="col">Price</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {this.state.prices.map((x, i) =>
                <tr key={i}>
                  <td scope="row">{i}</td>
                  <td>{x.symbol}</td>
                  <td>{x.price}</td>
                  <td><button className="right btn btn-danger">X</button></td>
                </tr>
              )}
              
            </tbody>
          </table>
        }
        </div>
      </div>
    </div>
    )
  }
}

export default App;
