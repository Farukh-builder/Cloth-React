import React from "react";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobal";
import { Message } from "@mui/icons-material";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { T } from "../../../lib/types/common";
import OrderService from "../../services/OrderService";

/** REDUX SLICE & SELECTOR  */
const pausedOrdersRetriever = createSelector(
  retrievePausedOrders, 
  (pausedOrders) => ({ pausedOrders })
);

interface PausedOrdersProps {
   setValue: (input: string) => void
}

export default function PausedOrders(props: PausedOrdersProps) {
   const { setValue } = props
    const { authMember, setOrderBuilder } = useGlobals();
    const { pausedOrders } = useSelector(pausedOrdersRetriever);

   /* HANDLERS */ 

   const deleteOrderHandler = async (e: T) => {
      try {
        if (!authMember) throw new Error(Messages.error2);
        const orderId = e.target.value;
        const input: OrderUpdateInput = {
         orderId: orderId,
         orderStatus: OrderStatus.DELETE,
        };

        const confirmation = window.confirm("Do you want delete the order?");
        if (confirmation) {
         const order = new OrderService();
         await order.updateOrder(input);
         setOrderBuilder(new Date())

        }

      } catch(err) {
        console.log(err);
        sweetErrorHandling(err)
        .then()
   
      }
   }

   const processOrderHandler = async (e: T) => {
      try {
        if (!authMember) throw new Error(Messages.error2);
       // PAYMEnt LOgic

        const orderId = e.target.value;
        const input: OrderUpdateInput = {
         orderId: orderId,
         orderStatus: OrderStatus.PROCESS,
        };

        const confirmation = window.confirm
        ("Do you want to proceed with payment?");
        if (confirmation) {
         const order = new OrderService();
         await order.updateOrder(input);
         setValue("2")
         setOrderBuilder(new Date())
        }

      } catch(err) {
        console.log(err);
        sweetErrorHandling(err)
        .then()
   
      }
   }
   
   
   return (
      <TabPanel value={"1"}>
         <Stack>
            {pausedOrders?.map((order: Order) => {
               return (
                  <Box key={order._id} className={"order-main-box"}>
                     <Box className="order-box-scroll">
                        {order?.orderItems?.map((item: OrderItem) => {
                           const product: Product = 
                           order.productData.filter(
                              (ele: Product) => item.productId === ele._id
                           )[0];
                           const imagePath = `${serverApi}/${product.productImages[0]}`;
                           return (
                              <Box key={item._id} className={"order-name-price"}>
                                 <img
                                    src={imagePath}
                                    className={"order-dish-img"}
                                 />
                                 <Stack sx={{ 
                                    width: 650,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",   
                                 }}>
                                    
                                 <p className={"title-dish"}>{product.productName}</p>
                                 <Box className={"price-box"}>
                                    <p>${item.itemPrice}</p>   
                                    < img src={"/icons/close.svg"} />
                                    <p>{item.itemQuantity}</p>
                                    < img src={"/icons/pause.svg"} />
                                    <p style={{marginLeft: "15px" }}>
                                       ${item.itemQuantity * item.itemPrice}
                                    </p>
                                 </Box>
                                 </Stack>
                              </Box>
                           );
                        })}
                     </Box>

                     <Box className={"total-price-box"}>
                        <Box className={"box-total"}>
                           <p>Product price</p>
                           <p>${order.orderTotal - order.orderDelivery}</p>
                           <img src={"/icons/plus.svg"} style={{ marginLeft: "20px"}} />
                           <p>${order.orderDelivery}</p>
                           <img 
                              src={"/icons/pause.svg"}
                              style={{ marginLeft: "20px" }}
                           />
                           <p>Total</p> 
                           <p>${order.orderTotal}</p>
                        </Box>
                        <Button 
                           value={order._id}
                           variant="contained"
                           color="secondary"
                           className={"cancel-button"}
                           onClick={deleteOrderHandler}
                        >
                           Cancel
                        </Button>
                        <Button 
                        variant="contained" 
                        className={"pay-button"}
                        value={order._id}
                        onClick={processOrderHandler}
                        >
                            Payment
                        </Button>
                     </Box>
                  </Box>
               );
            })}
            
            {!pausedOrders || 
                (pausedOrders.length === 0 && (
               <Box display={"flex"} flexDirection={"row"} justify-content={"center"}>
                  <img 
                     src="/icons/noimage-list.svg"
                     style={{width: 300, height: 300 }}
                  />
               </Box>
            ))}

         </Stack>
      </TabPanel>
   )
}