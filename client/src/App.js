import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  render() {
    return (
    <div className="container">
      <div className="row">
        <div className="col-md-3"></div>
          <div className="col-md-6">
            <form>
              <div class="form-group">
                <label for="exampleInputEmail1">Stock Symbol</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter symbol"/>
                <small id="emailHelp" class="form-text text-muted"></small>
              </div>
              <button type="submit" class="btn btn-dark">Submit</button>
            </form>
          </div>
        <div className="col-md-3"></div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <table class="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    )
  }
}

export default App;
