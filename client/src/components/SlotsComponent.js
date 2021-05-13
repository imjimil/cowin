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
    const [Checked, setChecked] = useState(true);
    const [StartDate, setStartDate] = useState(new Date());
    const [FeeType, setFeeType] = useState("Free");
    const [AgeLimit, setAgeLimit] = useState(45)
    const [Centers, setCenters] = useState([]);
    const [WeekCenters, setWeekCenters] = useState([]);
    const [Vaccine, setVaccine] = useState("COVISHIELD")

    useEffect(() => {
        fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
        .then(response => response.json())
        .then(result => {
            console.log(result);
            setstate(result.states);
        })
        .catch(error => console.log('error', error));
    }, [])

    function onCheck() {
        setChecked(!Checked);
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
        { value: 'Paid', label: 'Paid' },
        { value: 'Free', label: 'Free' }
      ]

      const age = [
        { value: 18, label: '18-45' },
        { value: 45, label: '45+' }
      ]

      const vaccine = [
        { value: "COVISHIELD", label: 'Covishield' },
        { value: "COVAXIN", label: 'Covaxin' }
      ]

      const handleFeeType = e => {
        setFeeType(e.value);
      }

      const handleAge = e => {
          setAgeLimit(e.value)
      }

      const handleVaccine = e => {
          setVaccine(e.value)
      }
      // eslint-disable-next-line no-lone-blocks
      {/* Using this is disble keyboard from popping up in mobile which makes is easier to choose date */}
      const onDatepickerRef = (el) => { if (el && el.input) { el.input.readOnly = true; } }

      const handleSubmit = e => {
          e.preventDefault();
          if(!(SelectedValue && DistrictValue)) {
              alert("enter the information first")
          }
          else if(Checked) {
              const date = new Date();
              const todayDate=date.getDate() + "-"+ parseInt(date.getMonth()+1) +"-"+date.getFullYear();
              console.log(todayDate);
              axios.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict', {
                params: {
                    district_id: DistrictValue,
                    date: todayDate
                }
            })
            .then(response => response.data)
            .then(response => {
                console.log(response);
                const dm = response.sessions;
                if(dm.length <=0){alert("No slots available")}
                setCenters(response.sessions);
            })
          }
          else {
            const date=StartDate.getDate() + "-"+ parseInt(StartDate.getMonth()+1) +"-"+StartDate.getFullYear();       
            console.log('7 days' + date);
            axios.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict', {
                params: {
                    district_id: DistrictValue,
                    date: date
                }
            })
            .then(response => response.data)
            .then(response => {
                console.log(response.centers);
                const dm = response.centers;
                if(dm.length <=0){alert("No Centers Found")}
                setWeekCenters(response.centers);
            })
            }
      }

      const renderTableBody = Centers.filter(val => val.fee_type === FeeType && val.min_age_limit === AgeLimit && val.vaccine === Vaccine).map((value, index) => {
          return(
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{value.date}</td>
                <td className="font-weight-bold">{value.available_capacity !== 0 ? <div className="text-success">{value.available_capacity}</div> : <div className="text-danger">{value.available_capacity}</div>}</td>
                <td className="font-weight-bold">{value.vaccine}</td>
                <td>{value.min_age_limit + "+"}</td>
                <td className="font-weight-bold">{value.name}</td>
                <td>{value.address}</td>
                <td>{value.pincode}</td>
                <td>{value.fee === '0' ? "Free" : value.fee}</td>
            </tr>
          );
      })
      
      const renderWeekTableBody = WeekCenters.map((value, index) => {
          return(
            <tr key={index}>
            <td>{index + 1}</td>
            <td className="p-0">
                {value.sessions.map((val) => (
                <tr><td>{val.date}</td></tr>
                ))}
            </td>
            <td className='p-0'>
                {value.sessions.map((val) => (
                  <tr><td>{val.available_capacity <= 0 ? <div className="badge badge-danger">No Slots</div> : <div className="text-success font-weight-bold">{val.available_capacity}</div>}</td></tr>
                 ))}
            </td>
            <td className='p-0'>
                {value.sessions.map((val) => (
                  <tr><td className="font-weight-bold">{val.vaccine}</td></tr>
                 ))}
            </td>
            <td className='p-0'>
                {value.sessions.map((val) => (
                  <tr><td>{val.min_age_limit + "+"}</td></tr>
                 ))}
            </td>
            <td className="font-weight-bold">{value.name}</td>
            <td style={{maxWidth: '200px'}}>{value.address}</td>
            <td>{value.pincode}</td>
            <td>{value.fee_type}</td>
        </tr>
          );
      })
    
    return (
        <>
        <h3 className="text-center m-2 text-primary">Availability by District</h3>
        <div style={{width:'95%', margin:'20px auto'}}>
            <div className="row">
                <div className="col-md-4 offset-md-2">
                    <div className="form-outline">
                        <Select 
                            isSearchable={false}
                            placeholder="Select option" 
                            onChange={handleChange} 
                            options={renderStates()}
                        />
                    <label className="form-label font-weight-bold">State</label>
                    {/* <div>Selected value {SelectedValue}</div> */}
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-outline">
                    <Select 
                        isSearchable={false}
                        placeholder="Select option"
                        onChange={handleDistrictChange}
                        options={renderDestricts()}
                    />
                    <label className="form-label font-weight-bold">District</label>
                    {/* <div>district value is {DistrictValue}</div> */}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-6 offset-md-2 col-md-2">
                    <div className="form-outline">
                    <Select 
                        isSearchable={false}
                        onChange={handleFeeType} 
                        options={options}
                        defaultValue={options.find(val => val.value === "Free")}
                    />
                    <label className="form-label font-weight-bold">Type(Free/Paid)</label>
                    </div>
                </div>
                <div className="col-6 col-md-2">
                    <div className="form-outline">
                    <Select 
                        options={age}
                        onChange={handleAge}
                        isSearchable={false}
                        defaultValue={age.find(val => val.value === 45)} 
                    />
                    <label className="form-label font-weight-bold">Minimum age</label>
                    </div>
                </div>
                <div className="col-6 col-md-2">
                    <div className="form-outline">
                    <Select 
                        options={vaccine}
                        isSearchable={false}
                        onChange={handleVaccine}
                        defaultValue={vaccine.find(val => val.value === "COVISHIELD")} 
                    />
                    <label className="form-label font-weight-bold">Vaccine</label>
                    </div>
                </div>
                <div className="col-6 col-md-2">
                    <div className="form-outline mt-2">
                    <input type="checkbox" className="form-check-inline" value="available" onClick={onCheck} checked={Checked} />
                    <label className="form-label font-weight-bold">Available Now</label>
                    </div>
                </div>
            </div>
            <div className="row">
                    {!Checked && <div className="offset-3 col-6 offset-md-2 col-md-4">
                        <div className="form-outline">
                            <ReactDatePicker closeOnScroll={true} dateFormat="dd/MM/yyyy" selected={StartDate} onChange={date => setStartDate(date)} className="form-control" ref={(el)=> onDatepickerRef(el)}/>
                            {/* <input type="date" onChange={date => setStartDate(date)} className="form-control" /> */}
                        <div className="form-label font-weight-bold">Date</div>
                        </div>
                    </div>}
            </div>
            <div className="text-secondary text-center d-block d-md-none mt-2">Best viewed in desktop!</div>
            <div className="text-secondary text-center d-none d-md-block mt-3">Note: Unselecting <mark>Available Now</mark> will give you access to see the slots of selected date to a week after that. Based on availability.</div>
            <div className="text-center mt-3">
                <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Submit</button>
            </div>
        </div>

        {/* Show results */}

        {Centers.length > 0  && Checked &&
        <div style={{width:'95%', margin:'20px auto'}}>
            <table className="table table-hover table-responsive-sm table-responsive-md">
                <thead className="thead-dark">
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Date</th>
                    <th scope="col">Available Capacity</th>
                    <th scope="col">Vaccine</th>
                    <th scope="col">Age</th>
                    <th scope="col">Center</th>
                    <th scope="col">Address</th>
                    <th scope="col">Pincode</th>
                    <th scope="col">Fees</th>
                    </tr>
                </thead>
                <tbody>{renderTableBody}</tbody>
            </table>
            {renderTableBody.length ? "" : <h3 className="text-center">No Results Found!</h3>}
        </div>}

        {/* week table */}

        {WeekCenters.length > 0  && !Checked &&
        <div style={{width:'95%', margin:'20px auto'}}>
            <table className="table table-hover table-responsive-sm table-responsive-md">
                <thead className="thead-dark">
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Date</th>
                    <th scope="col">Available Capacity</th>
                    <th scope="col">Vaccine</th>
                    <th scope="col">Age</th>
                    <th scope="col">Center</th>
                    <th scope="col">Address</th>
                    <th scope="col">Pincode</th>
                    <th scope="col">Fees</th>
                    </tr>
                </thead>
                <tbody>{renderWeekTableBody}</tbody>
            </table>
            {renderWeekTableBody.length ? "" : <h3 className="text-center">No Results Found!</h3>}
        </div>}
        </>
    )
}

export default SlotsComponent;