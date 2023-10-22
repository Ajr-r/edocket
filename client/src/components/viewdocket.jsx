import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
export function Viewdocket() {
    const nameRef = useRef(null)
    const [data, setdata] = useState([])
    const [l, setl] = useState(false)
    const [obid,setobid]=useState(null)
    const [idx,setidx]=useState(null)
    const nav=useNavigate()

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (e) => {
        const itemId = e.target.getAttribute("data");
        const index = e.target.getAttribute("i");
        setobid(itemId)
        setidx(index)
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    
    
    function find() {
        let name = nameRef.current.value
        axios.get(`/api/find?name=${name}`).then((r) => {
            if (r.data.length == 0) {
                alert('No dockets present under that name')
                return
            }
            setdata(r.data)
            setl(true)
            // console.log(r.data)

        })
    }
    function del(e) {
    
       
        closeModal();
        axios.get(`/api/del?id=${obid}`).then((r) => {
            alert(r.data)
        })
        .then(() => {
            let updatedData = [...data]; // Create a new array based on the current state
            updatedData.splice(idx, 1); // Remove the item at the specified index
            setdata(updatedData); // Update the state with the new array
           
            
        })
    }

    // console.log(data)
    return (
        <div className="veiw">
            <h1 style={{ margin: '20px' }}>VIEW DOCKET</h1>
            <label htmlFor="name" style={{ margin: '10px' }}>Enter name
                <input type="text" ref={nameRef} style={{ margin: '10px' }} placeholder="John Carmack" />
            </label>
            <div>

            <button style={{padding:'1px'}} onClick={find}>Find docket</button>
            <button style={{padding:'1px',margin:'10px'}} onClick={()=>nav('/')}>Home</button>
            </div>
            {l&&data.map((item, index) => (
                <div key={item._id} className="card" style={{ margin: '10px', display: 'flex', flexDirection: 'column', border: '1px solid grey', padding: '20px', borderRadius: '10px',height:'260px' ,marginTop:'40px'}}>
                    <p style={{marginTop:'25px'}}><b>Name:</b> {item.name}</p>
                    <table style={{ width: '700px', marginTop: '10px', textAlign: 'center', padding: '5px' }}>
                        <tbody>

                        <tr>
                            <td style={{ border: '1px solid black', padding: '2px' }}>
                                <b>Start Time:</b> {item.stime}
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <b>End Time:</b> {item.etime}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '2px' }}>
                                <b>Hours Worked:</b> {item.nrs}
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <b>Rate/Hr:</b> {item.rph}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <p style={{ marginTop: '10px' }}>
                        <b>Supplier Name:</b> {item.sname}
                    </p>
                    <p style={{ marginTop: '10px' }}>
                        <b>Product Name:</b> {item.pname}
                    </p>
                    <p style={{ marginTop: '10px' }}>
                        <b>Number:</b> {item.num}
                    </p>
                    <button className="dbtn" data={item._id} i={index} onClick={openModal}>Delete</button>
                </div>
            ))}

            
           
            {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure on deleting this Docket?</p>
            <div>

            <button onClick={del}>Yes</button>
            <button onClick={closeModal}>No</button>
            </div>
          </div>
        </div>)
      }

        </div>


    )
}