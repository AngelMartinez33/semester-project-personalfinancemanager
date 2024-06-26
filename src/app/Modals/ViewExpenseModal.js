import Modal from "@/app/Modals/modal";
import { useContext, useState } from 'react';
import { currencyFormatter } from "../Finance-Context/utils";
import { FaRegTrashAlt } from 'react-icons/fa'
import { financeContext } from "../Finance-Context/finance-context";
import { toast } from 'react-toastify';

function ViewExpenseModal({ show, onClose, expense }) {
    const { deleteExpenseItem, deleteExpenseCategory, updateExpense } =
      useContext(financeContext);
  
  const [selectedColor, setSelectedColor] = useState(expense.color);

    const deleteExpenseHandler = async () => {
      try {
        await deleteExpenseCategory(expense.id);
        toast.success("Expense deleted successfully");
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    };
  
    const deleteExpenseItemHandler = async (item) => {
      try {
        //  Remove the item from the list
        const updatedItems = expense.items.filter((i) => i.id !== item.id);
  
        // Update the expense balance
        const updatedExpense = {
          items: [...updatedItems],
          total: expense.total - item.amount,
        };
  
        await deleteExpenseItem(updatedExpense, expense.id);
        toast.success("Expense item deleted successfully");
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
    };
  
  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleUpdateColor = async () => {
    try {
        const updatedExpense = { ...expense, color: selectedColor };
        await updateExpense(updatedExpense);
        toast.success("Expense color updated successfully");
    } catch (error) {
        console.log(error.message);
        toast.error(error.message);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl">{expense.title}</h2>
        <button onClick={deleteExpenseHandler} className="btn btn-danger">
          Delete
        </button>
      </div>
  
      {/* Change Color */}
      <div className="mt-4 flex items-center">
      <label className="mr-2">Pick Color</label>
        <input
          type="color" 
          className="bg bg-slate-500 w-24 h-10"
          value={selectedColor}
          onChange={handleColorChange}        
        />
        <button onClick={handleUpdateColor} className="btn btn-primary ml-2">Update Color</button>
      </div>

      <div>
        <h3 className="my-8 text-2xl">Expense History</h3>
        {expense.items.map((item) => {
          return (
            <div key={item.id} className="flex items-center justify-between">
              <small>
                {item.createdAt && item.createdAt.toMillis
                  ? new Date(item.createdAt.toMillis()).toLocaleString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                      hour12: true
                    })
                  : item.createdAt && new Date(item.createdAt).toLocaleString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                      hour12: true
                    })}
              </small>
              <p className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => {
                    deleteExpenseItemHandler(item);
                  }}
                >
                  <FaRegTrashAlt />
                </button>
                {currencyFormatter(item.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </Modal>
  );
  }
  
  export default ViewExpenseModal;