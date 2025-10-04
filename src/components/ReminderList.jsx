import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Clock, Calendar, AlertTriangle, Bell } from 'lucide-react';

const ReminderList = ({ refresh }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spendingAlerts, setSpendingAlerts] = useState([]);

  // Fetch all reminders
  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Get regular reminders
      const remindersResponse = await axios.get('http://localhost:5000/api/reminders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Get spending alerts
      const alertsResponse = await axios.get('http://localhost:5000/api/reminders/spending-alerts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReminders(remindersResponse.data);
      setSpendingAlerts(alertsResponse.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete reminder
  const deleteReminder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchReminders(); // Refresh list
    } catch (error) {
      alert('Error deleting reminder: ' + (error.response?.data?.message || error.message));
    }
  };

  // Mark reminder as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(`http://localhost:5000/api/reminders/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchReminders(); // Refresh list
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Get type icon and color
  const getTypeInfo = (type) => {
    switch (type) {
      case 'spending_limit':
        return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' };
      case 'weekly':
        return { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'monthly':
        return { icon: Calendar, color: 'text-green-500', bg: 'bg-green-50' };
      case 'custom':
        return { icon: Bell, color: 'text-purple-500', bg: 'bg-purple-50' };
      default:
        return { icon: Bell, color: 'text-gray-500', bg: 'bg-gray-50' };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    fetchReminders();
  }, [refresh]);

  if (loading) {
    return <div className="text-center py-4">Loading reminders...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Spending Alerts */}
      {spendingAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Spending Alerts
          </h3>
          {spendingAlerts.map(alert => (
            <div key={alert.reminderId} className="bg-white rounded-md p-3 border border-red-200">
              <h4 className="font-medium text-red-700">{alert.title}</h4>
              <p className="text-sm text-red-600">
                You've spent ₹{alert.currentSpent} out of your ₹{alert.limitAmount} limit
              </p>
              <div className="mt-2">
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((alert.currentSpent / alert.limitAmount) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regular Reminders */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Your Reminders</h2>
        </div>

        {reminders.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No reminders found. Create your first reminder!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reminders.map(reminder => {
              const typeInfo = getTypeInfo(reminder.type);
              const TypeIcon = typeInfo.icon;
              
              return (
                <div 
                  key={reminder._id} 
                  className={`p-4 flex items-center justify-between ${
                    !reminder.isRead ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${typeInfo.bg}`}>
                      <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{reminder.title}</h3>
                      {reminder.description && (
                        <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="capitalize">
                          {reminder.type.replace('_', ' ')}
                        </span>
                        
                        {reminder.type !== 'spending_limit' && (
                          <>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {reminder.type === 'custom' ? 'Due: ' : 'Next: '}
                              {formatDate(reminder.nextReminderDate)}
                            </span>
                            
                            {reminder.reminderTime && (
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {reminder.reminderTime}
                              </span>
                            )}
                          </>
                        )}
                        
                        {reminder.type === 'spending_limit' && (
                          <span>Limit: ₹{reminder.limitAmount}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!reminder.isRead && (
                      <button
                        onClick={() => markAsRead(reminder._id)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        Mark Read
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteReminder(reminder._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderList;
