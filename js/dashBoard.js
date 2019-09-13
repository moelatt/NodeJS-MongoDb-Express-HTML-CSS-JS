if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
}
else{
    ready();
}

function ready(){
    // remove button in cart
    var removeCartItemButtons = document.getElementsByClassName('btn-danger');
    for(var i = 0; i < removeCartItemButtons.length; i++){
        var button = removeCartItemButtons[i];
        button.addEventListener('click', removeCartItem) // call removeCartIten function
    }
    // quantity change in cart
    var quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for(var i = 0; i < quantityInputs.length; i++){
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
    // item add to cart
    var addToCartButton = document.getElementsByClassName('shop-item-button');
    for(var i = 0; i < addToCartButton.length; i++){
        var cartButton = addToCartButton[i];
        cartButton.addEventListener('click', addToCartClicked)
    }
    // when purchase button click this will trigger.****
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseButtonClicked);
}
// update total amount in screen
function updateCartTotal(){
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;
    var totalQuantity = 0;
    var totalItem = [];
    for(var i = 0; i < cartRows.length; i++){
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value;
        total = total + (price * quantity);
        totalQuantity = totalQuantity + parseInt(quantity);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total;
    return {
        first: totalQuantity,
        second: total
    };
}


// when event listener click remove button click  this func will trigger
function removeCartItem(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}
// when event listener click quantity change button click  this func will trigger
function quantityChanged(event){
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1
    }
    updateCartTotal();
}

function addToCartClicked(event){
    var button = event.target;
    var shopItem = button.parentElement.parentElement.parentElement.parentElement;
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}

function addItemToCart(title, price, imageSrc){
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    var totalTitle = new Array();
    for(var i = 0; i < cartItemNames.length; i++){
        if(cartItemNames[i].innerText == title){
            alert('This item is already added to the cart');
            return
        }
    }
    var cartRowContents = `
    <div class="cart-item cart-column">
        <img src="${imageSrc}" width="100" height="100" alt="" class="cart-item-image">
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <input type="number" value="1" class="cart-quantity-input">
        <button class="btn btn-danger" type="button">Remove</button>
    </div>`

    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);   
}


// when purchase button click
function purchaseButtonClicked(){
    var totalQuantity = updateCartTotal().first;
    var totalValue = updateCartTotal().second;
    
    confirm(`Thank you for you purchase. Total price is $${totalValue} and quantity is ${totalQuantity}`);
    var cartItems = document.getElementsByClassName('cart-items')[0];
    // ******* update all item in cart to zero
    while(cartItems.hasChildNodes()){
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal();
}