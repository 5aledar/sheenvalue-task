import { Shield } from 'lucide-react';
import { Product } from '../../lib/types';

const Ploicies = ({ data }: { data: Product }) => {
  return (
    <div className="w-full space-y-5 rounded-xl bg-white p-5 shadow-lg">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Shield />
        <h2>Policies</h2>
      </div>
      <div className=" space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Warranty</h3>
          <p className="text-sm text-slate-500">{data.warrantyInformation}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Shipping</h3>
          <p className="text-sm text-slate-500">{data.shippingInformation}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Returns</h3>
          <p className="text-sm text-slate-500">{data.returnPolicy}</p>
        </div>
      </div>
    </div>
  );
};

export default Ploicies;
