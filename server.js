var express = require('express')
var app = express()

const fs = require("fs");
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const port = 3000;

var budget = require('./tracker.json')

const variables = {
  TYPES: {
    income: "inc",
    expense: "exp",
  }
}

app.get('/budget', (req, res) => {
  console.log('fetching budget')
  res.send(JSON.stringify(budget))
})

app.post('/income', (req, res) => {
  const {
    description,
    value
  } = req.body

  return saveItem(budget, description, value, variables.TYPES.income, res)
})

app.post('/expense', (req, res) => {
  const {
    description,
    value
  } = req.body

  return saveItem(budget, description, value, variables.TYPES.expense, res)
})

function saveItem(budget, description, value, type, res){
  let id = 0;
  budget.income.forEach(() => id++)
  budget.expense.forEach(() => id++)

  const tempBucket = budget
  const tempItem = {
    id,
    description,
    value,
    type
  }
  
  switch(type){
    case variables.TYPES.income:
      tempBucket.income.push(tempItem)
      break;
    case variables.TYPES.expense:
      tempBucket.expense.push(tempItem)
      break;
  }

  fs.writeFile('./tracker.json', JSON.stringify(tempBucket), (err) => {
    if(err){
      console.log('There was an error :: ', err)
     return res.send(false)
    }

    return res.send(true)
  })

}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// C - CREATE
// R - READ
// U - UPDATE
// D - DELETE