import React, { useState } from 'react'
import sha256 from 'js-sha256';
import axios from 'axios';
import download from 'downloadjs';

function LandingPageComponent() {

    const [Phone, setPhone] = useState("");
    const [txnId, settxnId] = useState("");
    const [Form, setForm] = useState(false);
    const [OTP, setOTP] = useState("");
    const [Token, setToken] = useState("");
    const [toggle, settoggle] = useState(false);
    const [Beneficiaries, setBeneficiaries] = useState([]);
    const [Hide, setHide] = useState(false)

    const onChangeHandler = event => {
        setPhone(event.target.value);
    };

    const onChangeOTP = event => {
        setOTP(event.target.value);
    }

    const submitValue = (e) => {
        e.preventDefault();
        if(!/^\d{10}$/.test(Phone)) {
            alert("please enter valid number")
        }
        else {
            const message = {
                mobile: Phone,
                secret: "U2FsdGVkX19XZI3GMcY5/QkDdE2YYCNwLzpfY/FNy5HUtXWBoH/p7D03FiQDDLPwhjkmu4ZIopZBO2wPCZOW5Q=="
            }
            // var data = '{\r\n    "mobile": "9106744978",\r\n    "secret": "U2FsdGVkX1/K10bXSsDZI+l05XTwv2Hbo7+jbsk7AY******************************DnJPuwHUKOC5A=="\r\n}';

            console.log(JSON.stringify(message))
            fetch("https://cdn-api.co-vin.in/api/v2/auth/generateMobileOTP",
                {method: 'POST',
                headers: {'Accept': 'application/json','Content-Type': 'application/json'},
                body: JSON.stringify(message), 
                redirect:"follow"})
            .then(response => response.json())
            .then(result => {
                console.log(result);
                settxnId(result);
                setForm(!Form);
                alert("OTP sent to mobile");
                setPhone("")
            })
            .catch(error => alert(error));
        }
    }

    const submitOTP = (e) => {
        e.preventDefault();
        if(!/^\d{6}$/.test(OTP)) {
            alert("please enter valid OTP")
        }
        else {
            const msgbody = {
                otp: sha256(OTP),
                txnId: txnId.txnId
            }
            console.log(JSON.stringify(msgbody));

            fetch("https://cdn-api.co-vin.in/api/v2/auth/validateMobileOtp",
                {method: 'POST',
                headers: {'Accept': 'application/json','Content-Type': 'application/json'},
                body: JSON.stringify(msgbody), 
                redirect:"follow"})
            .then(response => response.json())
            .then(response => {
                console.log(response);
                setToken(response);
                alert("OTP Valid");
                setOTP("")
                setForm(!Form)
                setHide(!Hide)
            })
            .catch(error => alert(error));
        }
    }

    const seeInfo = () => {
        axios.get('https://cdn-api.co-vin.in/api/v2/appointment/beneficiaries', {
            headers: {
              Authorization: 'Bearer ' + Token.token
            }
        })
        .then(response => response.data)
        .then(response => {
            console.log(response);
            setBeneficiaries(response.beneficiaries);
            settoggle(!toggle);
        })
        .catch(err => alert(err))
    }

    // for fetching certificate COWIN documation api doesn't work (public or private). I found this from network tab of official cowin website.
    function fetchCertificate(refId) {
        axios.get('https://www.cowin.gov.in/api/v2/registration/certificate/download', {
            params: {
                "beneficiary_reference_id": refId
            }, 
            headers: {
                Authorization: 'Bearer ' + Token.token,
                'Accept': "application/pdf"
            }, responseType: 'blob'
        })
        .then(res => {
            console.log(res.data);
            //setCertificate(res.data);
            download(res.data, "certificate.pdf", "application/pdf");
         })
         .catch(err => console.log(err));
    }

    return (
        <>
            {/* info */}
            <div className="row m-0 mt-3">
                <div className="col-12 col-md-6 offset-md-3">
                    <div className="font-weight-bold text-justify text-dark list-group-item-warning">
                        <li>This is third-party application to check your COWIN related information. It doesn't take your data in any way or collects any information about your visits.
                        Make sure you trust this app before submitting your OTP.</li>
                        <li>Go to <a href="https://www.cowin.gov.in/home" rel="noopener noreferrer" className="text-decoration-none">Official Site</a> if you have any doubts.</li>
                    </div>
                </div>
            </div>

            {Hide && <div className="m-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href='/'>Back to Home</a></li>
                    </ol>
                </nav>
            </div>}
            {!Form && !Hide && <div style={{width:'95%', margin:'20px auto'}}>
                <div className="row">
                    <div className="col-md-2">
                        <div className="font-weight-bold">Mobile No.</div>
                    </div>
                    <div className="col-md-4">
                        <input className="form-control" type="text" placeholder="Enter mobile number" maxLength="10" onChange={onChangeHandler} value={Phone}/>
                    </div>
                </div>
                <div className="row">
                <div className="col-md-2">
                <button className="btn btn-primary mt-3" type="submit" onClick={submitValue}>Submit</button>
                </div>
                </div>
            </div>}

            {Form && !Hide && <div style={{width:'95%', margin:'20px auto'}}>
            <div className="row">
                    <div className="col-md-2">
                        <div className="font-weight-bold">OTP</div>
                    </div>
                    <div className="col-md-4">
                        <input className="form-control" type="text" placeholder="Enter OTP" maxLength="6" onChange={onChangeOTP} value={OTP}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                    <button className="btn btn-primary mt-3" type="submit" onClick={submitOTP}>Submit OTP</button>
                    </div>
                    <div className="mt-md-3 col-md-4 btn text-info" onClick={() => setForm(!Form)}>Click here to enter mobile number again</div>
                </div>
            </div>}
                <div className="m-2 d-none d-sm-block">
                    <div className="col-12 card">Your token: {Token.token ? <label className='text-secondary'>{Token.token}</label> : <label className='text-secondary'>Enter mobile no. and OTP first</label> }</div>
                </div>
                {Token.token && 
                <div className="card border-0 mt-3">
                    <div className="text-center">
                        <button className="btn btn-primary" onClick={seeInfo}>See Beneficiaries</button>
                    </div>
                </div>}
                {toggle &&
                <>
                    <div className="row mt-3 mb-3" style={{width:'95%', margin:'0px 5px auto'}}>
                    {Beneficiaries.map((doc, index) => (
                        <React.Fragment key={index}>
                            <div className="col-12 col-md-4">
                            <div className="card">
                                <div className="card-header font-weight-bold">{doc.name}</div>
                                <div className="card-body font-weight-bold">Gender: {doc.gender}
                                    <div>Mobile: XXXXXX{doc.mobile_number}</div>
                                    <div>ID: {doc.beneficiary_reference_id}</div>
                                    <div>Given ID No. {doc.photo_id_number}</div>
                                    <div className="text-primary">Vaccine: {doc.vaccine}</div>
                                    <div className="text-primary">Vaccination Status: {doc.vaccination_status}</div>
                                    <div>Appointment for 1st dose: {doc.dose1_date ? doc.dose1_date : "Haven't Booked Yet"}</div>
                                    <div>Appointment for 2nd dose: {doc.dose2_date ? doc.dose2_date : "Havn't Booked Yet"}</div>
                                    {doc.dose1_date && <button className="btn btn-primary mt-2" onClick={() => fetchCertificate(doc.beneficiary_reference_id)}>Download Certificate</button>}                          
                                </div>
                            </div>
                            </div>
                        </React.Fragment>
                    ))}
                    </div>
                </>
                }
            </>
    )
}

export default LandingPageComponent