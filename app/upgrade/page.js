"use client";

export default function UpgradePage() {

  const handleCheckout = async () => {
    try {
      // 1️⃣ Backend se order create karo
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 99 }), // ₹99
      });

      const order = await res.json();

      if (!order.id) {
        alert("Order creation failed");
        return;
      }

      // 2️⃣ Razorpay checkout options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // LIVE KEY
        amount: order.amount,
        currency: "INR",
        name: "Televora AI",
        description: "Pro Plan Upgrade",
        order_id: order.id,

        handler: async function (response) {
          // 3️⃣ Verify payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const data = await verifyRes.json();

          if (data.success) {
            alert("🎉 Payment Successful! Pro Activated");
            // 👉 yahan redirect / dashboard update
          } else {
            alert("Payment verification failed");
          }
        },

        theme: {
          color: "#facc15",
        },
      };

      // 4️⃣ Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center p-4">
      <h1 className="text-3xl font-bold mb-4">Upgrade to Pro</h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 mt-4">
        <h2 className="text-2xl font-semibold">₹99 / month</h2>

        <ul className="text-left mt-4 space-y-2">
          <li>⚡ Super-fast answers</li>
          <li>📚 Auto Notes Mode</li>
          <li>🧠 Explanation Mode</li>
          <li>📄 PDF Export Premium Templates</li>
          <li>🗂 Save Unlimited Answers</li>
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
