import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../..')
const clientDist = path.join(projectRoot, 'client', 'dist')

app.use(cors())
app.use(express.json())

let payments = [
  {id:'PAY-1001', customer:'Aarav Mehta', amount:12500, method:'UPI', status:'Successful', date:'2026-09-21'},
  {id:'PAY-1002', customer:'Neha Sharma', amount:8400, method:'Card', status:'Successful', date:'2026-09-21'},
  {id:'PAY-1003', customer:'Rohan Patil', amount:19200, method:'Bank Transfer', status:'Pending', date:'2026-09-20'},
  {id:'PAY-1004', customer:'Sneha Joshi', amount:6200, method:'Card', status:'Successful', date:'2026-09-20'},
  {id:'PAY-1005', customer:'Kabir Shah', amount:4500, method:'UPI', status:'Failed', date:'2026-09-19'},
  {id:'PAY-1006', customer:'Priya Nair', amount:15800, method:'Card', status:'Successful', date:'2026-09-19'}
]

const customers = [
  {id:1,name:'Aarav Mehta',email:'aarav@example.com',transactions:18,totalSpend:148500},
  {id:2,name:'Neha Sharma',email:'neha@example.com',transactions:12,totalSpend:94200},
  {id:3,name:'Rohan Patil',email:'rohan@example.com',transactions:9,totalSpend:71200},
  {id:4,name:'Sneha Joshi',email:'sneha@example.com',transactions:15,totalSpend:116800}
]

app.get('/health', (req,res) => {
  res.json({status:'healthy', service:'payment-platform'})
})

app.get('/api/dashboard', (req,res) => {
  const successful = payments.filter(p => p.status === 'Successful').length
  const pending = payments.filter(p => p.status === 'Pending').length
  const totalVolume = payments.filter(p => p.status === 'Successful').reduce((s,p) => s+p.amount, 0)
  res.json({
    totalVolume,
    successful,
    pending,
    successRate: payments.length ? Math.round(successful / payments.length * 100) : 0
  })
})

app.get('/api/payments', (req,res) => res.json(payments))
app.get('/api/customers', (req,res) => res.json(customers))

app.post('/api/payments', (req,res) => {
  const {customer, amount, method} = req.body
  if (!customer || !amount || !method) {
    return res.status(400).json({message:'customer, amount and method are required'})
  }

  const payment = {
    id: `PAY-${1000 + payments.length + 1}`,
    customer,
    amount: Number(amount),
    method,
    status: 'Pending',
    date: new Date().toISOString().slice(0,10)
  }

  payments.unshift(payment)
  res.status(201).json(payment)
})

// In production/Docker, serve the React build from the same Node server.
app.use(express.static(clientDist))

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Payment Platform running on port ${PORT}`)
})