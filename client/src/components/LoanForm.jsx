import { useState } from "react";
import axios from "axios";
import RepaymentSchedule from "./RepaymentSchedule";

const LoanForm = () => {
  const [loanData, setLoanData] = useState({
    disbursementDate: "",
    principal: "",
    tenure: "",
    frequency: "monthly",
    interestRate: "",
    moratorium: "0",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [schedule, setSchedule] = useState(null);

  const handleChange = (e) => {
    setLoanData({ ...loanData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSchedule(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/calculate-loan-schedule",
        loanData
      );
      setSchedule(response.data.schedule);
    } catch (err) {
      setError("Failed to generate schedule. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">Loan Repayment Schedule</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Disbursement Date</label>
            <input
              type="date"
              name="disbursementDate"
              value={loanData.disbursementDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Principal Amount (₹)</label>
            <input
              type="number"
              name="principal"
              value={loanData.principal}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Tenure (Months)</label>
            <input
              type="number"
              name="tenure"
              value={loanData.tenure}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">EMI Frequency</label>
            <select
              name="frequency"
              value={loanData.frequency}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold">Interest Rate (%)</label>
            <input
              type="number"
              name="interestRate"
              value={loanData.interestRate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">
              Moratorium Period (Months)
            </label>
            <input
              type="number"
              name="moratorium"
              value={loanData.moratorium}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Calculating..." : "Generate Schedule"}
          </button>
        </form>
      </div>
      <div className="ml-2 mr-2 mb-5">
        {/* Show repayment schedule when available */}
        {schedule && <RepaymentSchedule schedule={schedule} />}
      </div>
    </>
  );
};

export default LoanForm;
