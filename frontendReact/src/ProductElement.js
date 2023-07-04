export default function ProductElement(props) {
    return <div className="productElement wrapper">
        <div class="box header">
            <div className="productName">{props.name}</div>
            <div className="productType">{props.type}</div>
            <hr/>
        </div>
        <div class="box content">
            <div>
            <img class="productPicture"
            src={"http://localhost:8055/assets/" + props.img}
            alt={props.imgName}></img>
            </div>
            <div>{props.color && <span>Couleur: {props.color} </span>}</div>
            <div>{props.size && <span>Taille : {props.size}</span>}</div>
            <div>Marque :{props.brand}</div>
            <div className="productPrice" style={{
                textDecoration: props.hasDiscount ? 'line-through' : 'none',
                color: props.hasDiscount ? 'red' : 'none'
            }}
            >Prix : {props.price} € </div>
            {props.valueDiscount && <div className="discountPrice">{props.price - props.valueDiscount} €</div>}
            {props.percentDiscount && <div className="discountPrice">{props.price - (props.price * props.percentDiscount/100)} €</div>}
        </div>
        <div class="box footer"><div className="productDesc"><q>{props.description}</q></div>
        </div>
        
    </div>
}