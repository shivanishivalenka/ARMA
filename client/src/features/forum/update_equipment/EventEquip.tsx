import { BusinessCenter, Close } from "@material-ui/icons";
import { userInfo } from "os";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate, useLocation } from "react-router-dom";
import { InputField } from "../../../components/InputField/InputField";
import { useUser } from "../../../providers/user/UserProvider";
import axios from "../../../utils/axios";
import { RootState } from "../../../redux/reducers";
import { Spinner } from "../../../components/Spinner/Spinner";
import { Dialog } from "../../../components/Dialog/Dialog";

export default function EventEquip() {
  const navigate = useNavigate();
  const location: any = useLocation();
  const [equipment, setEquipment] = useState("");
  const [quantity, setQuantity] = useState("");
  const [addError, setAddError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [list, setList] = useState<{}[]>([]);
  const { forum } = useUser();
  const [myequip, setMyequip] = useState<{}[]>();
  const eventDates = useSelector((state: RootState) => state.eventDates);
  const eventDetails = useSelector((state: RootState) => state.eventDetails);

  useEffect(() => {
    const getequip = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}events/getEventEquipment/${location.state.eventId}`
      );
      const data = res.data.response;
      setList(
        data.map((item) => {
          return {
            equipment: item.equipmentType?.name,
            quantity: item.quantity,
          };
        })
      );
      const res1 = await axios.get(
        process.env.REACT_APP_SERVER_URL + "forum/getEquipments"
      );
      const data1 = res1.data.response;
      let arr = [];
      for (let i = 0; i < data1.length; i++) {
        arr.push({ value: data1[i].name, label: data1[i].name });
      }
      setMyequip(arr);
      setLoading(false);
    };
    getequip();
  }, []);

  return (
    <div className="flex flex-col sm:mx-24 mt-8 md:items-start items-center mb-8 ">
      <Dialog show={showDialog} setShow={setShowDialog} title={dialogMessage} />
      <span className="text-arma-title sm:text-4xl  text-2xl mb-8 font-semibold">
        Update Equipment
      </span>
      <div className="flex gap-2">
        <span className="text-arma-gray text-lg mb-8 font-semibold">
          Choose Equipment
        </span>
        <BusinessCenter className="text-arma-title" />
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col md:flex-row gap-y-6 items-center sm:gap-x-6 ">
          <div className=" flex flex-col gap-y-6  md:flex-row sm:gap-x-8">
            <Select
              name="Equipment"
              placeholder="Equipment"
              options={myequip}
              onChange={(e: any) => {
                setEquipment(e.value);
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 52,
                  minWidth: 270,
                  borderRadius: "0.5rem",
                  border: "2px solid rgb(200, 200, 200)",
                }),

                placeholder: (base) => ({
                  ...base,
                  paddingLeft: "16px",
                }),
                singleValue: (base) => ({
                  ...base,
                  paddingLeft: "16px",
                  color: "#575757e1",
                }),
              }}
              className="basic-multi-select "
            />
          </div>
          <div className=" flex flex-col gap-y-6  md:flex-row sm:gap-x-8">
            <InputField
              name="Quantity"
              type="text"
              onChange={(e: any) => setQuantity(e.target.value)}
            />
          </div>
          <button
            className="btn  bg-arma-title rounded-[8px] px-6 py-2 my-auto"
            onClick={() => {
              if (!equipment || !quantity) {
                setAddError("Please fill details");
                return;
              }
              if (list.find((eqi: any) => eqi.equipment === equipment)) {
                setAddError("Equipment already added");
                return;
              }
              setList([...list, { equipment: equipment, quantity: quantity }]);
            }}
          >
            ADD
          </button>
          <button
            className="btn  bg-arma-title rounded-[8px] px-6 py-2 my-auto"
            onClick={() => {
              console.log(list);
              axios
                .post(
                  `${process.env.REACT_APP_SERVER_URL}events/updateEventEquipment`,
                  { equipmentList: list, id: location.state.eventId }
                )
                .then((response) => {
                  console.log(response);
                  if (response.data.status == -1) {
                    setDialogMessage(response.data.response);
                    setShowDialog(true);
                  } else {
                    navigate(-1);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          >
            submit
          </button>
        </div>
      )}

      <span className="text-red-500 ml-2 mt-4 mb-4 h-6 ">{addError}</span>

      <div className="flex gap-6 flex-wrap w-[80%] sm:w-[600px]">
        {list.map((li: any, i) => {
          return (
            <div className="flex justify-between bg-white shadow-lg py-5 px-4 w-max gap-6 rounded-[8px] basis-[100px] shrink">
              <span>{li.equipment}</span>
              <span>{li.quantity}</span>
              <Close
                className="cursor-pointer"
                onClick={() => {
                  let temp = [...list];
                  temp.splice(i, 1);
                  setList(temp);
                }}
              />
            </div>
          );
        })}
      </div>

      {/* <div className="flex flex-col sm:w-[40%]">
             {
                 list.map((r:any,i) => {
                     return(
                         <div className="flex justify-between shadow-md px-4 py-2 hover:bg-black/[0.05]">
                             <span>{r.equipment}</span>
                             <span>{r.quantity}</span>
                             <Close className="cursor-pointer"onClick ={() => {
                                 let temp = [...list]
                                 temp.splice(i,1)
                                 setList(temp)
                             }}/>
                         </div>
                     )
                 })
             }

         </div> */}
    </div>
  );
}

//   data.response -> [{name:"mic", totalCount:8}, {name:"speaker"}]
//   ar=[]
//   loop i
//   ar.push({value:i.name, label:i.name})
//   options={ar}

//   const res = await axios.get(env+'forum/getEquipments')
//   user
//   const res = await axios.post(env+'forum/profile',{
//     name: user.name
//   })

//  const data = await res.data

//   {
//     "name": "name"
//   }
