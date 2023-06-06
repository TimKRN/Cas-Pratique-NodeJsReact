export default function ProductElement(props) {
    return <div className="productElement">
        <div className="productName">{props.name}</div>
        <div className="productDesc">{props.description}</div>
        <div className="productPrice">{props.price} € </div>
    </div>
}