const categoryList = document.querySelector(".categories");
const productsList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const modalList = document.querySelector(".modal-list");
const openBtn = document.querySelector("#open-btn");
const closeBtn = document.querySelector("#close-btn");
const modalInfo = document.querySelector(".modal-info");

//! html yüklendiğinde veri çekmesi için
//document.addEventListener("DOMContentLoaded", fetchCategories);
//document.addEventListener("DOMContentLoaded", fetchProduct);
// yukarıdakine alternatif olarak callback fonksiyon tanımlanabilir ve içerisine diğer çağırılacaklar da eklenir.
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProduct();
});

function fetchCategories() {
  //! fetch ile siteye istek gönderiyoruz
  fetch("https://api.escuelajs.co/api/v1/categories")
    //! site bize cevap veriyor ve cevabı json olarak çeviriyoruz
    .then((res) => res.json())
    //! slice ile alacağımız veri adedini belirledik
    //! forEach ile aldığımız verilerin her birini döndürdük.
    .then((data) =>
      data.slice(0, 4).forEach((category) => {
        //! buradan category bakılarak değerlerin keylerini alıyoruz
        console.log(category);
        // constract yapısı ile daha kolay tanımlanır.
        const { image, name } = category;
        // her bir objeyi div oluşturma
        const categoryDiv = document.createElement("div");
        // class ekleme
        categoryDiv.classList.add("category");
        // div içine html atma
        categoryDiv.innerHTML = `
        <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
        <span>${name}</span>
        `;
        // categorileri listeye çekme
        categoryList.appendChild(categoryDiv);
      })
    );
}

// ürünleri çekme
function fetchProduct() {
  // apite istek atma
  fetch("https://fakestoreapi.com/products")
    //istek başarılı olursa json ile veri cevabını alıyoruz
    .then((res) => res.json())
    //isteği veri halinde işleyeceğiz
    .then((data) =>
      data.slice(0, 12).forEach((products) => {
        // ürünleri isimlerini görme
        console.log(products);

        // ürünleri çektik ve işleyeceğiz
        // div oluşturma
        const productDiv = document.createElement("div");
        // class ekleme
        productDiv.classList.add("product");
        // html ekleme
        productDiv.innerHTML = `
        <img src="${products.image}" alt="" />
            <p>${products.title}</p>
            <p>${products.category}</p>
            <div class="product-action">
              <p>${products.price}$</p>
              <button onclick="addToBasket({id:${products.id},title:'${products.title}',image:'${products.image}',price:${products.price},amount:1})">Sepete Ekle</button>
            </div>`;
        // listeye divi ekleme
        productsList.appendChild(productDiv);
      })
    );
}

// sepet
//! sepete ekle içindeki html ile yazılı olduğu için htmlde click işleni onClick() ile yapılıyor.

let basket = [];
let total = 0;

// sepete ekleme işlemi
function addToBasket(products) {
  //! dizide eleman arama find
  //sepette bu elemandan varsa onu değişkene aktar
  const foundItem = basket.find((basketItem) => basketItem.id === products.id);
  if (foundItem) {
    //
    foundItem.amount++;
  } else {
    //eğer elemanda sepette bulamadıysa sepete ekle
    basket.push(products);
  }
  console.log(basket);
}

// sepet
// açma kapama
openBtn.addEventListener("click", () => {
  // class ekleme
  modal.classList.add("active");

  // sepetin içine ürünleri listeleme
  addList();
  // toplam günceleme
  modalInfo.innerText = total.toFixed(2);
});

closeBtn.addEventListener("click", () => {
  // class çıkarma
  modal.classList.remove("active");
  modalList.innerHTML = "";
  // toplam değeri sıfırlama
  total = 0;
  modalInfo.innerText = total.toFixed(2);
});

// sepet listeleme
function addList() {
  modalList.innerHTML = "";
  total = 0;
  basket.forEach((basketItem) => {
    console.log(basketItem);

    // div ekleme
    const modalListDiv = document.createElement("div");
    // class
    modalListDiv.classList.add("list-item");
    // html
    modalListDiv.innerHTML = `
            <img src="${basketItem.image}" alt="" />
            <h2>${basketItem.title}</h2>
            <h2 class="price">${basketItem.price}</h2>
            <p>Miktar: ${basketItem.amount}</p>
            <button id="del" onclick="deleteItem({id:${basketItem.id},price:${basketItem.price},amount:${basketItem.amount}})">Sil</button>`;
    modalList.appendChild(modalListDiv);

    // toplam değişkenini güncelleme
    total += basketItem.price * basketItem.amount;
  });
  modalInfo.innerText = total.toFixed(2);
}

// sepet dizisinden silme fonksiyonu
function deleteItem(deletingItem) {
  basket = basket.filter((i) => i.id !== deletingItem.id);
  // silinen elemanı totalden çıkartma
  total -= deletingItem.price * deletingItem.amount;
  console.log(typeof total);

  // sepet boşaldığında toplamı sıfırla
  if (basket.length === 0) {
    total = 0;
  }

  modalInfo.innerText = total.toFixed(2);
  addList();
}

// eleman html silme
modalList.addEventListener("click", (e) => {
  if (e.target.id === "del") {
    e.target.parentElement.remove();
  }
});

// dışarı tıklamayla kapatma
//! classliste contains kullanılır include hata veriyor.
modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-wrapper")) {
    // class çıkarma
    modal.classList.remove("active");
    modalList.innerHTML = "";
  }
});
