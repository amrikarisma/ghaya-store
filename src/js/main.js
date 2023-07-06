// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'




const init = () => {
    productListItem()
}

const productListItem = () => {
    const productListWrap = document.querySelector('.product-list-wrap')
    const productData = [
        {
            "title": 'Sabun mandi bayi',
            "discount": 15,
            "price": '12.500'
        },
        {
            "title": 'Stroller bayi',
            "price": '1.850.000'
        },
    ];
    let item;

    productData.forEach((data, key) => {
        item = `<div id="product-2" class="single-product">
                        <div class="part-1">
                            <div class="product-image"
                                style="background-image: url('https://picsum.photos/200/300??random=${key}');">
                            </div>
                            ${data.discount ? `<span class="discount">${data.discount}% off</span>` : ''}
                            <ul>
                                <li><a href="#"><i class="fas fa-shopping-cart"></i></a></li>
                                <li><a href="#"><i class="fas fa-heart"></i></a></li>
                                <li><a href="#"><i class="fas fa-plus"></i></a></li>
                                <li><a href="#"><i class="fas fa-expand"></i></a></li>
                            </ul>
                        </div>
                        <div class="part-2">
                            <h3 class="product-title">${data.title}</h3>
                            <h4 class="product-price">Rp. ${data.price}</h4>
                        </div>
                    </div>`

        let div = document.createElement('div'); // is a node
        div.className = 'col-md-6 col-lg-4 col-xl-3'
        div.innerHTML = item

        productListWrap.appendChild(div)
    });
}

init();
