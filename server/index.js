const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Function to calculate EMI
const calculateEMI = (principal, annualRate, tenureMonths, frequency) => {
  const rate = annualRate / 100 / 12; // Convert annual rate to monthly rate
  const n = tenureMonths; // Total number of EMIs

  // EMI Calculation Formula
  const EMI =
    (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);

  // Adjust for quarterly payments
  const adjustedEMI = frequency === "quarterly" ? EMI * 3 : EMI;

  return { EMI: adjustedEMI, totalPayments: n };
};

// Generate Repayment Schedule
const generateRepaymentSchedule = (loanData) => {
  const {
    disbursementDate,
    principal,
    tenure,
    frequency,
    interestRate,
    moratorium,
  } = loanData;

  let balance = parseFloat(principal);
  let monthlyRate = parseFloat(interestRate) / 100 / 12;
  let EMI, totalPayments;

  // Handle moratorium period
  if (moratorium > 0) {
    const moratoriumInterest = balance * monthlyRate * moratorium;
    balance += moratoriumInterest; // Adding accrued interest
  }

  ({ EMI, totalPayments } = calculateEMI(
    balance,
    interestRate,
    tenure,
    frequency
  ));

  let schedule = [];
  let paymentDate = new Date(disbursementDate);

  for (let i = 1; i <= totalPayments; i++) {
    let interestPayment = balance * monthlyRate;
    let principalPayment = EMI - interestPayment;
    balance -= principalPayment;

    schedule.push({
      paymentNumber: i,
      paymentDate: paymentDate.toISOString().split("T")[0],
      EMI: EMI.toFixed(2),
      principalPaid: principalPayment.toFixed(2),
      interestPaid: interestPayment.toFixed(2),
      balanceRemaining: balance.toFixed(2),
    });

    // Adjust next payment date based on frequency
    paymentDate.setMonth(
      paymentDate.getMonth() + (frequency === "quarterly" ? 3 : 1)
    );
  }

  return schedule;
};

// API Endpoint to Calculate Loan Schedule
app.post("/calculate-loan-schedule", (req, res) => {
  const loanData = req.body;

  if (
    !loanData ||
    !loanData.disbursementDate ||
    !loanData.principal ||
    !loanData.tenure ||
    !loanData.interestRate
  ) {
    return res.status(400).json({ error: "Missing required loan details" });
  }

  const schedule = generateRepaymentSchedule(loanData);
  res.json({ schedule });
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
