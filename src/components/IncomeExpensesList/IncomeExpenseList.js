import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './IncomeExpenseList.css';

function ListItem(props) {
  let classname = '';
  let prefix = '';
  let extras = '';

  if(props.type === 'expenses') {
    classname += 'list-expense';
    prefix += '➖';
  } else {
    classname += 'list-income';
    prefix += '💵';
  }

  // only show extras if list is NOT recent only
  if(! props.recentOnly) {
    let date = new Date(props.item.start_date).toDateString();

    extras = <>
      <p>{date}</p>
      <p>{props.item.category_id}</p>
      <p>{props.item.recurring_rule || 'never'}</p>
    </>;
  }

  return (
    <li className={classname}>
      <p>{prefix} {props.item.description}</p>
      <p className={props.type === 'incomes' ? 'text-green' : 'text-red'}>${props.item.amount}</p>
      <p className="w-100 show-mobile"></p>
      {extras}
    </li>
  );
}


export default class IncomeExpenseList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
    };
  }

  render() {
    // limit the number of items if onlyShowRecent = true
    let data = this.props.onlyShowRecent ? this.props.data.slice(0, 5) : this.props.data;

    return <>
      <article className={this.props.onlyShowRecent ? 'item-list-dash' : ''}>
        {this.props.onlyShowRecent ? <h4>{this.props.type}</h4> : ''}

        <ul className="item-list">
          {data.map((item, i) => 
            <ListItem item={item} type={this.props.type} recentOnly={this.props.onlyShowRecent} key={i} />)}
        </ul>

        {this.props.onlyShowRecent ? <Link className="recent-link" to={'/' + this.props.type}>See all {this.props.type}</Link> : ''}
      </article>

    </>;
  }
}

IncomeExpenseList.defaultProps = {
  type: 'income',
  onlyShowRecent: false,
  data: [],
}