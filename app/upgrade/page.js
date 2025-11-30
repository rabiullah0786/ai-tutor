"use client";

export default function UpgradePage() {

  const handleCheckout = () => {
    // Later yahan stripe checkout add karenge
    // alert("Checkout button clicked!");
  };

  return (
    <div className="max-w-3xl mx-auto text-center p-4">
      <h1 className="text-3xl font-bold mb-4">Upgrade to Pro</h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 mt-4">
        <h2 className="text-2xl font-semibold">₹99/month</h2>

        <ul className="text-left mt-4 space-y-2">
          <li>⚡ Super-fast answers</li>
          <li>📚 Auto Notes Mode</li>
          
          <li>🧠 Explanation Mode</li>
          <li>📄 PDF Export Premium Templates</li>
          <li>🗂 Save Unlimited Answer</li>
        </ul>

        <button
          onClick={handleCheckout}
          className="mt-6 w-full bg-yellow-500 p-3 rounded-xl font-semibold text-black"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
