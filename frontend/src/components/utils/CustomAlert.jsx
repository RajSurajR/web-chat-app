import React from 'react';

const CustomAlert = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    // Backdrop / Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      
      <div className="bg-base-100 text-base-content w-full max-w-sm rounded-xl p-6 shadow-2xl border border-base-300">
        
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm opacity-70 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 rounded-lg font-medium transition-colors bg-base-300 hover:bg-base-400 text-base-content"
          >
            Cancel
          </button>
          
          <button 
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg font-medium transition-colors bg-primary hover:bg-primary-focus text-primary-content"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;

{/* const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = () => {
    console.log("Item Deleted!");
    setIsAlertOpen(false);
  }
    <button 
        onClick={() => setIsAlertOpen(true)}
        className="btn btn-error" // Standard daisyUI button for the trigger
      >
    <CustomAlert 
        isOpen={isAlertOpen}
        title="Are you absolutely sure?"
        message="This action cannot be undone. You will lose all your data forever."
        onConfirm={handleDelete}
        onCancel={() => setIsAlertOpen(false)}
      /> 
      
      */}