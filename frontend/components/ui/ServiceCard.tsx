import { Service } from '@/types';
import Link from 'next/link';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const provider = service.providerId;

  return (
    <Link href={`/services/${service._id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-6xl">🔧</div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-indigo-600">₹{service.basePrice}</span>
            <span className="text-sm text-gray-500">{service.duration} min</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {provider.profilePhoto ? (
                <img
                  src={provider.profilePhoto}
                  alt={provider.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-600 font-bold">{provider.name[0]}</span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{provider.name}</p>
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-gray-600 ml-1">
                  {provider.rating?.toFixed(1) || 'New'} ({provider.totalReviews || 0})
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full">
              {service.category.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
