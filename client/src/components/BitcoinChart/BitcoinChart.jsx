import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styles from '../../styles/BitcoinChart.css';
import LineChart from './LineChart';
import ToolTip from './ToolTip';
import InfoBox from './InfoBox';
import TranslationContainer from '../../containers/TranslationContainer';
import { PERIODS } from '../../constants/periods';
import indexStyles from '../../styles/Index.css';

class BitcoinChart extends Component {
  constructor(props) {
    super(props);
    this.updateChart = this
      .updateChart
      .bind(this);

    this.state = {
      fetchingData: true,
      hoverLoc: null,
      activePoint: null,
      data: props.pbi,
      period: '30',
    };
  }

  componentDidMount() {
    this.updateChart(this.state.period);
  }

  componentDidUpdate(prevProps) {
    // only update chart if the data has changed
    if (prevProps.currency !== this.props.currency) {
      this.updateChart(this.state.period);
    }
  }

  handleChartHover(hoverLoc, activePoint) {
    this.setState({ hoverLoc, activePoint });
  }

  updateChart(period) {
    this.state.period = period;
    const currency = this.props.currency.currency;
    const bpi = this.state.data;
    const getData = () => {
      const all = gql`
      query getData($currency: String, $period: String){getGraphData(currency:$currency, period:$period)
        {
        bpi
        disclaimer
        time {
          updated
          updatedISO
          updateduk
        }}}
      `;

      fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: all,
          variables: {
            currency,
            period,
          },
        }),
      })
        .then(r => r.json())
        .then((bitcoinData) => {
          const sortedData = [];
          let count = 0;
          for (const date in bitcoinData.data.getGraphData.bpi) {
            const date1 = new Date(date);
            sortedData.push({
              d: moment(date1.toISOString()).format('MMM DD'),
              p: bitcoinData
                .data
                .getGraphData
                .bpi[date]
                .toLocaleString('us-EN', {
                  style: 'currency',
                  currency,
                }),
              x: count, // previous days
              y: bitcoinData.data.getGraphData.bpi[date], // numerical price
            });
            count++;
          }
          this.setState({ data: sortedData, fetchingData: false });
        })
        .catch((e) => {
          // console.log(e);
        });
    };
    getData();
  }

  render() {
    return (

      <div className={indexStyles.container}>
        <div className={styles.row}>
          <h1><TranslationContainer translationKey="chart_title_text" /></h1>
        </div>
        <div
          className="lang"
          style={{
            padding: 10,
            textAlign: 'center',
          }}
        >
          {PERIODS.map((period, i) => (
            <button
              type="button"
              key={i}
              style={{
                fontWeight: this.state.period === period.value
                  ? 'bold'
                  : '',
              }}
              onClick={() => this.updateChart(period.value)}
            >
              <span>{period.label}</span>
            </button>
          ))}
        </div>
        <div className={styles.row}>
          {!this.state.fetchingData
            ? <InfoBox data={this.state.data} />
            : null}
        </div>
        <div className={styles.row}>
          <div className={styles.popup}>
            {this.state.hoverLoc
              ? <ToolTip hoverLoc={this.state.hoverLoc} activePoint={this.state.activePoint} />
              : null}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.chart}>
            {!this.state.fetchingData
              ? (
                <LineChart
                  data={this.state.data}
                  onChartHover={(a, b) => this.handleChartHover(a, b)}
                />
              )
              : null}
          </div>
        </div>
        <div className={styles.row}>
          <div id="coindesk">
            <TranslationContainer translationKey="powered_text" />
            <a href="http://www.coindesk.com/price/">CoinDesk</a>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { currency: state.currency };
}

export default connect(mapStateToProps, null)(BitcoinChart);

BitcoinChart.propTypes = {
  currency: PropTypes.instanceOf(Object),
  bpi: PropTypes.bool,
};
