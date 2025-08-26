export default function InputField({ label, name, type, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        name={name}  // <--- THIS LINE WAS MISSING AND IS CRUCIAL
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
        required
      />
    </div>
  );
}
