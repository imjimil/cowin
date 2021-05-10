import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

function SlotsComponent() {

    const [state, setstate] = useState([]); //saves state info(id,name)
    const [SelectedValue, setSelectedValue] = useState(); //value of selected state dropdown
    const [Districts, setDistricts] = useState([]); //saves district of selected state(id, name)
    const [DistrictValue, setDistrictValue] = useState(); //value of selected district dropdown
    const [Check, setCheck] = useState(false);
    const [StartDate, setStartDate] = useState(new Date());
    const [FeeType, setFeeType] = useState("any");
    const [Centers, setCenters] = useState([])

    useEffect(() => {
        fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
        .then(response => response.json())
        .then(result => {
            console.log(result);
            setstate(result.states)
        })
        .catch(error => console.log('error', error));
    }, [])

    function onCheck() {
        setCheck(!Check);
    }

    function renderStates() {
        return(state.map(data => ({ label:data.state_name, value:data.state_id })))
    }

    const handleChange = e => {
        setSelectedValue(e.value);
        fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${e.value}`)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            setDistricts(response.districts);
        })
        .catch(err => console.log(err))
      }

      const handleDistrictChange = e => {
        setDistrictValue(e.value);
      }

      function renderDestricts() {
            return(Districts.map(data => ({ label:data.district_name, value:data.district_id })))
      }

      const options = [
        { value: 'paid', label: 'Paid' },
        { value: 'free', label: 'Free' },
        { value: 'any', label: 'Any' }
      ]

      const handleFeeType = e => {
        setFeeType(e.value);
      }

      const handleSubmit = e => {
          e.preventDefault();
          if(!(SelectedValue && DistrictValue)) {
              alert("enter the information first")
          }
          else {
            const date=StartDate.getDate() + "-"+ parseInt(StartDate.getMonth()+1) +"-"+StartDate.getFullYear();        
            console.log(date);
            axios.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict', {
                params: {
                    district_id: DistrictValue,
                    date: date
                }
            })
            .then(response => response.data)
            .then(response => {
                console.log(response);
                setCenters(response.centers);
                alert("Results Found")
            })
            }
      }
    
    return (
        <>
        <div>
           <h2 className="text-center font-weight-light bg-dark text-primary p-2">Check Locations and Slots</h2>
        </div>
        <div style={{width:'95%', margin:'20px auto'}}>
            <div className="row">
                <div className="col-md-4 offset-md-2">
                    <div className="form-outline">
                        <Select 
                            placeholder="Select option" 
                            onChange={handleChange} 
                            options={renderStates()} 
                        />
                    <label className="form-label font-weight-bold">State</label>
                    <div>Selected value {SelectedValue}</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-outline">
                    <Select 
                        placeholder="Select option"
                        onChange={handleDistrictChange}
                        options={renderDestricts()}
                    />
                    <label className="form-label font-weight-bold">District</label>
                    <div>district value is {DistrictValue}</div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-6 offset-md-2 col-md-2">
                    <div className="form-outline">
                    <Select 
                            onChange={handleFeeType} 
                            options={options}
                            defaultValue={options.find(val => val.value === "any")}
                    />
                    <label className="form-label font-weight-bold">Type(Free/Paid)</label>
                    </div>
                </div>
                <div className="col-6 col-md-2">
                    <div className="form-outline">
                    <input type="checkbox" id="form8Example4" className="form-check-inline" value="available" onChange={onCheck} />
                    <label className="form-label font-weight-bold">Available Now</label>
                    </div>
                </div>
                {!Check && <div className="col-12 col-md-4">
                    <div className="form-outline">
                        <ReactDatePicker closeOnScroll={true} dateFormat="dd/MM/yyyy" selected={StartDate} onChange={date => setStartDate(date)} className="form-control" />
                        {/* <input type="date" onChange={date => setStartDate(date)} className="form-control" /> */}
                    <div className="form-label font-weight-bold">Date</div>
                    </div>
                </div>}
            </div>
            <div className="text-center mt-3">
                <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
        </>
    )
}

export default SlotsComponent;