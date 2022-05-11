import React from 'react';

class IcsTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      icsUrl: '',
      calendarData: {}
    };
  }

  diffDateDays = (startDate, endDate) => {
    const diffTime = Math.abs(startDate - endDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  handleIcsUrlChange = (event) => {
    this.setState({
      icsUrl: event.target.value
    })
  }

  handleSubmit = () => {
    fetch(`https://jmarketing.agency/custom-scripts/get-url.php?url=${this.state.icsUrl}`)
      .then(res => res.text())
      .then(text => {
        console.log(text);
        const ical = require('cal-parser');
        let parsedCal = ical.parseString(text);
        console.log(parsedCal);
        this.setState({
          calendarData: parsedCal
        })
      });
  }

  render() {

    return (
      <div>
        <input placeholder='ICS URL' type="url" value={this.state.icsUrl} onChange={this.handleIcsUrlChange} />
        <button onClick={this.handleSubmit} >Load data</button>

        <table className='table'>
          <thead>
            <tr>
              <th>Description</th>
              <th>Date Start</th>
              <th>Date End</th>
              <th>Total Days</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {this.state.calendarData.events && this.state.calendarData.events.map((value, index) => {
              return (
                <tr key={index} >
                  <td>{value.description.value}</td>
                  <td>{value.dtstart.value.toDateString()}</td>
                  <td>{value.dtend.value.toDateString()}</td>
                  <td>{this.diffDateDays(value.dtstart.value, value.dtend.value)}</td>
                  <td>{value.summary.value}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default IcsTable;