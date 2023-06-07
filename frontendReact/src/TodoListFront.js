import { useState, useEffect } from "react";
import TodoElement from "./TodoElement";
import ProductElement from "./ProductElement";
import TodoForm from "./TodoForm";

export default function app() {
  const [todos, setTodos] = useState([]);
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  async function refreshList() {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/todo/`
      );
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      let actualData = await response.json();
      console.log('new todo list', actualData.todolist);

      // let myTodos = [];
      // for (let index = 0; index < actualData.todolist.length; index++) {
      //   const newTodo = {
      //     ...actualData.todolist[index],
      //     isLoading: false,
      //   }
      //   myTodos.push(newTodo)
      // }

      const myTodos = actualData.todolist.map((todo) => {
        return {
          ...todo,
          isLoading: false,
        }
      })
      setTodos(myTodos);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setTodos(null);
    } finally {
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   // Ici pas accès à response
  //   const getData = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:3001/api/products/`
  //       );
  //       if (!response.ok) {
  //         throw new Error(
  //           `This is an HTTP error: The status is ${response.status}`
  //         );
  //       }
  //       let actualData = await response.json();
  //       console.log('actualData',products);
  //       console.log('actualData.products', actualData.products);
  //       setProducts(actualData.products);
  //       setError(null);
  //     } catch (err) {
  //       console.error(err);
  //       setError(err.message);
  //       setProducts(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   getData()
  // }, [])

  useEffect(() => {
    // Ici pas accès à response
    refreshList()
  }, [])

  const mesJolisLi = [];
  for (let index = 0; index < todos.length; index++) {
    mesJolisLi.push(
      <TodoElement
        name={todos[index].name}
        description={todos[index].description}
        isDone={todos[index].isDone}
        id={todos[index]._id} key={index}
        onTodoListDone={refreshList}
        isLoading={todos[index].isLoading}
      />
    );
  }

  const mesJolisProducts = [];
  for (let index = 0; index < products.length; index++) {
    mesJolisProducts.push(
      <ProductElement name={products[index].name} description={products[index].description} price={products[index].price} key={index} />
    );
  }

  const loadingHtml = <p>Merci de patienter...</p>;
  
  return (
    <>
      <h1>To do list</h1>
      <div className="todo">
        <ul id="todolist" className={loading ? 'listOnWaiting' : ''}>
          {mesJolisLi}
        </ul>
        {loading && loadingHtml}
        <TodoForm onTodoListAddSuccess={refreshList} setTodos={setTodos} />
      </div>

      <h1 style={{marginTop: '3rem'}}>Product list</h1>
      <div className="products">
        <ul id="productlist">
          {mesJolisProducts}
        </ul>
      </div>
    </>
  );

}