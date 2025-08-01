const product_grid = document.querySelector("#product-grid")
const AddToCartBtn = document.querySelectorAll(".add-to-cart-btn")
const cart_empty_msg = document.querySelector(".cart-empty-msg")
const cart_items = document.querySelector("#cart-items")
const total_price = document.querySelector("#total-price")
const cart_total_Layout = document.querySelector("#cart-section")

let CartArr = []
let AllProducts = []
product_grid.innerHTML = ""

const SavedCart = localStorage.getItem("userCart")
if(SavedCart){
    CartArr = JSON.parse(SavedCart)
}
UpdateCartDisplay()

async function FetchProduct(){
    try {
        const data = await fetch("https://fakestoreapi.com/products") 

        if(!data.ok){
            console.log("Error 404 , Product Not Found")
            return;
        }

        const response = await data.json()

        response.forEach(element => {
            AllProducts.push(element)
            const product_card = document.createElement("div")
            product_card.className = "product-card"

            product_card.innerHTML = `
                <img src=${element.image} alt=${element.title}>
                <h3 class="product-info">${element.title}</h3>            
                <h4 class="product-info">Category : ${element.category}</h4>
                <span class="price product-info">Price : ₹${element.price}</span>
                <button class="add-to-cart-btn" id="${element.id}">Add to Cart</button>
            `
            product_grid.appendChild(product_card) 
            
        });

        console.log(response[5].title)
    } catch (error) {
        product_grid.innerHTML = "Some Error in showing the Product !! Come back soon"
        console.log("Some Error in showing the Product !! Come back soon")       
    }
}

product_grid.addEventListener("click",function(event){
    if(event.target.classList.contains("add-to-cart-btn")){
        const ProductID = event.target.id
        console.log(ProductID)
        AddProducttoCart(ProductID)
    }
})

function AddProducttoCart(ProductID){
    const Product = AllProducts.find(p => p.id == ProductID)
    console.log(Product)

    if(Product){

        const Exist = CartArr.find(p => p.id == ProductID)

        if(Exist){
            Exist.quantity++;
        }
        else{
            CartArr.push({...Product , quantity: 1})
        }

        UpdateCartDisplay();
        


    }

}

function UpdateCartDisplay(){
    cart_empty_msg.innerHTML = ""
    cart_items.innerHTML = ""
   
    CartArr.forEach(element => {

        const Cardd_each_item = document.createElement("div")
        Cardd_each_item.className = "cart-item"

        Cardd_each_item.innerHTML += `
           <img src=${element.image} alt=${element.title} width=50px>
           <h4>${element.title}</h4> 

           <div class="cart-item-info">
                <div class="quantity-controls">
                    <button class="quantity-btn decrease-btn" id="${element.id}">-</button>
                    <span class="item-quantity">${element.quantity}</span>
                    <button class="quantity-btn increase-btn" id="${element.id}">+</button>
                </div>
                
            </div>    
           
            <div class="cart-item-price">
                 <p>₹${(element.price * element.quantity).toFixed(2)}</p>
            </div>     

        `    

        cart_items.appendChild(Cardd_each_item)
    });
    const TotalValue = CalculateTotalPrice()
    total_price.innerHTML = TotalValue
    saveCartToLocalStorage();

}



function CalculateTotalPrice(){
    let value = 0;
    CartArr.forEach(element =>{
        if(element.quantity > 1){
            value += (Number(element.price) * Number(element.quantity))
        }
        else{
            value = value + Number(element.price)
        }       
    })
     return value.toFixed(2)
}


function saveCartToLocalStorage() {
    // cart array ko JSON string mein badal kar save karna
    localStorage.setItem('userCart', JSON.stringify(CartArr));
}


// CheckOut Button 
cart_total_Layout.addEventListener("click",function(event){
    if(event.target.classList.contains("Checkout")){
        console.log("Checkoutttt")
        
        if(CartArr.length > 0){
            CartArr = []
            localStorage.removeItem("userCart")
            UpdateCartDisplay()
            window.location.href = 'checkout.html'
        }
        else{
            window.location.href = 'Freecheckout.html'

        }

    }

    if(event.target.classList.contains("increase-btn")){
        console.log(event.target.id)
        const Increase = event.target.id
        
        const IncreseProduct = CartArr.find(p => p.id == Increase)
        IncreseProduct.quantity ++

        UpdateCartDisplay()
    }
    if(event.target.classList.contains("decrease-btn")){
        console.log(event.target.id)
        const Decrease = event.target.id
        
        const DecreaseProduct = CartArr.find(p => p.id == Decrease)
        if(DecreaseProduct.quantity > 1){
            DecreaseProduct.quantity--
        }
        else{
            const index = CartArr.indexOf(DecreaseProduct)

            if(index> -1){
                CartArr.splice(index , 1)
            }
        }
        UpdateCartDisplay()
         
    }
})



FetchProduct()


