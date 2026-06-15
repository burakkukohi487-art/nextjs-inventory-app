import Header from "../components/Header";
import StockForm from "../components/StockForm";

export default function Shipment() {
    return (
        <div className="min-h-screen bg-gray-100 text-black">
            <Header />
            <div className="flex justify-center">
                <StockForm title="出荷登録" apiPath="/api/shipment" />
            </div>
        </div>
    )
}