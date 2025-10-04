import { useState } from 'react';
import axios from 'axios';
import { cn } from "@/lib/utils"; // Assuming you use shadcn/ui's utility, otherwise use a simple class joiner.

// --- Helper Icons for a richer UI ---

const TitleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const RupeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 4h4m5 4H5.828a1 1 0 01-.707-1.707l3.586-3.586a1 1 0 011.414 0l3.586 3.586A1 1 0 0118.172 20H15m4-4a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const DescriptionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const RepeatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 12a8 8 0 1016 0" /></svg>;
const LimitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;


const ReminderForm = ({ onReminderCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'custom',
    limitAmount: '',
    startDate: new Date().toISOString().split('T')[0], // Set default start date
    reminderTime: '09:00'
  });
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    if (feedback.message) setFeedback({ type: '', message: '' });
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const token = localStorage.getItem('authToken');
      await axios.post('http://localhost:5000/api/reminders', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFeedback({ type: 'success', message: 'Reminder created successfully!' });
      
      if (onReminderCreated) onReminderCreated();
      
      // Reset form after a short delay to show success message
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          type: 'custom',
          limitAmount: '',
          startDate: new Date().toISOString().split('T')[0],
          reminderTime: '09:00'
        });
        setFeedback({ type: '', message: '' });
      }, 2000);

    } catch (error) {
      setFeedback({ type: 'error', message: error.response?.data?.message || 'Failed to create reminder.' });
    } finally {
      setLoading(false);
    }
  };

  const reminderTypes = [
    { key: 'custom', title: 'Custom', description: 'A one-time alert.', icon: <BellIcon /> },
    { key: 'weekly', title: 'Weekly', description: 'Repeats every week.', icon: <RepeatIcon /> },
    { key: 'monthly', title: 'Monthly', description: 'Repeats every month.', icon: <RepeatIcon /> },
    { key: 'spending_limit', title: 'Spending Limit', description: 'Alert on exceeding amount.', icon: <LimitIcon /> },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Reminder</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Visual Reminder Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {reminderTypes.map((type) => (
              <button
                type="button"
                key={type.key}
                onClick={() => handleChange({ target: { name: 'type', value: type.key } })}
                className={cn(
                  "p-3 text-left border-2 rounded-lg transition-all flex flex-col items-center justify-center space-y-2",
                  formData.type === type.key
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 text-gray-600"
                )}
              >
                <div className={formData.type === type.key ? "text-blue-600" : "text-gray-400"}>{type.icon}</div>
                <div className="text-center">
                  <p className="font-semibold text-sm">{type.title}</p>
                  <p className="text-xs hidden md:block">{type.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><TitleIcon /></div>
            <input id="title" type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 pl-10 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none border-2 border-transparent" placeholder="e.g., Pay Credit Card Bill" />
          </div>
        </div>

        {/* Animated Conditional Fields */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${formData.type === 'spending_limit' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-2">
            <label htmlFor="limitAmount" className="block text-sm font-medium text-gray-700 mb-2">Spending Limit Amount (₹)</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><RupeeIcon /></div>
              <input id="limitAmount" type="number" name="limitAmount" value={formData.limitAmount} onChange={handleChange} required={formData.type === 'spending_limit'} className="w-full p-3 pl-10 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none border-2 border-transparent" placeholder="5000" />
            </div>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${formData.type !== 'spending_limit' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">{formData.type === 'custom' ? 'Reminder Date' : 'Start Date'}</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><CalendarIcon /></div>
                <input id="startDate" type="date" name="startDate" value={formData.startDate} onChange={handleChange} required={formData.type !== 'spending_limit'} className="w-full p-3 pl-10 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none border-2 border-transparent" />
              </div>
            </div>
            <div>
              <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-2">Reminder Time</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><ClockIcon /></div>
                <input id="reminderTime" type="time" name="reminderTime" value={formData.reminderTime} onChange={handleChange} required={formData.type !== 'spending_limit'} className="w-full p-3 pl-10 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none border-2 border-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-gray-400">(Optional)</span></label>
          <div className="relative">
            <div className="pointer-events-none absolute top-3 left-0 pl-3 flex items-center"><DescriptionIcon /></div>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="w-full p-3 pl-10 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none border-2 border-transparent" rows="3" placeholder="Add any extra details..." />
          </div>
        </div>
        
        {/* Feedback Message */}
        {feedback.message && (
          <div className={`p-3 rounded-lg text-sm text-center font-medium ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {feedback.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          {loading ? 'Creating...' : 'Create Reminder'}
        </button>
      </form>
    </div>
  );
};

export default ReminderForm;