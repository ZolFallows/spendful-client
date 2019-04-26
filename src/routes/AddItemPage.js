import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import config from '../config'
import TokenService from '../services/token-service'

class AddItemPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
      type: 'income',
      amount: null,
      description: '',
      start_date: '',
      categories: {
        income: ['Paycheck', 'Direct Deposit', 'Royalties'],
        expense: ['Rent', 'Utilites', 'Groceries', 'Auto']
      },
      recurring_rule: 'MONTHLY',
      income_category: '',
      expense_category: ''
    }
  }

  componentDidMount() {
    const validTypes = ['category', 'income', 'expense'];
    const hash = this.props.location.hash.substr(1);

    if(validTypes.includes(hash)) {
      this.setState({type: hash});
    }
  }

  handl

  handleTypeChange = (event) => {
    this.setState({
      type: event.target.value 
    })
    console.log(this.state.type)
  }

  handleCategoryChange = (e) => {
    if(e.target.value === -1) {
      const newCategory = prompt('Enter the name for the new category:');
       // POST to create category
    }
    let select = e.target.value;
    console.log(select);
    this.setState({
      income_category: select
    })
    console.log('income', this.state.income_category);
    // if (this.state.type === 'income') {
    //   this.setState({
    //    income_category: e.target.value
    //   })
    //   console.log(this.state.income_category)
    // } else {
    //   this.setState({
    //     expense_category: e.target.value
    //   })
    //   console.log(this.state.expense_category)
    // }
    console.log(this.state.categories[this.state.type])
  }

  handleAmountChange = (e) => {
    this.setState({
      amount: e.target.value
    })
    console.log(this.state.amount);
  }

  handleDateChange = (e) => {
    this.setState({
      start_date: e.target.value
    })
    console.log(this.state.start_date);
  }

  handleDescriptionChange = (e) => {
    this.setState({
      description: e.target.value
    })
    console.log(this.state.description)
  }

  handleFreqChange = (e) => {
    let time = e.target.value;
    this.setState({
      recurring_rule: time
    })
    console.log(this.state.recurring_rule)
  }

  addNewItem = () => {
    const addCategory = {
      name: test,
      type: test,
      monthly_budget: test
    }
    fetch(`${config.API_ENDPOINT}/categories`, {
      method: 'POST',
      headers: {
        "Authorization": `bearer ${TokenService.getAuthToken()}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(addCategory)
    }) 

  }

  renderForm = () => {
    return <>
      <label htmlFor="input-category">Category</label>
      <select id="input-category" onChange={this.handleCategoryChange} value={this.state.value}>
        {this.state.categories[this.state.type]
          .map(category => <option key={category} value={category}>{category}</option>)}
        <option value="-1">create new category...</option>
      </select>

      <label htmlFor="input-date">Date</label>
      <input type="date" id="input-date" onChange={this.handleDateChange}/>

      <label htmlFor="input-description">Short description (max 50 chars.)</label>
      <input type="text" id="input-description" maxLength="50" onChange={this.handleDescriptionChange}/>

      <label htmlFor="input-amount">Amount</label>
      <input type="number" id="input-amount" onChange={this.handleAmountChange}/>

      <label htmlFor="input-freq">Frequency</label>
      <select id="input-freq" onChange={this.handleFreqChange}>
        <option value='BI-WEEKLY'>Bi-weekly</option>
        <option value='MONTHLY'>Monthly</option>
      </select>

      <button type="submit">Create</button>
    </>;
  }

  render() {
    return (
      <main className="flex-main">
        <form className="flex-form" onSubmit={this.addNewItem}>
          <label htmlFor="input-type">I want to add...</label>
          <select id="input-type" onChange={this.handleTypeChange} value={this.state.type}>
            {Object.keys(this.state.categories).map(type => 
              <option key={type}>{type}</option>)}
          </select>

          <hr></hr>
          {this.renderForm()}
        </form>
      </main>
    );
  }
}

export default withRouter(AddItemPage);