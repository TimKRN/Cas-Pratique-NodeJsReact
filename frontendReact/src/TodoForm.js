import { useState } from "react";
import ErrorElement from "./ErrorElement";

export default function TodoForm({ setTodos, onTodoListAddSuccess }) {
    const [inputValue, setInputValue] = useState('');
    const [descValue, setDescValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function handleInputChange(event) {
        console.log('la valeur de linput a changé: ', event.target.value);
        setInputValue(event.target.value)
    }

    function ResetInputValues() {
      console.log('ResetInputValues');
      setInputValue('');
      setDescValue('');
    }

    function handleSubmit(e) {
      e.preventDefault();
      console.log(inputValue);
      console.log(descValue);
      const myTodo = {
        name: inputValue,
        description: descValue,
        isDone: false,
        isLoading: true,
      }

      setTodos((lesTodosQuueExistentDeja) => lesTodosQuueExistentDeja.concat([myTodo]));

      postTodo();
  }

    async function postTodo() {
      setLoading(true);
      console.log({
        name : inputValue,
        description : descValue,
        isDone : false
      });
        try {
          const response = await fetch("http://localhost:3001/api/todo", {
            method: "POST", // or 'PUT'
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name : inputValue,
              description : descValue,
              isDone : false
            })
          });

          console.log('response', response);
      
          const result = await response.json();
          console.log("Success:", result);

          if (response.ok == false) {
            console.log('response', response)
            setError(result.error.message);
            throw new Error(error);
          }

          onTodoListAddSuccess();
          ResetInputValues();
        } catch (err) {
          console.error("Error:", err);
        }
        finally {
          setLoading(false);
        }
      }

    function handleDescInputChange(event) {
        setDescValue(event.target.value);
    }

    let errorsTable = [];

    function createEelementFromString(errorString, index) {
      return <ErrorElement description={errorString} key={index} />
    }

    if (error) {
      let myErrors = error.replace('todo validation failed:', '').split(',');
      // myErrors.forEach((error, index) => {
      //   errorsTable.push(
      //       <ErrorElement description={error} key={index} />
      //       );
      // });
      // errorsTable = myErrors.map(function(errorString, index) {
      //   return <ErrorElement description={errorString} key={index} />
      // });
      // myErrors = myErrors.split(',');
      for (let index = 0; index < myErrors.length; index++) {
        errorsTable.push(
        <ErrorElement description={myErrors[index]} key={index} />
        );
      }
    }

    
    return (
    <form>
        {loading && <div>Merci de patentier</div>}
        <label htmlFor="name">Que faut-il faire ?</label>
        <input onChange={handleInputChange} value={inputValue} type="text" name="name" id="name" />
        <br/>
        <label htmlFor="desc">Décrire la tâche à executer</label>
        <input onChange={handleDescInputChange} value={descValue} type="text" name="desc" id="desc" />
        <button id="addToDo" onClick={handleSubmit} disabled={loading}>Ajouter la todo</button>
        {error && <div className="displayError" >Errors:<ul>{errorsTable}</ul></div>}
    </form>
    )
}