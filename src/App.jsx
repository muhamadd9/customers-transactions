import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  async function getCustomersData() {
    try {
      let { data } = await axios.get('./customersData.json');
      setCustomers(data.customers);
      setTransactions(data.transactions);
      setFilteredTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function getCustomerName(id) {
    const customer = customers.find(customer => customer.id === id);
    return customer ? customer.name : 'Unknown Customer';
  }

  function getCustomerId(name) {
    const customer = customers.find(customer => customer.name === name);
    return customer ? customer.id : null;
  }

  function filterByName(e) {
    const customerName = e.target.value;

    if (customerName === '') {
      setFilteredTransactions(transactions);
    } else {
      const customerId = getCustomerId(customerName);
      const filtered = transactions.filter(transaction => transaction.customer_id === customerId);
      setFilteredTransactions(filtered);
    }
  }

  function filterByAmount(amount) {
    const filtered = transactions.filter(item => item.amount == amount);
    amount.length === 0 ? setFilteredTransactions(transactions) : setFilteredTransactions(filtered);
  }

  useEffect(() => {
    getCustomersData();
  }, []);

  const chartData = {
    labels: filteredTransactions.map(transaction => transaction.date),
    datasets: [
      {
        label: 'Transaction Amount',
        data: filteredTransactions.map(transaction => transaction.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="customer-transactions min-vh-100 text-white">
      <div className="container py-3">
        <h1 className="text-center">Customers Transactions</h1>
        <p className="fw-semibold mb-2">Filter By Customer</p>
        <select className="form-select px-2 mb-3" aria-label="Default select example" onChange={filterByName}>
          <option value="">All</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.name}>{customer.name}</option>
          ))}
        </select>
        <p className="fw-semibold mb-2">Search by transaction amount</p>
        <input type="text" className="form-control mb-3" placeholder="Amount" name="" id="" onChange={(e) => filterByAmount(e.target.value)} />

        <p className="fw-semibold mb-2">Selected Customers Details</p>
        <table className="table table-striped table-hover rounded-2 mt-2 mb-3 text-center">
          <thead>
            <tr>
              <th scope="col">Customer ID</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Transaction Date</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.customer_id}</td>
                <td>{getCustomerName(transaction.customer_id)}</td>
                <td>{transaction.date}</td>
                <td>{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-center mt-4 mb-3 ">Transaction Chart</h2>
        <div className="chart-container text-center d-flex justify-content-center align-items-center position-relative w-100" style={{ height: '500px'}}>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default App;
