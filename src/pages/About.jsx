import React from 'react';

const About = () => {
    return (
        <header className="d-flex masthead bg-white text-dark justify-content-center align-items-center py-5">
            <div className="container">
                <br />
                <br />
                <br />
                <br />
                <br />

                <div className="row justify-content-center text-center">
                    <div className="col-5">
                        {/* <img className="masthead-avatar mb-5" src="assets/img/homepage_icon.png" alt="Homepage Icon" /> */}
                        <h2 className="masthead-subheading mb-2">What’s the app?</h2>
                        <div className="masthead-subheading mb-3">
                            Basing its architecture on the IaC logical concept, idiotCTF tries to represent a software capable of ensuring all its functionalities by using microservices in Flask, a middleware in SpringBoot, and a frontend in ReactJS.
                        </div>
                    </div>
                    <div className="col-1"></div>
                    <div className="col-5">
                        <h2 className="masthead-subheading mb-2">What does it offer?</h2>
                        <div className="masthead-subheading mb-3">
                            In a simple and fancy way, the application is a virtual place where any player can have fun with all the cybersecurity-like challenges inserted in each contest by the administrators. Obviously, each user should have a bit of common sense and avoid using techniques and methodologies that could break or corrupt idiotCTF directly on the application components!
                        </div>
                    </div>
                </div>
                <br />
                <div className="row justify-content-center text-center">
                    <div className="col-md-6 text-center mb-3">
                        <h2 className="masthead-subheading bold mb-3">What's the best part?</h2>
                        <p className="masthead-subheading">
                            Three idiot students of the Master's degree "Engineering in Computer Science" with a common passion: typing on the keyboard until something hopefully good comes to the screen without listening to the screaming fans of the computer.
                        </p>
                    </div>

                    <div className="col-md-2 text-center">
                        <img src="assets/img/staff/Christian.jpg" alt="Image 1" className="img-fluid rounded mb-3" />
                        <p>Christian</p>
                    </div>
                    <div className="col-md-2 text-center">
                        <img src="assets/img/staff/Michele.jpg" alt="Image 2" className="img-fluid rounded mb-3" />
                        <p>Michele</p>
                    </div>
                    <div className="col-md-2 text-center">
                        <img src="assets/img/staff/Lorenzo.jpg" alt="Image 3" className="img-fluid rounded mb-3" />
                        <p>Lorenzo</p>
                    </div>
                </div>
            </div>
        </header>

    );
};

export default About;
