import { useState } from 'react';
import UnifiedTransactionForm from '../components/UnifiedTransactionForm';

// Since the header and info cards are removed, these icons are no longer needed here.
// import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const AddTransaction = () => {
  // This state is useful if this page needs to trigger a refresh of other components (like a dashboard).
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1);
   
    console.log('A new transaction was added, page can refresh data now.');
  };

  // The new layout focuses entirely on the form.
  // We apply a background color to the page and use flexbox to center the form component.
  // This creates a cleaner, more modern UI without redundant information.
  return (
    <div className="min-h-screen w-full bg-black-50 flex items-center justify-center p-4">
    
      <UnifiedTransactionForm onTransactionAdded={handleTransactionAdded} />
    </div>
  );
};

export default AddTransaction;