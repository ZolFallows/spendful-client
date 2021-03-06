import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../loader/loader'
import IncomeExpenseList from '../IncomeExpensesList/IncomeExpenseList';
import BarChart from '../BarChart/BarChart';
import { getAllExpenses } from '../../services/expenses-service'
import { getMonthlyReport } from '../../services/reports-service';
import DataContext from '../../contexts/DataContext'
import MonthPicker from '../MonthPicker/MonthPicker'
import { getAllCategories } from '../../services/categories-service';

export default class ExpensesPage extends Component {
  static contextType = DataContext
  state = {
    month: {
      year: new Date().getFullYear(), 
      month: new Date().getMonth() 
    },
    expenses: [],
    errors: [],
    showExpenses: '',
    isLoading: true
  }

  componentDidMount(){
    this.setState({month: {}, showExpenses: 'all'})
    this.context.clearError()
    this.handleReports(
        this.state.month.year, 
        this.state.month.month + 1 
        )
    getAllExpenses()
      .then(expenses => {
          this.setState({expenses})
          this.setState({isLoading: false})
      })
      .catch(error => {
        this.context.setError(error.errors)
        this.setState({
          errors: this.context.errors
        })
      })
    getAllCategories()
      .then(categories => {
        this.context.setCategories(categories)
      })
      .catch(error => {
        this.context.setError(error.errors)
        this.setState({
          errors: this.context.errors
        })
      })
  }

  updateExpenses = (id) => {
    let updatedExpenses = this.state.expenses.filter(expense => expense.id !== id)
    this.setState({
      expenses: updatedExpenses 
    })
    this.context.deleteExpense(id)
  }
  
  handleReports = (year, month) => {
    year = parseInt(year);
    month = parseInt(month);

    // set defaults if inputs are invalid
    if(isNaN(year) || isNaN(month)) {
      year = new Date().getFullYear();
      month = new Date().getMonth();
    }
    this.context.clearError()
    getMonthlyReport(year, month)
      .then(report => {
        
        this.context.setAllExpenses(report.expenses);
        this.context.setAllIncomes(report.incomes);
      })
      .catch(error => {
        this.context.setError(error)
      })
  }

  handleSetMonth = (month) => {
    this.handleReports(month.year, month.month)
    this.setState({month, showExpenses: 'monthly'})
  }

  handleChangeExpenses = (e) => {
    let showExpenses = e.target.value
    this.setState({showExpenses})
  }


  render() {
    let data = this.state.showExpenses === 'monthly' ? this.context.expenses : this.state.expenses
    let chart = this.state.showExpenses === 'all' ? <BarChart data={data} type="expenses" /> : '';

    let content = (
                    <> 
                      <section className="page-controls">
                        <select className="form-control" onChange={this.handleChangeExpenses}>
                          <option value='all'>All Expenses</option>
                          <option value='monthly'>Monthly</option>
                        </select>
                        
                        {this.state.showExpenses === 'monthly' && <>
                          <MonthPicker setMonth={this.handleSetMonth}/>
                          <div className="w-100 show-mobile"></div>
                        </>}
                        
                        <Link className="btn" to="/add#expense">Add expense</Link>
                      </section>

                      {this.state.expenses.length > 0 && chart}
                        
                      <section className="page-content">
                        { data.length > 0
                        ? <IncomeExpenseList type="expenses" data={data} updateExpenses={this.updateExpenses} />
                        : <p className="alert">There are no items to display</p> }
                      </section>
                    </>
                  )
    return <>
      {this.state.isLoading ? <Loader /> : content}
    </>
  }
}