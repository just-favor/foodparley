import { FaCheckCircle, FaClock } from 'react-icons/fa';

interface Order {
  id: string;
  items: string[];
  total: number;
  status: 'pending' | 'preparing' | 'delivered';
  date: string;
}

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const StatusIcon = order.status === 'delivered' ? FaCheckCircle : FaClock;
  const statusColor = order.status === 'delivered' ? 'green' : 'orange';

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900"># {order.id}</h3>
          <p className="text-sm text-gray-500">{order.date}</p>
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${statusColor === 'green' ? 'text-green-600' : 'text-orange-500'}`}>
          <StatusIcon className="w-4 h-4" />
          <span>{order.status.toUpperCase()}</span>
        </div>
      </div>
      <div className="space-y-1 mb-4">
        {order.items.map((item, idx) => (
          <p key={idx} className="text-sm text-gray-600">• {item}</p>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-2xl font-bold text-orange-500">${order.total}</span>
        {order.status === 'delivered' ? (
          <span className="text-green-600 font-semibold text-sm">Reorder</span>
        ) : (
          <span className="text-gray-500 font-semibold text-sm">Tracking...</span>
        )}
      </div>
    </div>
  );
}

