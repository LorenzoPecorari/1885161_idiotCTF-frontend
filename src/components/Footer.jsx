import React from 'react';

const Footer = () => {
    return(
        <footer className="footer text-center">
        <div className="container">
            <div className="row">
                <div className="col-lg-4 mb-5 mb-lg-0">
                    <h4 className="text-uppercase mb-4">Location</h4>
                    <p className="lead mb-0">
                        Nowhere
                        <br />
                        Everywhere
                        <br />
                        Localhost
                    </p>
                </div>
                <div className="col-lg-4 justify-content-center">
                    <h4 className="text-uppercase mb-4">About idiotCTF</h4>
                    <p className="lead mb-0">
                        CaptureTheFlag like application for Laboratory of Advanced Programming course - A.Y. 2024/2025
                    </p>
                </div>
                <div className="col-4 justify-content-center">
                    <h4 className="text-uppercase">Main technologies</h4>
                    <table className="table table-borderless">
                        <tr>
                            <td>
                                <img
                                    className="img-fluid"
                                    src="assets/img/tech_logos/springboot-logo.png"
                                    alt="User image"
                                    style={{ maxWidth: '50px' }}
                                />
                            </td>
                            <td>
                                <img
                                    className="img-fluid"
                                    src="assets/img/tech_logos/docker-logo.png"
                                    alt="User image"
                                    style={{ maxWidth: '50px' }}
                                />
                            </td>
                            <td>
                                <img
                                    className="img-fluid"
                                    src="assets/img/tech_logos/flask-logo.png"
                                    alt="User image"
                                    style={{ maxWidth: '50px' }}
                                />
                            </td>
                            <td>
                                <img
                                    className="img-fluid rounded"
                                    src="assets/img/tech_logos/react-logo.png"
                                    alt="User image"
                                    style={{ maxWidth: '50px' }}
                                />
                            </td>
                        </tr>
                    </table>                    
                </div>
            </div>
        </div>
    </footer>
    )
};

export default Footer

/*
<!-- * * SB Forms Contact Form * *-->
<!-- * * * * * * * * * * * * * * *-->
<!-- This form is pre-integrated with SB Forms.-->
<!-- To make this form functional, sign up at-->
<!-- https://startbootstrap.com/solution/contact-forms-->
<!-- to get an API token!-->
*/
