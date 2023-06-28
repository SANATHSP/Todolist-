import {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const [dueDate, setDueDate] = useState(''); //new state varaible for due date
  const [reminder, setReminder]= useState(false);  // new state variable for reminder

  // Add new todo item to database
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5500/api/item', {
        item: itemText,
        dueDate: dueDate, // Include due date in the request payload
        reminder: reminder, // Include reminder in the request payload
      });
      setListItems(prev => [...prev, res.data]);
      setItemText('');
      setDueDate(''); // Clear the due date input
      setReminder(false); // Reset the reminder input
    } catch (err) {
      console.log(err);
    }
  }


  //Create function to fetch all todo items from database -- we will use useEffect hook
  useEffect(()=>{
    const getItemsList = async () => {
      try{
        const res = await axios.get('http://localhost:5500/api/items')
        setListItems(res.data);
        console.log('render')
      }catch(err){
        console.log(err);
      }
    }
    getItemsList()
  },[]);

  // Delete item when click on delete
  const deleteItem = async (id) => {
    try{
      const res = await axios.delete(`http://localhost:5500/api/item/${id}`)
      const newListItems = listItems.filter(item=> item._id !== id);
      setListItems(newListItems);
    }catch(err){
      console.log(err);
    }
  }

  //Update item
  const updateItem = async (e) => {
    e.preventDefault()
    try{
      const res = await axios.put(`http://localhost:5500/api/item/${isUpdating}`, {item: updateItemText})
      console.log(res.data)
      const updatedItemIndex = listItems.findIndex(item => item._id === isUpdating);
      const updatedItem = listItems[updatedItemIndex].item = updateItemText;
      setUpdateItemText('');
      setIsUpdating('');
    }catch(err){
      console.log(err);
    }
  }
  //before updating item we need to show input field where we will create our updated item
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e)=>{updateItem(e)}} >
      <input className="update-new-input" type="text" placeholder="New Item" onChange={e=>{setUpdateItemText(e.target.value)}} value={updateItemText} />
      <button className="update-new-btn" type="submit">Update</button>
    </form>
  )

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form className="form" onSubmit={e => addItem(e)}>
        <input type="text" placeholder='Add Todo Item' onChange={e => {setItemText(e.target.value)} } value={itemText} />
        <input type="date" placeholder="Due Date" onChange={e => { setDueDate(e.target.value) }} value={dueDate} /> {/* New input for due date */}
        <label>
          <input type="checkbox" checked={reminder} onChange={e => setReminder(e.target.checked)} /> {/* New input for reminder */}
          Reminder
        </label>
        <button type="submit">Add</button>
      </form>
      <div className="todo-listItems">
        {listItems.map(item => (
          <div className="todo-item" key={item._id}>
            {isUpdating === item._id ? (
            renderUpdateForm()
             ) : ( 
             <>
                  <p className="item-content">{item.item}</p>
                  <p className="due-date">Due Date: {item.dueDate}</p> {/* Display the due date */}
                  <p className="reminder">Reminder: {item.reminder ? 'Yes' : 'No'}</p> {/* Display the reminder */}
                  <button className="update-item" onClick={()=>{setIsUpdating(item._id)}}>Update</button>
                  <button className="delete-item" onClick={()=>{deleteItem(item._id)}}>Delete</button>
                </>
            )}
          </div>
          ))
        }
        

      </div>
    </div>
  );
}

export default App;