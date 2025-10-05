/**react app state**/
import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";

 
/**react app state**/
export interface AppRootState {
    homePage: HomePageState;
    productsPage: ProductPageState;
    ordersPage: OrdersPageState
}
/**homePage**/
export interface HomePageState {
    popularDishes: Product[];
    newDishes: Product[];
    topUsers: Member[];
}

/****Products page */
export interface ProductPageState {
    store: Member | null;
    chosenProduct: Product | null;
    products: Product[];
}

/**orderspage */

export interface OrdersPageState {
    pausedOrders: Order[];
    processOrders: Order[];
    finishedOrders: Order[];
}