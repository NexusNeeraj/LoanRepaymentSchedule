import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RepaymentSchedule = ({ schedule }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Loan Repayment Schedule", 20, 10);

    const tableColumn = [
      "#",
      "Date",
      "EMI (₹)",
      "Principal (₹)",
      "Interest (₹)",
      "Balance (₹)",
    ];
    const tableRows = schedule.map((payment, index) => [
      index + 1,
      payment.paymentDate,
      payment.EMI,
      payment.principalPaid,
      payment.interestPaid,
      payment.balanceRemaining,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Loan_Repayment_Schedule.pdf");
  };

  const shareSchedule = () => {
    const message = `Loan Repayment Schedule\n\n${schedule
      .map(
        (p, index) =>
          `${index + 1}. ${p.paymentDate} - EMI: ₹${p.EMI}, Balance: ₹${
            p.balanceRemaining
          }`
      )
      .join("\n")}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Repayment Schedule</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">#</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">EMI (₹)</th>
              <th className="border p-2">Principal (₹)</th>
              <th className="border p-2">Interest (₹)</th>
              <th className="border p-2">Balance (₹)</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((payment, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{payment.paymentNumber}</td>
                <td className="border p-2">{payment.paymentDate}</td>
                <td className="border p-2">{payment.EMI}</td>
                <td className="border p-2">{payment.principalPaid}</td>
                <td className="border p-2">{payment.interestPaid}</td>
                <td className="border p-2">{payment.balanceRemaining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Download & Share Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={generatePDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download as a PDF
        </button>
        <button
          onClick={shareSchedule}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Share via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default RepaymentSchedule;
