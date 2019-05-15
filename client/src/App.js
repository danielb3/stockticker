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
      prices: [],
      number: 0
    };
    this.updateInput = this.updateInput.bind(this);
    this.lookup = this.lookup.bind(this);
    this.add = this.add.bind(this);
    this.addInput = this.addInput.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.del = this.del.bind(this);
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
    this.setState({
      error: "Please Wait",
    })
    console.log("works")
    console.log(this.state.input)
    fetch(`https://financialmodelingprep.com/api/company/real-time-price/${this.state.input}?datatype=json`)
    .then((resp) => resp.json())
    .then((data) => {
      if (data.symbol === this.state.input) {
        console.log(data.symbol)
        this.setState({
          error: "",
          stock: data.symbol,
          show: false,
          text: "Add +",
          prices: []
        }, function addTo() {
              this.add()
        })
      } else {
        this.setState({
          error: "This is not a known stock symbol.  Please try again.  Ex. AAPL"
        })
      }
      
    })
  }

add() {
  fetch('/api/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stock: this.state.stock }),
  }).then(() =>
  this.setState({
    error: "",
    input: ""
  }))
  .then(response => {this.updateDisplay()})
  .catch(error => console.error('Error:', error));
}

del(e) {
  console.log("works")
  let sName = e.target.value
  console.log(sName)

  fetch('/api/del', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stock: sName }),
  }).then((res) => {console.log(res)})
  .then(response => {this.updateDisplay()})
  .catch(error => console.error('Error:', error));
}

updateDisplay() {
    $.get("/api/display", function(data, status){
      console.log("Data: "+JSON.stringify(data))
      this.setState({
        stocks: data,
        number: data.length,
        prices: []
      }, () => {this.prices()})
    }.bind(this))
  }

componentWillMount() {
  this.updateDisplay()
}

prices() {
  console.log("works")
    this.state.stocks.map((x, i) => 
    $.get(`https://financialmodelingprep.com/api/company/real-time-price/${{x}.x.symbol}?datatype=json`, function(data, status){
      console.log("Data: "+data)
      if (this.state.prices.length === this.state.number) {
        this.setState({
          prices: this.state.prices
        })
      } else {
        this.setState({
          prices: this.state.prices.concat(JSON.parse([data]))
        })
      }
    }.bind(this)));
    console.log(this.state.prices.length)
    console.log(this.state.number)
  }

  render() {
    return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3"><button onClick={this.updateDisplay} className="btn btn-danger">Refresh &#8635;</button></div>
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
            {/* <div className="col-md-3"><button onClick={this.displayStocks} className="right btn btn-danger">Show</button></div>
            <div className="col-md-3"><button onClick={this.price} className="right btn btn-danger">Price</button></div> */}
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
                  <td scope="row">{i+1}</td>
                  <td>{x.symbol}</td>
                  <td>${x.price}</td>
                  <td><button value={x.symbol} onClick={this.del} className="right btn btn-danger">X</button></td>
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
