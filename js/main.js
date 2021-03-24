// catalog

(function () {
  var catalogSection = document.querySelector(".section-catalog");

  if (catalogSection === null) {
    return;
  }

  var removeChildren = function (item) {
    while (item.firstChild) {
      item.removeChild(item.firstChild);
    }
  };

  var updateChildren = function (item, children) {
    removeChildren(item);
    for (var i = 0; i < children.length; i += 1) {
      item.appendChild(children[i]);
    }
  };

  var catalog = catalogSection.querySelector(".catalog");
  var catalogNav = catalogSection.querySelector(".catalog-nav");
  var catalogItems = catalogSection.querySelectorAll(".catalog__item");

  catalogNav.addEventListener("click", function (e) {
    var target = e.target;
    var item = myLib.closestItemByClass(target, "catalog-nav__btn");

    if (item === null || item.classList.contains("is-active")) {
      return;
    }

    e.preventDefault();
    var filterValue = item.getAttribute("data-filter");
    var previousBtnActive = catalogNav.querySelector(
      ".catalog-nav__btn.is-active"
    );

    previousBtnActive.classList.remove("is-active");
    item.classList.add("is-active");

    if (filterValue === "all") {
      updateChildren(catalog, catalogItems);
      return;
    }

    var filteredItems = [];
    for (var i = 0; i < catalogItems.length; i += 1) {
      var current = catalogItems[i];
      if (current.getAttribute("data-category") === filterValue) {
        filteredItems.push(current);
      }
    }

    updateChildren(catalog, filteredItems);
  });
})();

//   catalog

// form
(function () {
  var forms = document.querySelectorAll(".form-send");
  if (forms.lenght === 0) {
    return;
  }

  var serialize = function (form) {
    var items = form.querySelectorAll("input,  select,textarea ");
    var str = "";
    for (var i = 0; i < items.lenght; i += 1) {
      var item = items[i];
      var name = item.name;
      var value = item.value;
      var separator = i === 0 ? "" : "&";
      if (name) {
        str += separator + name + "=" + value;
      }
    }
    return str;
  };

  var formSend = function (form) {
    var data = serialize(form);
    var xhr = new XMLHttpRequest();
    var url = "mail/main.php";
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
      var activePopup = document.querySelector(".popup.is-active");
      if (activePopup) {
        activePopup.classList.remove("is-active");
      } else {
        MyLib.toggleScroll();
      }
      if (xhr.response === "success") {
        document.querySelector(".popup-thanks").classList.add("is-active");
      } else {
        document.querySelector(".popup-error").classList.add("is-active");
      }
      form.reset();
    };
    xhr.send(data);
  };
  for (var i = 0; i < forms.length; i += 1) {
    forms[i].addEventListener("submit", function (e) {
      e.preventDefault();
      var form = e.currentTarget;
      formSend(form);
    });
  }
})();
// form

