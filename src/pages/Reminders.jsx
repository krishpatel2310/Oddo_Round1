import { useState } from 'react';
import ReminderForm from '../components/ReminderForm';
import ReminderList from '../components/ReminderList';
import { Plus } from 'lucide-react';

const Reminders = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(0);


  const handleReminderCreated = () => {
    setRefreshList(prev => prev + 1); // Trigger refresh
    setShowForm(false); // Hide form after creating
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600">Manage your spending reminders and notifications</p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'Add Reminder'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        {showForm && (
          <div className="lg:col-span-1">
            <ReminderForm onReminderCreated={handleReminderCreated} />
          </div>
        )}
        
        {/* List Section */}
        <div className={showForm ? 'lg:col-span-1' : 'lg:col-span-2'}>
          <ReminderList refresh={refreshList} />
        </div>
      </div>
    </div>
  );
};

export default Reminders;
