import { useState } from "react";

export default function TodoElement({todo, onTodoListDone}) {

  const [loading, setLoading] = useState(false);

    function handleChange(event) {
        let isItDone= event.target.checked;
        console.log(isItDone);
        let heildy= todo._id;
        handleTaskDone(heildy, isItDone);
    }

    async function handleTaskDone(heildy, isItDone) {
          try {
            setLoading(true);
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/todo/"+heildy, {
              method: "PUT", 
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                isDone : isItDone
              })
            });
        
            const result = await response.json();
            console.log("Success:", result);
            onTodoListDone();
          } catch (error) {
            console.error("Error:", error);
          }
          finally {
            setLoading(false);
          }
        }

        async function handleDelete() {
            try {
              setLoading(true);
              const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/todo/"+todo._id, {
                method: "DELETE", 
                headers: {
                  "Content-Type": "application/json",
                },
              });
          
              const result = await response.json();
              console.log("C'est supprimé:", result);
              onTodoListDone();
            } catch (error) {
              console.error("Error:", error);
            }
            finally {
              setLoading(false);
            }
          }

    return (
      <li className={`${todo.isDone === true ? 'taskDone' : ''} ${todo.isLoading || loading ? "listOnWaiting": ''}`} >
        <span className="taskText">{todo.name} - {todo.description}</span>
        <input className="checkBox" onChange={handleChange} type="checkbox" checked={todo.isDone} />
        <button onClick={handleDelete}>🗑</button>
      </li>
    )
}