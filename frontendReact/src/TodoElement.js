import { useState } from "react";

export default function TodoElement(props) {

  const [loading, setLoading] = useState(false);

    function handleChange(event) {
        let isItDone= event.target.checked;
        console.log(isItDone);
        let heildy= props.id;
        handleTaskDone(heildy, isItDone);
    }

    async function handleTaskDone(heildy, isItDone) {
          try {
            setLoading(true);
            const response = await fetch("http://localhost:3001/api/todo/"+heildy, {
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
            props.onTodoListDone();
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
              const response = await fetch("http://localhost:3001/api/todo/"+props.id, {
                method: "DELETE", 
                headers: {
                  "Content-Type": "application/json",
                },
              });
          
              const result = await response.json();
              console.log("C'est supprimé:", result);
              props.onTodoListDone();
            } catch (error) {
              console.error("Error:", error);
            }
            finally {
              setLoading(false);
            }
          }

    return (
      <li className={`${props.isDone === true ? 'taskDone' : ''} ${props.isLoading || loading ? "listOnWaiting": ''}`} >
        {props.name} - {props.description}
        <input onChange={handleChange} type="checkbox" checked={props.isDone} />
        <button onClick={handleDelete}>🗑</button>
      </li>
    )
}