import React, { useEffect, useState, useRef } from "react";
import axios from 'axios'
import { useNavigate } from "react-router";
export function Createdocket() {
    const nav=useNavigate()
    const [list, setlist] = useState([])
    const [ll, setll] = useState(false)
    const [sname, setsname] = useState()
    const [po, setpo] = useState()
    const [lp, setlp] = useState(false)

    const nameRef = useRef(null);
    const stimeRef = useRef(null);
    const etimeRef = useRef(null);
    const nrsRef = useRef(null);
    const rphRef = useRef(null);
    const snameRef = useRef(null);
    const pnameRef = useRef(null);

    useEffect(() => {
        axios.get('/api/list')
            .then((r) => {
                let s = r.data

                setlist(s)
                setll(true)
            }).catch(() => alert('error occured while fetching list data'))
    }, [])
    function reqPo(e) {
        // console.log(e.target.value)
        if (e.target.value == 'placeholder') {
            setlp(false)
            return
        }
        setsname(e.target.value)
        axios.get(`/api/po?id=${e.target.value}`)
            .then((r) => {
                // console.log(r.data)
                setpo(r.data)
                setlp(true)
            })
            .catch(() => alert('error occured while fetching data'))
    }
    function submit(e) {
        // console.log(po)
        e.preventDefault()
         // Validation flags
  let hasError = false;
  let errorMessage = "";

  // Validate name
  const nameValue = nameRef.current.value;
  if (nameValue.trim() === "" || !/^[a-zA-Z\s]*$/.test(nameValue)) {
    errorMessage += "Name should not be empty and contain only letters and spaces.\n";
    hasError = true;
  }

  // Validate hours worked (nrs)
  const nrsValue = nrsRef.current.value;
  if (isNaN(nrsValue) || nrsValue <= 0) {
    errorMessage += "No. hours worked should be a positive number.\n";
    hasError = true;
  }

  // Validate rate per hour (rph)
  const rphValue = rphRef.current.value;
  if (isNaN(rphValue) || rphValue <= 0) {
    errorMessage += "Rate per hour should be a positive number.\n";
    hasError = true;
  }
  if(snameRef.current.value=='placeholder'){
    errorMessage += "Please select supplier name.\n";
    hasError = true;

  }
  if(pnameRef.current.value=='placeholder'){
    errorMessage += "Please select purchase order.\n";
    hasError = true;

  }

  // Display error message and prevent submission if there are errors
  if (hasError) {
    alert(errorMessage);
    return;
  }
        const selectedOption = pnameRef.current.selectedOptions[0];
        // Access the custom data attribute
        const ponum = selectedOption.getAttribute('data');
        // console.log(customData)
        const formData = {
            name: nameRef.current.value,
            stime: stimeRef.current.value,
            etime: etimeRef.current.value,
            nrs: nrsRef.current.value,
            rph: rphRef.current.value,
            sname: snameRef.current.value,
            pname: pnameRef.current.value,
            num: ponum
        };
        axios.post('/api/add', { formData }).then((r) => {
          if(r.data=='pass')nav('../sub')
    else alert(r.data)
        })
    }
    return (
        <div className="createdocket">
            <form className="form" style={{ display: 'flex', flexDirection: 'column' }}>
                <table>
                    <tbody>
                        <tr>
                            <td>

                                <label htmlFor="name">Name
                                </label>
                            </td>
                            <td>
                                <input type="text" name="name" ref={nameRef} />

                            </td>
                        </tr>
                        <tr>
                            <td>

                                <label htmlFor="stime">Start time
                                </label>
                            </td>
                            <td>

                                <input type="time" name="stime" ref={stimeRef} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="etime">End time
                                </label>

                            </td>
                            <td>
                                <input type="time" name="etime" ref={etimeRef} />

                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="nrs">No. hours worked
                                </label>

                            </td>
                            <td>
                                <input type="number" name="nrs" ref={nrsRef} min={1}/>

                            </td>
                        </tr>
                        <tr>
                            <td>

                                <label htmlFor="rph">Rate per hour
                                </label>
                            </td>
                            <td>

                                <input type="number" name="rph" ref={rphRef} min={1}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="name">Supplier name
                                </label>

                            </td>
                            <td>
                                <select name="sname" id="" onChange={reqPo} ref={snameRef}>
                                    <option value="placeholder" defaultValue={true}>select supplier</option>
                                    {ll && list.map((i,idx) => {
                                        // console.log(idx)
                                        return (
                                            <option value={i} key={idx}>{i}</option>
                                        )
                                    })}
                                </select>

                            </td>
                        </tr>
                        <tr>
                            <td>

                                <label htmlFor="name">Purchase order
                                </label>
                            </td>
                            <td>

                                <select name="pname" id="" ref={pnameRef}>
                                    <option value="placeholder" defaultValue={true}>select order</option>
                                    {lp && po.map((i,idx) => {
                                        return (
                                            <option data={i[Object.keys(i)[0]]} value={Object.keys(i)[0]} key={idx}>{Object.keys(i)[0]}</option>
                                        )
                                    })}
                                </select>
                            </td>
                        </tr>
                    </tbody>

                </table>





                <div>




                </div>
                <button onClick={submit}>SUBMIT</button>
            </form>
        </div>
    )
}