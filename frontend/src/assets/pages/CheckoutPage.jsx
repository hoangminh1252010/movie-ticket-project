import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [exportInvoice, setExportInvoice] = useState(false);
  const [note, setNote] = useState({ enabled: false, content: "" });

  const handleSubmit = () => {
    const data = {
      seats: {
        regular: 20,
        couple: 1,
      },
      total: 1105000,
      customer: {
        name: "Nguyen Van A",
        phone: "0123456789",
        email: "nguyenvana@gmail.com",
      },
      paymentMethod,
      note,
      exportInvoice,
    };

    // Call backend API here
    console.log("Submitting booking: ", data);
  };

  return (
  <>
  <NavBar />
    <div className="pb-10 bg-black">
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-10 space-y-6 mt-6 ">
    <hr></hr>
      <h2 className="text-xl font-semibold text-blue-700">Thông tin đặt vé:</h2>
      <hr></hr>

      <div>
        <h3 className="font-semibold text-blue-700 mb-2">HÓA ĐƠN</h3>
        <p>Ghế thường: <strong>20</strong></p>
        <p>Ghế đôi: <strong>1</strong></p>
        <p className="text-blue-600 font-bold">Tổng: 1.105.000đ</p>
      </div>

      <div>
        <h3 className="font-semibold text-blue-700 mb-2">THÔNG TIN KHÁCH HÀNG</h3>
        <hr className="pt-5"></hr>
        <p>Họ và tên: <strong>Nguyen Van A</strong></p>
        <p>Số điện thoại: <strong>0123456789</strong></p>
        <p>Email: <strong>nguyenvana@gmail.com</strong></p>
      </div>

      <div>
        <h3 className="font-semibold text-blue-700 mb-2">PHƯƠNG THỨC THANH TOÁN</h3>
        <hr className="pt-5"></hr>
        <div className="space-y-2">
          {[
  { id: "vnpay", label: "VNPAY", icon: "public/CheckoutPage/vnpay.png" },
  { id: "zalopay", label: "Ví ZaloPay", icon: "public/CheckoutPage/zalopay.png" },
  { id: "momo", label: "Ví momo", icon: "public/CheckoutPage/momo.png" },
  { id: "atm", label: "ATM / Internet Banking", icon: "public/CheckoutPage/atm.png" },
  { id: "visa", label: "Visa / Master / JCB", icon: "public/CheckoutPage/visa.png" },
].map((method) => (
  <div key={method.id} className="flex items-center space-x-2">
    <input
      type="radio"
      id={method.id}
      name="payment"
      value={method.id}
      checked={paymentMethod === method.id}
      onChange={() => setPaymentMethod(method.id)}
    />
    {method.icon && (
      <img src={method.icon} alt={method.label} className="w-6 h-6" />
    )}
    <label htmlFor={method.id}>{method.label}</label>
  </div>
))
}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-blue-700 mb-2">THÔNG TIN KHÁC</h3>
        <hr className="pt-5"></hr>
        <div className="space-y-2">
        <div className="flex flex-col space-y-2">
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      id="note"
      checked={note.enabled}
      onChange={(e) =>
        setNote((prev) => ({ ...prev, enabled: e.target.checked }))
      }
    />
    <label htmlFor="note">Ghi chú</label>
  </div>

  {note.enabled && (
    <textarea
      rows={3}
      className="border border-gray-300 rounded-md p-2 w-full"
      placeholder="Nhập ghi chú tại đây..."
      value={note.content}
      onChange={(e) =>
        setNote((prev) => ({ ...prev, content: e.target.value }))
      }
    />
  )}
</div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="invoice"
              checked={exportInvoice}
              onChange={(e) => setExportInvoice(e.target.checked)}
            />
            <label htmlFor="invoice">Xuất hóa đơn GTGT</label>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
          Quay lại đặt ghế
        </button>
        <button 
          onClick={handleSubmit}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Xác nhận thanh toán
        </button>
      </div>
    </div>
    </div>
    <Footer />
    </>
  );
}