// map
(function () {
  if (typeof ymaps === "undefined") {
    return;
  }
  ymaps.ready(function () {
    var myMap = new ymaps.Map(
        "ymap",
        {
          center: [55.7552332, 37.517779],
          zoom: 14,
        },
        {
          searchControlProvider: "yandex#search",
        }
      ),
      myPlacemark = new ymaps.Placemark(
        myMap.getCenter(),
        {
          hintContent: "A custom placemark icon",
          balloonContent: " г.Москва, Преображенская площадь ",
        },
        {
          iconLayout: "default#image",
          // Custom image for the placemark icon.
          iconImageHref: "../img/common/marker.svg",
          // The size of the placemark.
          iconImageSize: [40, 63],
          /**
           * The offset of the upper left corner of the icon relative
           * to its "tail" (the anchor point).
           */
          iconImageOffset: [-5, -38],
        }
      );
    myMap.geoObjects.add(myPlacemark);
    myMap.behaviors.disable("scrollZoom");
  });
})();
// map.js
// myLip
(function () {
  window.myLib = {};
  window.myLib.body = document.querySelector("body");
  window.myLib.closestAttr = function (item, attr) {
    var node = item;
    while (node) {
      var attrValue = node.getAttribute(attr);
      if (attrValue) {
        return attrValue;
      }
      node = node.parentElement;
    }
    return null;
  };
  window.myLib.closestItemByClass = function (item, className) {
    var node = item;
    while (node) {
      if (node.classList.contains(className)) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  };
  window.myLib.toggleScroll = function () {
    myLib.body.classList.toggle("no-scroll");
  };
})();
// mylip

// popup
(function () {
  var showPopup = function (target) {
    target.classList.add("is-active");
  };
  var closePopup = function (target) {
    target.classList.remove("is-active");
  };

  var toggleScroll = function () {
    body.classList.toggle("no-scroll");
  };
  myLib.body.addEventListener("click", function (e) {
    var target = e.target;
    var popupClass = myLib.closestAttr(target, "data-popup");
    if (popupClass === null) {
      return;
    }

    e.preventDefault();
    var popup = document.querySelector("." + popupClass);
    if (popup) {
      showPopup(popup);
      myLib.toggleScroll();
    }
  });
  myLib.body.addEventListener("click", function (e) {
    var target = e.target;
    if (
      target.classList.contains("popup-close") ||
      target.classList.contains("popup__inner")
    ) {
      var popup = myLib.closestItemByClass(target, "popup");
      closePopup(popup);
      myLib.toggleScroll();
    }
  });
  myLib.body.addEventListener("keydown", function (e) {
    if (e.keyCode !== 27) {
      return;
    }
    var popup = document.querySelector(".popup.is-active");
    if (popup) {
      closePopup(popup);
      myLib.toggleScroll();
      toggleScroll();
    }
  });
})();
// popopu

// product
(function () {
  var catalog = document.querySelector(".catalog");
  if (catalog === null) {
    return;
  }
  var updateProductPrice = function (product, price) {
    var productPrice = product.querySelector(".product__price-value");
    productPrice.textContent = price;
  };
  var changeProductSize = function (target) {
    var product = myLib.closestItemByClass(target, "product");
    var previousBtnActive = product.querySelector(".product__size.is-active");
    var newPrice = target.getAttribute("data-product-size-price");
    previousBtnActive.classList.remove("is-active");
    target.classList.add("is-active");
    updateProductPrice(product, newPrice);
  };
  var changeProductOrderInfo = function (target) {
    var product = myLib.closestItemByClass(target, "product");
    var order = document.querySelector(".popup-order");
    var productTitle = product.querySelector(".product__title").textContent;
    var productSize = product.querySelector(".product__size.is-active")
      .textContent;
    var productPrice = product.querySelector(".product__price-value")
      .textContent;
    var productImgSrc = product
      .querySelector(".product__img")
      .getAttribute("src");

    order
      .querySelector(".order-info-title")
      .setAttribute("value", productTitle);
    order.querySelector(".order-info-size").setAttribute("value", productSize);
    order
      .querySelector(".order-info-price")
      .setAttribute("value", productPrice);

    order.querySelector(".order-product-title").textContent = productTitle;
    order.querySelector(".order-product-price").textContent = productPrice;
    order.querySelector(".order__size").textContent = productSize;
    order.querySelector(".order__img").setAttribute("src", productImgSrc);
  };

  catalog.addEventListener("click", function (e) {
    var target = e.target;
    if (
      target.classList.contains("product__size") &&
      !target.classList.contains("is-active")
    ) {
      console.log(target);
      e.preventDefault();
      changeProductSize(target);
    }
    if (target.classList.contains("product__btn")) {
      e.preventDefault();
      changeProductOrderInfo(target);
    }
  });
})();

// product

// scrollTo
(function () {
  var scroll = function (target) {
    var targetTop = target.getBoundingClientRect().top;
    var scrollTop = window.pageYOffset;

    var targetOffsetTop = targetTop + scrollTop;
    var headerOffset = document.querySelector(".header-page").clientHeight;

    window.scrollTo(0, targetOffsetTop - headerOffset + 1);
  };
  myLib.body.addEventListener("click", function (e) {
    var target = e.target;
    var scrollToitemmClass = myLib.closestAttr(target, "data-scroll-to");
    if (scrollToitemmClass === null) {
      return;
    }

    e.preventDefault();
    var scrollToitemm = document.querySelector("." + scrollToitemmClass);
    if (scrollToitemm) {
      scroll(scrollToitemm);
    }
  });
})();
