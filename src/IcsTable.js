import React from 'react';

class IcsTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      icsUrl: 'https://www.airbnb.com.au/calendar/ical/28640935.ics?s=c128911ca8a35aead86d5aa0806fbe97',
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

  totalDaysUnder21 = () => {
    let days = 0;
    if (this.state.calendarData.events) {
      this.state.calendarData.events.map((value, index) => {
        let daysCount = this.diffDateDays(value.dtstart.value, value.dtend.value);
        if ( daysCount <= 21 ) {
          days += daysCount;
        }
      });
    }

    return days;
  }

  remainingBookable = () => {
    let days = 0;
    if (this.state.calendarData.events) {
      days = 180 - this.totalDaysUnder21();
    }

    return days;
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
              <th className='text-center'>Total Days</th>
              <th className='text-center'>More than 21 days?</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {this.state.calendarData.events && this.state.calendarData.events.map((value, index) => {
              return (
                <tr key={index} >
                  <td>{value.hasOwnProperty('description') ? value.description.value : '-'}</td>
                  <td>{value.dtstart.value.toDateString()}</td>
                  <td>{value.dtend.value.toDateString()}</td>
                  <td className='text-center' >
                    <span className={this.diffDateDays(value.dtstart.value, value.dtend.value) > 21 ? 'danger' : ''} >{this.diffDateDays(value.dtstart.value, value.dtend.value)}</span>
                  </td>
                  <td className='text-center'>{this.diffDateDays(value.dtstart.value, value.dtend.value) > 21 ? 'Yes' : 'No'}</td>
                  <td>{value.summary.value}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className='mt-5' >
          <strong>Total days under 21:</strong> {this.totalDaysUnder21()}
        </div>

        <div className='mt-2' >
          <strong>Days remaining bookable under 21 days:</strong> {this.remainingBookable()}
        </div>
      </div>
    );
  }
}

export default IcsTable;