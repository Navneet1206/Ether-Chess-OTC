export const Input = ({ label, ...props }) => (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-white">{label}</label>}
      <input {...props} className="w-full px-4 py-3 bg-gray-800 text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>
  );