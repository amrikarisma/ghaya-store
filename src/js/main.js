// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

let gs_carts = JSON.parse(localStorage.getItem('gs_carts'))
if (!gs_carts) {
    gs_carts = {
        amount: 0,
        items: []
    }
}

const init = () => {
    productListItem()
    addToCart()
    renderCarts()
    transaction()

}

const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
}

const productListItem = () => {
    let item;
    const productListWrap = document.querySelector('.product-list-wrap')
    const productData = [
        {
            "id": 'product-1',
            "name": 'Sabun mandi bayi',
            "image": 'https://picsum.photos/200/300?random=1',
            "discount": 15,
            "price": 12500
        },
        {
            "id": 'product-2',
            "name": 'Stroller bayi',
            "image": 'https://picsum.photos/200/300?random=2',
            "price": 1850000
        },
    ];

    localStorage.setItem('productData', JSON.stringify(productData))

    productData.forEach((data, key) => {
        item = `<div id="product-2" class="single-product">
                        <div class="part-1">
                            <div class="product-image"
                                style="background-image: url('${data.image}');">
                            </div>
                            ${data.discount ? `<span class="discount">${data.discount}% off</span>` : ''}
                            <ul>
                                <li><a class="add-cart" data-id="${data.id}" href="#"><i class="fas fa-shopping-cart"></i></a></li>
                                <li><a href="#"><i class="fas fa-heart"></i></a></li>
                                <li><a href="#"><i class="fas fa-plus"></i></a></li>
                                <li><a href="#"><i class="fas fa-expand"></i></a></li>
                            </ul>
                        </div>
                        <div class="part-2">
                            <h3 class="product-title">${data.name}</h3>
                            <h4 class="product-price" data-price="${data.price}">${rupiah(data.price)}</h4>
                        </div>
                    </div>`

        let div = document.createElement('div'); // is a node
        div.className = 'col-6 col-lg-4 col-xl-3'
        div.innerHTML = item

        productListWrap.appendChild(div)

    });
}

const addToCart = () => {
    const addCarts = document.querySelectorAll('.add-cart');
    addCarts.forEach(addCart => {
        addCart.addEventListener('click', function () {
            let cart_exist = false
            let amount = 0
            let cart = {
                "id": addCart.getAttribute('data-id'),
                "name": addCart.closest('.single-product').querySelector('.product-title').textContent,
                "quantity": 1,
                "price": parseInt(addCart.closest('.single-product').querySelector('.product-price').getAttribute('data-price')),
            }
            if (gs_carts && gs_carts.items.length > 0) {
                gs_carts.items.forEach(item => {
                    amount += (parseInt(item.price) * parseInt(item.quantity))
                    console.log(amount)
                    if (item.id == cart.id) {
                        item.quantity += 1;
                        cart_exist = true;
                    }
                });
            }
            if (!cart_exist) {
                amount += (parseInt(cart.price) * parseInt(cart.quantity))
                gs_carts.items.push(cart)
            }

            gs_carts.amount = amount

            localStorage.setItem('gs_carts', JSON.stringify(gs_carts))
            renderCarts()
        });
    });
}

const renderCarts = () => {
    const cartCount = document.querySelector('#cart_count')
    const totalAmount = document.querySelector('#amount')
    const cartListWrap = document.querySelector('.cart-list-wrap')
    cartListWrap.innerHTML = ''
    gs_carts.items.forEach(gs_cart => {
        let product = getProductDetail(gs_cart.id)
        console.log(product)
        let item = `<div class="row mb-4 d-flex justify-content-between align-items-center">
            <div class="col-2">
                <img src="${product.image}"
                    class="img-fluid rounded-3" alt="${product.name}">
            </div>
            <div class="col-3">
                <!-- <h6 class="text-muted">Shirt</h6> -->
                <h6 class="text-black mb-0">${product.name}</h6>
            </div>
            <div class="col-5 d-flex">
                <button class="btn btn-link px-2"
                    onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                    <i class="fas fa-minus"></i>
                </button>

                <input id="form1" min="0" name="quantity" value="${gs_cart.quantity}" type="number"
                    class="form-control form-control-sm" />

                <button class="btn btn-link px-2"
                    onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                    <i class="fas fa-plus"></i>
                </button>
            </div>

            <div class="col-1 text-end">
                <a href="#!" class="text-muted"><i class="fas fa-times"></i></a>
            </div>
            <div class="col-12 mt-3 text-end">
                <h6 class="mb-0">${rupiah(gs_cart.price)}</h6>
            </div>
        </div>
        <hr class="my-4">`


        let div = document.createElement('div'); // is a node
        div.className = 'item-cart position-relative'
        div.innerHTML = item

        cartListWrap.appendChild(div)
    });
    cartCount.textContent = gs_carts.items.length
    totalAmount.textContent = rupiah(gs_carts.amount)
}

const getProductDetail = (id) => {
    let r
    let productData = JSON.parse(localStorage.getItem('productData')) ?? []
    productData.forEach(data => {
        if (data.id === id) {
            r = data
        }
    });

    return r;

}

const transaction = () => {
    // For example trigger on button clicked, or any time you need
    const payButton = document.querySelector('.pay');
    if (payButton) {
        payButton.addEventListener('click', async function () {
            const params = {
                "first_name": payButton.closest('#modalRegister').querySelector('#first_name').value,
                "last_name": payButton.closest('#modalRegister').querySelector('#last_name').value,
                "email": payButton.closest('#modalRegister').querySelector('#email').value,
                "phone": payButton.closest('#modalRegister').querySelector('#phone').value,
                "amount": gs_carts.amount,
                "items": gs_carts.items
            }

            const response = await fetch('https://api-ghaya-birthday.vercel.app/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });

            const data = await response.text();

            window.snap.pay(data);
        });
    }
}

init();
