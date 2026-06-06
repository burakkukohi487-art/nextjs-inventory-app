import { Product } from "../types/products"

type Props = {
    products: Product[];
};

export default function ProductTable({ products }: Props) {
    return (
        <table className="w-full mt-4">

            <thead>
                <tr className="bg-gray-400">
                    <th className="border border-gray-300">商品ID</th>
                    <th className="border border-gray-300">商品名</th>
                    <th className="border border-gray-300">価格</th>
                    <th className="border border-gray-300">在庫数</th>
                </tr>
            </thead>

            <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td className="border border-gray-300 text-center">{product.id}</td>
                        <td className="border border-gray-300">{product.name}</td>
                        <td className="border border-gray-300 text-right">{product.price}</td>
                        <td className="border border-gray-300 text-right">{product.stock}</td>
                    </tr>
                ))}
            </tbody>

        </table>
    );
}