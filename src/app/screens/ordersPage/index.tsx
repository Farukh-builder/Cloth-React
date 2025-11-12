import TabContext from "@mui/lab/TabContext";
import { Box, Button, Container, Stack } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Divider from "../../components/divider";
import "../../../css/order.css";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobal";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";

/** REDUX SLICE & SELECTOR  */
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});


export default function OrdersPage() {
  const {setPausedOrders, setProcessOrders, setFinishedOrders} = 
  actionDispatch(useDispatch());
  const {orderBuilder, authMember} = useGlobals();
  const history = useHistory();
  const [value, setValue] = useState("1");
  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();

    order.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE})
    .then((data) => setPausedOrders(data))
    .catch((err) => console.log(err));

   order.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS})
    .then((data) => setProcessOrders(data))
    .catch((err) => console.log(err));

    order.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH})
    .then((data) => setFinishedOrders(data))
    .catch((err) => console.log(err));
  }, [orderInquiry, orderBuilder])


  /** HANDLERS **/ 

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!authMember) history.push("/");
  return (
    <div className="order-page">
      <Container className="order-container">
        <Stack className="order-left">
          <TabContext value={value}>
            <Box className={"order-nav-frame"}>
              <Box sx={{ borderBottom: 1, borderColor: "divider", paddingBottom: 3, paddingLeft: 3}}>
                <Tabs 
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example" 
                  className={"table_list"}
                >
                  <Tab label="PAUSED ORDERS" value={"1"} />
                  <Tab label="PROCESS ORDERS" value={"2"} />
                  <Tab label="FINISHED ORDERS" value={"3"} />
                </Tabs>
              </Box>
            </Box>
             <Stack className={"order-main-content"}>
                <PausedOrders setValue={setValue} />
                <ProcessOrders setValue={setValue}  />
                <FinishedOrders />
             </Stack>
          </TabContext>
        </Stack>

        <Stack className={"order-right"}>
            <Stack className="user-detail">
                <Stack className="user-image">
                  <img className="user-img" src={authMember?.memberImage
                      ? `${serverApi}/${authMember.memberImage}`
                      : "/icons/default-user.svg"} 
                      />
                      <div className={"order-user-icon-box"}>
                        <img src={
                          authMember?.memberImage === MemberType.STORE
                                ? ""
                                : ""} 
                        className={"order-user-prof-img"}
                        />
                      </div>
                  <span className={"user-name"}>{authMember?.memberNick}</span>
                  <span className={"user-ident"}>{authMember?.memberType}</span>
                </Stack>
                  <Divider height="1" width="300" bg="black"/>
                  <Stack className="user-detail-bottom">
                    <img className="user-location-img" src={"/icons/location.svg"} />
                    <p className="user-location-p">{authMember?.memberAdrress ? 
                  authMember.memberAdrress 
                  : "do not exist"}</p>
                  </Stack>
            </Stack>

            <Stack className={"payment-detail"}>
              <Stack className="card-detail">
                <Box className="card-number" >Card Number: 1234 2345 3456 6789</Box>
                <Stack className="time">
                  <Box className="month-day">07/24</Box>
                  <Box className="CVV">CVV: 010</Box>
                </Stack>
                <Box className="customer-name">Justin Robertson</Box>

              </Stack>
              <Stack className="cards-img">
                  <img className="cards" src="/icons/western-card.svg" />
                  <img className="cards" src="/icons/master-card.svg" />
                  <img className="cards" src="/icons/paypal-card.svg" />
                  <img className="cards" src="/icons/visa-card.svg" />
              </Stack>

            </Stack>
        </Stack>
      </Container>
    </div>
  )   
}