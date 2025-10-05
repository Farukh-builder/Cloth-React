import React, { ChangeEvent, useEffect, useState } from "react";
import {Box, Button, Container, Pagination, PaginationItem, Stack,} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Badge from "@mui/material/Badge";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setProducts } from "./slice";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { createSelector } from "reselect";
import {  retrieveChosenProduct,  retrieveProducts,  retrieveStore} from "./selector";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

/** REDUX SLICE & SELECTOR  */
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(
  retrieveProducts, 
  (products) => ({ products })
);

interface ProductsProps {
  onAdd: (item: CartItem) => void;
};



export default function Products(props: ProductsProps) {
    const { onAdd } = props;
    const { setProducts } = actionDispatch(useDispatch());
    const { products } = useSelector(productsRetriever);
    const [productSearch, setProductSearch] = useState<ProductInquiry>({ 
      page: 1,
      limit: 8,
      order: "createdAt",
      productCollection: ProductCollection.CLOTHS,
      search: ""
    });
    const [searchText, setSearchText] = useState<string>("");
    const history = useHistory()

  useEffect(() => {
    const product = new ProductService();
    product.getProducts(productSearch)
    .then((data) => setProducts(data))
    .catch((err) => console.log(err));
  }, [productSearch]);

  useEffect(() => {
    if (searchText === "") {
      productSearch.search = "";
      setProductSearch({ ...productSearch})
    }

  }, [searchText])

  /** HANDLERS **/ 

 const searchCollectionHandler = (collection: ProductCollection) => {
  productSearch.page = 1;
  productSearch.productCollection = collection;
  setProductSearch({ ...productSearch });
 };

 const searchOrderHandler = (order: string) => {
  productSearch.page = 1;
  productSearch.order = order;
  setProductSearch({ ...productSearch });
 };

 const searchProductHandler = () => {
  productSearch.search = searchText;
  setProductSearch({...productSearch });

 };

 const paginationHandler = (e: ChangeEvent<any>, value: number) => {
  productSearch.page = value;
  setProductSearch({ ...productSearch });
 };

 const chooseDishHandler = (id: string) => {
   history.push(`/products/${id}`)

 }

  return (
    <div className={"products"}>
      <Container>
        <Stack flexDirection={"column"} alignItems={"center"}>
          <Stack className={"avatar-big-box"} direction={"row"}>
            <Box className={"title-txt"}>Cloth Store</Box>
            <Stack direction="row" className="search-container">
              <Box
                component="input"
                placeholder="Type here"
                className="search-input"
                value={searchText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  searchProductHandler();
                }
              }}


              />
              <Button
                variant="contained"
                className="search-button"
                disableRipple
                endIcon={<SearchIcon />}
                onClick={searchProductHandler}
              >
                SEARCH
              </Button>
            </Stack>
          </Stack>
          <Stack className={"dishes-filter-section"}></Stack>
          <Stack className={"list-category-section"}></Stack>
          <Stack className={"pagination-section"}></Stack>
        </Stack>

        <Stack className={"dishes-filter-section"}>
          <Stack className={"dishes-filter-box"}>
            <Button variant={"contained"}
              className={"order"} 
              color={productSearch.order === "createdAt" ? "primary" : "secondary"} 
              onClick={() => searchOrderHandler("createdAt")}>
              New
            </Button>
            <Button
              variant={"contained"}
              color={productSearch.order === "productPrice" ? "primary" : "secondary"} 
              onClick={() => searchOrderHandler("productPrice")}
              className={"order"}
            >
              Price
            </Button>
            <Button
              variant={"contained"}
              color={productSearch.order === "productViews" ? "primary" : "secondary"} 
              onClick={() => searchOrderHandler("productViews")}
              className={"order"}
            >
              Views
            </Button>
          </Stack>
        </Stack>

        <Stack className={"list-category-section"}>
          <Stack className={"product-category"}>
            <div className={"second-button"}>
              <Button
                variant={"contained"}
                 color={productSearch.productCollection === ProductCollection.GLOVES 
                  ? "primary" 
                  : "secondary"
                }
                className="order-2"
                onClick={() => searchCollectionHandler(ProductCollection.GLOVES)}
              >
                GLOVES
              </Button>
              <Button
                variant={"contained"}
                color={productSearch.productCollection === ProductCollection.SNEAKERS 
                  ? "primary" 
                  : "secondary"
                }
                className="order-2"
                onClick={() => searchCollectionHandler(ProductCollection.SNEAKERS)}
              >
                SNEAKERS
              </Button>
              <Button
                variant={"contained"}
                 color={productSearch.productCollection === ProductCollection.T_SHIRT 
                  ? "primary" 
                  : "secondary"
                }
                className="order-2"
                onClick={() => searchCollectionHandler(ProductCollection.T_SHIRT)}
              >
                T_SHIRT
              </Button>
              <Button
                variant={"contained"}
                 color={productSearch.productCollection === ProductCollection.PANTS 
                  ? "primary" 
                  : "secondary"
                }
                className="order-2"
                onClick={() => searchCollectionHandler(ProductCollection.PANTS)}
              >
                PANTS
              </Button>
              <Button
                variant={"contained"}
                color={productSearch.productCollection === ProductCollection.CLOTHS 
                  ? "primary" 
                  : "secondary"
                }
                className="order-2"
                onClick={() => searchCollectionHandler(ProductCollection.CLOTHS)}
              >
                CLOTHS
              </Button>
            </div>
          </Stack>

          <Stack className="product-wrapper">
            {products.length !== 0 ? (
              products.map((product: Product) => {
                const imagePath = `${serverApi}/${product.productImages[0]}`;
                return (
                  <Stack
                    key={product._id}
                    className={"product-card"}
                    onClick={() => chooseDishHandler(product._id)} 
                  >

                    <Stack
                      className="product-img"
                      sx={{ backgroundImage: ` url(${imagePath}) ` }}
                    >                      <Button 
                      className="shop-btn"
                      onClick={(e) => {
                        onAdd({
                          _id: product._id,
                          quantity: 1,
                          name: product.productName,
                          price: product.productPrice,
                          image: product.productImages[0],
                        })
                        e.stopPropagation();
                      }}

                      >
                        <img
                          src={"/icons/shopping-cart.svg"}
                          style={{ display: "flex" }}
                        />
                      </Button>
                      <Button className="view-btn" sx={{ right: "36px" }}>
                        <Badge badgeContent={product.productViews} color="secondary">
                          <RemoveRedEyeIcon
                            sx={{
                              color: product.productViews === 0 ? "gray" : "white",
                            }}
                          />
                        </Badge>
                      </Button>
                    </Stack>
                    <Box className="product-desc">
                      <span className="product-title">
                        {product.productName}
                      </span>
                      <div className="product-desc2">
                        <MonetizationOnIcon />
                        {product.productPrice}
                      </div>
                    </Box>
                  </Stack>
                );
              })
            ) : (
              <Box className="no-data">Product are not available</Box>
            )}
          </Stack>
        </Stack>

        <Stack className={"pagination-section"}>
          <Pagination
            count={products.length !== 0
              ? productSearch.page + 1
              : productSearch.page
            }
            page={productSearch.page}
            renderItem={(item) => (
              <PaginationItem
                components={{
                  previous: ArrowBackIcon,
                  next: ArrowForwardIcon,
                }}
                {...item}
                color={"secondary"}
              />
            )}
            onChange={paginationHandler}
          />
        </Stack>
      </Container>

      <div className={"brands-logo"}>
        <Container>
          <Stack className="logo-frame">
            <Box className="logo-text">Our Family Brands</Box>
            <Stack className="image-frame" direction={"row"}>
              <Box className="image-shadow">
                <img src="/img/zara.png" alt="Gurme" />
              </Box>
              <Box className="image-shadow">
                <img src="/img/gucci.png" alt="Seafood" />
              </Box>
              <Box className="image-shadow">
                <img src="/img/nike.webp" alt="Sweets" />
              </Box>
              <Box className="image-shadow">
                <img src="/img/Dolce.jpg" alt="Doner" />
              </Box>
            </Stack>
          </Stack>
        </Container>
      </div>

      <div className={"address"}>
        <Container>
          <Stack className={"adress-area"}>
            <Box className={"title"}>Our adress</Box>
            <iframe
              style={{ marginTop: "60px" }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3291.686648758332!2d71.79075895230578!3d40.375932179657376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bb856b3bbcf6a7%3A0x3d5eaa1e873253c6!2sEuroLab!5e0!3m2!1sen!2s!4v1753943913676!5m2!1sen!2s"
              width="1320"
              height="500"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Stack>
        </Container>
      </div>
    </div>
  );
}


