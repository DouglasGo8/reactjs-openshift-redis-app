
import React, { Component } from "react";
import { render } from "react-dom";
import axios from "axios";

/**
 *
 */
export default class App extends Component {
  state = {
    isMsg: false,
    valuesFromRedis: []
  };

  distinctMe = (value, index, self) => self.indexOf(value) === index;

  async componentDidMount() {

    const url = "http://redis-idempotency.192.168.99.100.nip.io";
    
    setInterval(() => {
      
      axios.get(url.concat("/idempotency/v1/list"))
        .then((result) => {
          
          const body = result.data.split("|");
          
          if (body.find(e => e === "No response available")) {
            this.setState({
              isMsg: false,
              valuesFromRedis: []
            })
          } else {
            
            body.splice(-1, 1);

            this.setState({
              isMsg: true,
              valuesFromRedis: [...new Set(body)],
            })
          }
        })
    }, 30000);

    

  }

  /**
   *
   */
  myTrRows = (valueFromRedis, key) => {
    return (
      <tr key={key}>
        <td className='collapsing'><i className="chevron circle down icon"></i></td>
        <td>{valueFromRedis}</td>
      </tr>
    );
  };

  render() {

    return (
      <div className="ui stacked segment">
        <table className="ui celled padded table">
          <thead>
            <tr>
              <th colSpan="2">
                <div>
                  <h2 className='ui header'>
                    {
                      (!this.state.isMsg) ? <a className="ui red tag label">Values Upcoming</a> :
                         <div className="ui placeholder"><div className="line"></div></div>
                    }
                  </h2>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>{this.state.valuesFromRedis.map(this.myTrRows)}</tbody>
        </table>
      </div>
    );
  }
}

render(<App />, document.querySelector("[data-js='root']"));
