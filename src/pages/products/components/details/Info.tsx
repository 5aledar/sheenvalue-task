import { Product } from '../../lib/types';

const Info = ({ data }: { data: Product }) => {
  return (
    <div className="w-full space-y-5 rounded-xl bg-white p-5 shadow-lg">
      <h2 className="text-lg font-semibold">Product Information</h2>
      <div className="space-y-3">
        <div className="flex items-center  justify-between">
          <p className="text-sm text-slate-500">Weight</p>
          <p className="text-sm font-semibold">{data.weight}g</p>
        </div>
        <div className="flex items-center  justify-between">
          <p className="text-sm text-slate-500">Stock</p>
          <p className="text-sm font-semibold ">{data.stock}units</p>
        </div>
        <div className="flex items-center  justify-between">
          <p className="text-sm text-slate-500">Category</p>
          <p className="text-sm font-semibold">{data.category}</p>
        </div>
      </div>
    </div>
  );
};

export default Info;
