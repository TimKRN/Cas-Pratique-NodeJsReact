import { useState, useEffect } from "react";
import TodoElement from "./TodoElement";
import ProductElement from "./ProductElement";
import TodoForm from "./TodoForm";
import { Directus } from '@directus/sdk';

const directus = new Directus('http://localhost:8055');

export default function app() {
  const [isTodoListOpen, setTodoListOpen] = useState(false);
  const [isProductListOpen, setProductListOpen] = useState(true);
  const [todos, setTodos] = useState([]);
  const [products, setProducts] = useState([]);
  const [img, setImg] = useState([]);
  const [productsWithImg, setProductsWithImg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleTodoListClick = () => setTodoListOpen(!isTodoListOpen);
  const handleProductListClick = () => setProductListOpen(!isProductListOpen)


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
      //console.log('new todo list', actualData.todolist);

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

  useEffect(() => {
    // Ici pas accès à response
    const getData = async () => {
      try {
        const products = await directus.items('article').readByQuery({
          sort: ['id'],
          fields: [
            '*',
            'images.*',
            'article_files.*',
            'productid.name',
            'productid.description',
            'productid.typeid.name',
            'discountid.value',
            'discountid.percent_value',
            'productid.brandid.name'
          ]
        });
        setProducts(products.data);

        const img = await directus.items('article_image').readByQuery({
          sort: ['id'],
          fields: [
            '*'
          ]
        });
        setImg(img.data);

        const productsWithImg = products.data.map((product) => {
          const associatedImg = img.data.filter(
            (image) => image.articleid === product.id
          );
          return {
            ...product,
            img: associatedImg
          };
        });
  
        console.log(productsWithImg);
        setProductsWithImg(productsWithImg);
  
        setError(null);

        
        // const response = await fetch(
        //   `http://localhost:3001/api/pg/products/`
        // );
        // if (!response.ok) {
        //   throw new Error(
        //     `This is an HTTP error: The status is ${response.status}`
        //   );
        // }
        // let actualData = await response.json();
        // //console.log('actualData',products);
        // console.log('actualData.products', actualData);
        // setProducts(actualData);
        // setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setProducts(null);
      } finally {
        setLoading(false);
      }
    }
    getData()
  }, [])

  useEffect(() => {
    // Ici pas accès à response
    refreshList()
  }, [])

  const mesJolisLi = [];
  for (let index = 0; index < todos.length; index++) {
    mesJolisLi.push(
      <TodoElement
        todo={todos[index]}
        onTodoListDone={refreshList}
      />
    );
  }

  const mesJolisProducts = [];
  for (let index = 0; index < productsWithImg.length; index++) {
    mesJolisProducts.push(
      <ProductElement 
        name={productsWithImg[index].productid.name}
        color={productsWithImg[index].color}
        size={productsWithImg[index].size}
        price={productsWithImg[index].total_price}
        slug={productsWithImg[index].slug}
        description={productsWithImg[index].productid.description}
        brand={productsWithImg[index].productid.brandid.name}
        type={productsWithImg[index].productid.typeid.name}
        hasDiscount={productsWithImg[index].discountid?.percent_value || productsWithImg[index].discountid?.value}
        percentDiscount={productsWithImg[index].discountid?.percent_value}
        valueDiscount={productsWithImg[index].discountid?.value}
        imgName={productsWithImg[index].img[0].name}
        img={productsWithImg[index].img[0].image}
        key={index}
      />
    );
  }

  const loadingHtml = <p>Merci de patienter...</p>;
  
  return (
    <>
      <h1 onClick={handleTodoListClick}>To do list</h1>
      {isTodoListOpen && (
        <div className="todo">
          <ul id="todolist" className={loading ? 'listOnWaiting' : ''}>
            {mesJolisLi}
          </ul>
          {loading && loadingHtml}
          <TodoForm onTodoListAddSuccess={refreshList} setTodos={setTodos} />
        </div>
      )}

      <div className="liSeperation"></div>
      <div className="liSeperation"></div>

      <div className={isProductListOpen ? 'containerProductsList' : ''} id='titleMargin'>
        <h1 className={isProductListOpen ? 'titleWithBg' : ''} onClick={handleProductListClick} style={{marginTop: '3rem'}}>Products list</h1>
        {isProductListOpen && (
          <div className="products">
            <ul id="productlist">
              {mesJolisProducts}
            </ul>
          </div>
      )}
      </div>
    </>
  );

}